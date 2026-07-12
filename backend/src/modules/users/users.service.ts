import { type Role, type UserStatus, type Prisma } from '@prisma/client';
import { prisma } from '@config/prisma';
import { ApiError } from '@shared/errors/ApiError';
import { hashPassword } from '@shared/utils/hash';
import type {
  UsersQueryInput,
  PaginatedUsersResponse,
  UserResponseDto,
  CreateEmployeeInput,
  UpdateEmployeeInput,
  UserDropdownItem,
} from './users.types';

const userSelect = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  phone: true,
  employeeCode: true,
  jobTitle: true,
  role: true,
  status: true,
  departmentId: true,
  deletedAt: true,
  createdAt: true,
  updatedAt: true,
  department: {
    select: {
      id: true,
      name: true,
      code: true,
    },
  },
} satisfies Prisma.UserSelect;

type UserQueryResult = Prisma.UserGetPayload<{ select: typeof userSelect }>;

const formatUser = (user: UserQueryResult): UserResponseDto => {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: `${user.firstName} ${user.lastName}`.trim(),
    phone: user.phone,
    employeeCode: user.employeeCode,
    jobTitle: user.jobTitle,
    role: user.role,
    status: user.status,
    departmentId: user.departmentId,
    department: user.department,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

const checkDeactivationBlock = async (userId: string): Promise<void> => {
  // 1. Active allocations
  const activeAllocations = await prisma.assetAllocation.count({
    where: { assignedToUserId: userId, status: 'ACTIVE' },
  });
  if (activeAllocations > 0) {
    throw new ApiError(400, 'Cannot deactivate/delete user with active asset allocations');
  }

  // 2. Pending bookings
  const pendingBookings = await prisma.booking.count({
    where: { requestedByUserId: userId, status: 'PENDING' },
  });
  if (pendingBookings > 0) {
    throw new ApiError(400, 'Cannot deactivate/delete user with pending resource bookings');
  }

  // 3. Pending transfer requests
  const pendingTransfers = await prisma.assetTransferRequest.count({
    where: { requestedByUserId: userId, status: 'PENDING' },
  });
  if (pendingTransfers > 0) {
    throw new ApiError(400, 'Cannot deactivate/delete user with pending asset transfer requests');
  }

  // 4. Pending maintenance requests
  const pendingMaintenance = await prisma.maintenanceRequest.count({
    where: { requestedByUserId: userId, status: 'PENDING' },
  });
  if (pendingMaintenance > 0) {
    throw new ApiError(400, 'Cannot deactivate/delete user with pending maintenance requests');
  }
};

const createEmployee = async (input: CreateEmployeeInput): Promise<UserResponseDto> => {
  // Check unique email
  const existingEmail = await prisma.user.findFirst({
    where: { email: { equals: input.email, mode: 'insensitive' }, deletedAt: null },
  });
  if (existingEmail) {
    throw new ApiError(400, 'Email already exists');
  }

  // Check unique employee code
  if (input.employeeCode) {
    const existingCode = await prisma.user.findFirst({
      where: { employeeCode: { equals: input.employeeCode, mode: 'insensitive' }, deletedAt: null },
    });
    if (existingCode) {
      throw new ApiError(400, 'Employee code must be unique');
    }
  }

  // Check if department is active: "Inactive departments cannot receive new employees."
  if (input.departmentId) {
    const dept = await prisma.department.findUnique({
      where: { id: input.departmentId },
      select: { status: true, deletedAt: true },
    });
    if (!dept || dept.deletedAt) {
      throw new ApiError(404, 'Department not found');
    }
    if (dept.status === 'INACTIVE') {
      throw new ApiError(400, 'Cannot assign employee to an inactive department');
    }
  }

  // Department Head check
  if (input.role === 'DEPARTMENT_HEAD') {
    if (!input.departmentId) {
      throw new ApiError(400, 'Department ID is required to set a Department Head');
    }
    // Check if department already has a head
    const existingHead = await prisma.department.findUnique({
      where: { id: input.departmentId },
      select: { headUserId: true },
    });
    if (existingHead?.headUserId) {
      throw new ApiError(400, 'Department already has an assigned Department Head');
    }
  }

  const defaultPassword = input.password || 'AssetFlow@123';
  const passwordHash = await hashPassword(defaultPassword);

  const user = await prisma.user.create({
    data: {
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email.toLowerCase(),
      passwordHash,
      phone: input.phone,
      employeeCode: input.employeeCode,
      jobTitle: input.jobTitle,
      departmentId: input.departmentId || null,
      role: input.role || 'EMPLOYEE',
      status: 'ACTIVE',
    },
    select: userSelect,
  });

  // If user is department head, automatically update the department headUserId
  if (input.role === 'DEPARTMENT_HEAD' && input.departmentId) {
    await prisma.department.update({
      where: { id: input.departmentId },
      data: { headUserId: user.id },
    });
  }

  return formatUser(user);
};

const updateEmployee = async (id: string, input: UpdateEmployeeInput): Promise<UserResponseDto> => {
  const currentUserRecord = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      employeeCode: true,
      departmentId: true,
      role: true,
      status: true,
    },
  });

  if (!currentUserRecord) {
    throw new ApiError(404, 'User not found');
  }

  // Deactivation check
  if (input.status === 'INACTIVE' && currentUserRecord.status === 'ACTIVE') {
    await checkDeactivationBlock(id);
  }

  // Unique email checks
  if (input.email && input.email.toLowerCase() !== currentUserRecord.email.toLowerCase()) {
    const existingEmail = await prisma.user.findFirst({
      where: { email: { equals: input.email, mode: 'insensitive' }, deletedAt: null },
    });
    if (existingEmail) {
      throw new ApiError(400, 'Email already exists');
    }
  }

  // Unique employee code checks
  if (
    input.employeeCode &&
    input.employeeCode.toLowerCase() !== currentUserRecord.employeeCode?.toLowerCase()
  ) {
    const existingCode = await prisma.user.findFirst({
      where: { employeeCode: { equals: input.employeeCode, mode: 'insensitive' }, deletedAt: null },
    });
    if (existingCode) {
      throw new ApiError(400, 'Employee code must be unique');
    }
  }

  // Department active checks
  const targetDeptId =
    input.departmentId !== undefined ? input.departmentId : currentUserRecord.departmentId;
  if (input.departmentId && input.departmentId !== currentUserRecord.departmentId) {
    const dept = await prisma.department.findUnique({
      where: { id: input.departmentId },
      select: { status: true, deletedAt: true },
    });
    if (!dept || dept.deletedAt) {
      throw new ApiError(404, 'Department not found');
    }
    if (dept.status === 'INACTIVE') {
      throw new ApiError(400, 'Cannot assign employee to an inactive department');
    }
  }

  // Role changed to DEPARTMENT_HEAD logic
  const targetRole = input.role !== undefined ? input.role : currentUserRecord.role;
  if (input.role === 'DEPARTMENT_HEAD' && currentUserRecord.role !== 'DEPARTMENT_HEAD') {
    if (targetDeptId) {
      // Check if target department already has a head
      const existingHead = await prisma.department.findUnique({
        where: { id: targetDeptId },
        select: { headUserId: true },
      });
      if (existingHead?.headUserId && existingHead.headUserId !== id) {
        throw new ApiError(400, 'Department already has an assigned Department Head');
      }
    }
  }

  // Clear department for admin role
  let finalDepartmentId = input.departmentId;
  if (targetRole === 'ADMIN') {
    finalDepartmentId = null;
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email ? input.email.toLowerCase() : undefined,
      phone: input.phone,
      employeeCode: input.employeeCode,
      jobTitle: input.jobTitle,
      departmentId: finalDepartmentId,
      role: input.role,
      status: input.status,
      // If role or status changes, force session expiration
      tokenVersion:
        (input.role && input.role !== currentUserRecord.role) ||
        (input.status && input.status !== currentUserRecord.status)
          ? { increment: 1 }
          : undefined,
    },
    select: userSelect,
  });

  // Department Head Sync logic:
  // 1. If user is set to DEPARTMENT_HEAD, sync to new department
  if (targetRole === 'DEPARTMENT_HEAD' && targetDeptId) {
    await prisma.department.update({
      where: { id: targetDeptId },
      data: { headUserId: id },
    });
  }

  // 2. If user WAS DEPARTMENT_HEAD but role changed or department changed, clear old department's headUserId
  if (currentUserRecord.role === 'DEPARTMENT_HEAD') {
    if (
      targetRole !== 'DEPARTMENT_HEAD' ||
      (input.departmentId && input.departmentId !== currentUserRecord.departmentId)
    ) {
      if (currentUserRecord.departmentId) {
        // Only clear if the department's headUserId is still pointing to this user
        const oldDept = await prisma.department.findUnique({
          where: { id: currentUserRecord.departmentId },
          select: { headUserId: true },
        });
        if (oldDept?.headUserId === id) {
          await prisma.department.update({
            where: { id: currentUserRecord.departmentId },
            data: { headUserId: null },
          });
        }
      }
    }
  }

  return formatUser(updatedUser);
};

const updateRole = async (userId: string, role: Role): Promise<UserResponseDto> => {
  if (role === 'ADMIN') {
    throw new ApiError(400, 'ADMIN role cannot be assigned through this API');
  }
  return updateEmployee(userId, { role });
};

const getUsers = async (query: UsersQueryInput): Promise<PaginatedUsersResponse> => {
  const page = query.page ?? 1;
  const limit = query.limit ?? 10;
  const skip = (page - 1) * limit;

  const where: Prisma.UserWhereInput = {
    deletedAt: null,
  };

  if (query.role) {
    where.role = query.role;
  }

  if (query.status) {
    where.status = query.status;
  }

  if (query.departmentId) {
    where.departmentId = query.departmentId;
  }

  if (query.search) {
    const searchLower = query.search.toLowerCase();
    where.OR = [
      { firstName: { contains: searchLower, mode: 'insensitive' } },
      { lastName: { contains: searchLower, mode: 'insensitive' } },
      { email: { contains: searchLower, mode: 'insensitive' } },
      { employeeCode: { contains: searchLower, mode: 'insensitive' } },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: userSelect,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users: users.map(formatUser),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

const getUserById = async (id: string): Promise<UserResponseDto> => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: userSelect,
  });

  if (!user || user.deletedAt) {
    throw new ApiError(404, 'User not found');
  }

  return formatUser(user);
};

const deleteEmployee = async (id: string): Promise<void> => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, departmentId: true, role: true },
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // Check active allocations & pending approvals before deletion
  await checkDeactivationBlock(id);

  await prisma.user.update({
    where: { id },
    data: {
      deletedAt: new Date(),
      status: 'INACTIVE',
      tokenVersion: { increment: 1 },
    },
  });

  // If user was department head, update department headUserId to null
  if (user.role === 'DEPARTMENT_HEAD' && user.departmentId) {
    const dept = await prisma.department.findUnique({
      where: { id: user.departmentId },
      select: { headUserId: true },
    });
    if (dept?.headUserId === id) {
      await prisma.department.update({
        where: { id: user.departmentId },
        data: { headUserId: null },
      });
    }
  }
};

const getUsersDropdown = async (): Promise<UserDropdownItem[]> => {
  const users = await prisma.user.findMany({
    where: { deletedAt: null, status: 'ACTIVE' },
    select: {
      id: true,
      firstName: true,
      lastName: true,
    },
    orderBy: { firstName: 'asc' },
  });

  return users.map((u) => ({
    id: u.id,
    name: `${u.firstName} ${u.lastName}`.trim(),
  }));
};

export const usersService = {
  createEmployee,
  updateEmployee,
  updateRole,
  getUsers,
  getUserById,
  deleteEmployee,
  getUsersDropdown,
};
