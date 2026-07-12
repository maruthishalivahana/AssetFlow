import type { Role, UserStatus } from '@prisma/client';

export interface CreateEmployeeInput {
  firstName: string;
  lastName: string;
  email: string;
  password?: string; // Optional: default to a standard password if not provided
  phone?: string | null;
  employeeCode?: string | null;
  jobTitle?: string | null;
  departmentId?: string | null;
  role?: Role;
}

export interface UpdateEmployeeInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string | null;
  employeeCode?: string | null;
  jobTitle?: string | null;
  departmentId?: string | null;
  role?: Role;
  status?: UserStatus;
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

export interface UserDropdownItem {
  id: string;
  name: string;
}
