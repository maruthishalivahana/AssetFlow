import type { Role, UserStatus } from '@prisma/client';

export interface UpdateRoleInput {
  role: Role;
}

export interface UserResponseDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string | null;
  employeeCode: string | null;
  jobTitle: string | null;
  role: Role;
  status: UserStatus;
  departmentId: string | null;
  department?: {
    id: string;
    name: string;
    code: string;
  } | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UsersQueryInput {
  page?: number;
  limit?: number;
  search?: string;
  role?: Role;
  status?: UserStatus;
  departmentId?: string;
}

export interface PaginatedUsersResponse {
  users: UserResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
