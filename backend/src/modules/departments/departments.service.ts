import { type DepartmentStatus, type Prisma } from '@prisma/client';
import { prisma } from '@config/prisma';
import { ApiError } from '@shared/errors/ApiError';
import type {
  CreateDepartmentInput,
  UpdateDepartmentInput,
  DepartmentQueryInput,
  DepartmentResponseDto,
  PaginatedDepartmentsResponse,
  DepartmentTreeNode,
} from './departments.types';

const departmentSelect = {
  id: true,
  name: true,
  code: true,
  status: true,
  parentDepartmentId: true,
  headUserId: true,
  deletedAt: true,
  createdAt: true,
  updatedAt: true,
  headUser: {
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
    },
  },
  parentDepartment: {
    select: {
      id: true,
      name: true,
      code: true,
    },
  },
} satisfies Prisma.DepartmentSelect;

type DepartmentQueryResult = Prisma.DepartmentGetPayload<{ select: typeof departmentSelect }>;

const formatDepartment = (dept: DepartmentQueryResult): DepartmentResponseDto => {
  return {
    id: dept.id,
    name: dept.name,
    code: dept.code,
    status: dept.status,
    parentDepartmentId: dept.parentDepartmentId,
    headUserId: dept.headUserId,
    headUser: dept.headUser,
    parentDepartment: dept.parentDepartment,
    createdAt: dept.createdAt,
    updatedAt: dept.updatedAt,
  };
};

// Recursive circular reference check
const detectCycle = async (currentId: string, newParentId: string | null): Promise<boolean> => {
  if (!newParentId) return false;
  if (currentId === newParentId) return true;

  let tempParentId: string | null = newParentId;

  while (tempParentId) {
    const parentRecord: { parentDepartmentId: string | null } | null =
      await prisma.department.findUnique({
        where: { id: tempParentId },
        select: { parentDepartmentId: true },
      });

    if (!parentRecord) break;
    if (parentRecord.parentDepartmentId === currentId) {
      return true;
    }
    tempParentId = parentRecord.parentDepartmentId;
  }

  return false;
};

const createDepartment = async (input: CreateDepartmentInput): Promise<DepartmentResponseDto> => {
  // Check code/name unique
  const existingName = await prisma.department.findFirst({
    where: { name: { equals: input.name, mode: 'insensitive' }, deletedAt: null },
  });
  if (existingName) {
    throw new ApiError(400, 'Department name must be unique');
  }

  const existingCode = await prisma.department.findFirst({
    where: { code: { equals: input.code, mode: 'insensitive' }, deletedAt: null },
  });
  if (existingCode) {
    throw new ApiError(400, 'Department code must be unique');
  }

  // Validate Parent
  if (input.parentDepartmentId) {
    const parent = await prisma.department.findUnique({
      where: { id: input.parentDepartmentId },
    });
    if (!parent || parent.deletedAt) {
      throw new ApiError(404, 'Parent department not found');
    }
  }

  // Validate Head User
  if (input.headUserId) {
    const headUser = await prisma.user.findUnique({
      where: { id: input.headUserId },
      select: { id: true, departmentId: true, deletedAt: true },
    });
    if (!headUser || headUser.deletedAt) {
      throw new ApiError(404, 'Selected Head User not found');
    }
    // Head User must belong to the department, but during creation, since department doesn't exist yet,
    // we can either verify after creation, or verify departmentId matches if we set it.
    // However, if the department is new, the user's departmentId won't match yet.
    // So if creating a new department, we temporarily allow assigning a head user,
    // and then update the user's department to this department id.
  }

  const department = await prisma.department.create({
    data: {
      name: input.name,
      code: input.code.toUpperCase(),
      parentDepartmentId: input.parentDepartmentId || null,
      headUserId: input.headUserId || null,
    },
    select: departmentSelect,
  });

  // If headUserId was specified, update that user to belong to this department
  if (input.headUserId) {
    await prisma.user.update({
      where: { id: input.headUserId },
      data: {
        departmentId: department.id,
        role: 'DEPARTMENT_HEAD',
      },
    });
  }

  return formatDepartment(department);
};

const updateDepartment = async (
  id: string,
  input: UpdateDepartmentInput,
): Promise<DepartmentResponseDto> => {
  const currentDept = await prisma.department.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      code: true,
      headUserId: true,
      parentDepartmentId: true,
      status: true,
    },
  });

  if (!currentDept) {
    throw new ApiError(404, 'Department not found');
  }

  // Unique validation
  if (input.name && input.name.toLowerCase() !== currentDept.name.toLowerCase()) {
    const existingName = await prisma.department.findFirst({
      where: { name: { equals: input.name, mode: 'insensitive' }, deletedAt: null },
    });
    if (existingName) {
      throw new ApiError(400, 'Department name must be unique');
    }
  }

  if (input.code && input.code.toUpperCase() !== currentDept.code.toUpperCase()) {
    const existingCode = await prisma.department.findFirst({
      where: { code: { equals: input.code, mode: 'insensitive' }, deletedAt: null },
    });
    if (existingCode) {
      throw new ApiError(400, 'Department code must be unique');
    }
  }

  // Parent & Cycle check
  if (input.parentDepartmentId !== undefined) {
    if (input.parentDepartmentId) {
      const parent = await prisma.department.findUnique({
        where: { id: input.parentDepartmentId },
      });
      if (!parent || parent.deletedAt) {
        throw new ApiError(404, 'Parent department not found');
      }

      const hasCycle = await detectCycle(id, input.parentDepartmentId);
      if (hasCycle) {
        throw new ApiError(400, 'Cannot set parent department that creates a circular hierarchy');
      }
    }
  }

  // Deactivation check
  if (input.status === 'INACTIVE' && currentDept.status === 'ACTIVE') {
    // Check active employees
    const activeEmployeesCount = await prisma.user.count({
      where: { departmentId: id, status: 'ACTIVE', deletedAt: null },
    });
    if (activeEmployeesCount > 0) {
      throw new ApiError(400, 'Cannot deactivate department with active employees');
    }

    // Check active assets
    const assetsCount = await prisma.asset.count({
      where: { departmentId: id, status: { notIn: ['RETIRED', 'DISPOSED'] } },
    });
    if (assetsCount > 0) {
      throw new ApiError(400, 'Cannot deactivate department with assigned assets');
    }
  }

  // Head User checks
  if (input.headUserId) {
    const headUser = await prisma.user.findUnique({
      where: { id: input.headUserId },
      select: { id: true, departmentId: true, deletedAt: true, status: true },
    });

    if (!headUser || headUser.deletedAt || headUser.status !== 'ACTIVE') {
      throw new ApiError(400, 'Selected Head User must be an active employee');
    }

    // Must belong to this department
    if (headUser.departmentId !== id) {
      throw new ApiError(400, 'Department Head must belong to the same department');
    }
  }

  const updated = await prisma.department.update({
    where: { id },
    data: {
      name: input.name,
      code: input.code ? input.code.toUpperCase() : undefined,
      parentDepartmentId: input.parentDepartmentId,
      headUserId: input.headUserId,
      status: input.status,
    },
    select: departmentSelect,
  });

  // If headUserId was changed, set user's role to DEPARTMENT_HEAD
  if (input.headUserId && input.headUserId !== currentDept.headUserId) {
    await prisma.user.update({
      where: { id: input.headUserId },
      data: { role: 'DEPARTMENT_HEAD' },
    });
  }

  return formatDepartment(updated);
};

const getDepartments = async (
  query: DepartmentQueryInput,
): Promise<PaginatedDepartmentsResponse> => {
  const page = query.page ?? 1;
  const limit = query.limit ?? 10;
  const skip = (page - 1) * limit;

  const where: Prisma.DepartmentWhereInput = {
    deletedAt: null,
  };

  if (query.status) {
    where.status = query.status;
  }

  if (query.search) {
    const searchLower = query.search.toLowerCase();
    where.OR = [
      { name: { contains: searchLower, mode: 'insensitive' } },
      { code: { contains: searchLower, mode: 'insensitive' } },
    ];
  }

  const [departments, total] = await Promise.all([
    prisma.department.findMany({
      where,
      select: departmentSelect,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.department.count({ where }),
  ]);

  return {
    departments: departments.map(formatDepartment),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

const getDepartmentById = async (id: string): Promise<DepartmentResponseDto> => {
  const dept = await prisma.department.findUnique({
    where: { id },
    select: departmentSelect,
  });

  if (!dept || dept.deletedAt) {
    throw new ApiError(404, 'Department not found');
  }

  return formatDepartment(dept);
};

const deleteDepartment = async (id: string): Promise<void> => {
  const dept = await prisma.department.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!dept) {
    throw new ApiError(404, 'Department not found');
  }

  // Check active employees
  const activeEmployees = await prisma.user.count({
    where: { departmentId: id, deletedAt: null },
  });
  if (activeEmployees > 0) {
    throw new ApiError(400, 'Cannot delete department with assigned employees');
  }

  // Check assets
  const assetsCount = await prisma.asset.count({
    where: { departmentId: id },
  });
  if (assetsCount > 0) {
    throw new ApiError(400, 'Cannot delete department with assigned assets');
  }

  await prisma.department.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};

const getDepartmentTree = async (): Promise<DepartmentTreeNode[]> => {
  // Fetch active departments
  const departments = await prisma.department.findMany({
    where: { deletedAt: null, status: 'ACTIVE' },
    select: {
      id: true,
      name: true,
      code: true,
      status: true,
      parentDepartmentId: true,
      headUserId: true,
    },
  });

  const nodeMap = new Map<string, DepartmentTreeNode>();

  departments.forEach((dept) => {
    nodeMap.set(dept.id, {
      ...dept,
      children: [],
    });
  });

  const tree: DepartmentTreeNode[] = [];

  nodeMap.forEach((node) => {
    if (node.parentDepartmentId) {
      const parent = nodeMap.get(node.parentDepartmentId);
      if (parent) {
        parent.children.push(node);
      } else {
        tree.push(node);
      }
    } else {
      tree.push(node);
    }
  });

  return tree;
};

export const departmentsService = {
  createDepartment,
  updateDepartment,
  getDepartments,
  getDepartmentById,
  deleteDepartment,
  getDepartmentTree,
};
