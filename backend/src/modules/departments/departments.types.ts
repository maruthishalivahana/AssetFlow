import type { DepartmentStatus } from '@prisma/client';

export interface CreateDepartmentInput {
  name: string;
  code: string;
  parentDepartmentId?: string | null;
  headUserId?: string | null;
}

export interface UpdateDepartmentInput {
  name?: string;
  code?: string;
  parentDepartmentId?: string | null;
  headUserId?: string | null;
  status?: DepartmentStatus;
}

export interface DepartmentQueryInput {
  page?: number;
  limit?: number;
  search?: string;
  status?: DepartmentStatus;
}

export interface DepartmentResponseDto {
  id: string;
  name: string;
  code: string;
  status: DepartmentStatus;
  parentDepartmentId: string | null;
  headUserId: string | null;
  headUser?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  } | null;
  parentDepartment?: {
    id: string;
    name: string;
    code: string;
  } | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedDepartmentsResponse {
  departments: DepartmentResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DepartmentTreeNode {
  id: string;
  name: string;
  code: string;
  status: DepartmentStatus;
  parentDepartmentId: string | null;
  headUserId: string | null;
  children: DepartmentTreeNode[];
}
