import { type Role, type Prisma } from '@prisma/client';
import { prisma } from '@config/prisma';
import { ApiError } from '@shared/errors/ApiError';
import type { UsersQueryInput, PaginatedUsersResponse, UserResponseDto } from './users.types';

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

const updateRole = async (userId: string, role: Role): Promise<UserResponseDto> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true },
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // Task 6: ADMIN should not be assignable through this API
  if (role === 'ADMIN') {
    throw new ApiError(400, 'ADMIN role cannot be assigned through this API');
  }

  // Update role and increment tokenVersion to force token invalidation / re-login
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      role,
      tokenVersion: { increment: 1 },
    },
    select: userSelect,
  });

  return formatUser(updatedUser);
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

export const usersService = {
  updateRole,
  getUsers,
};
