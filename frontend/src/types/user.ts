import { AuthUser } from "./auth";

export interface PaginatedUsers {
  users: AuthUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UserDropdownItem {
  id: string;
  name: string;
}

export interface CreateUserInput {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phone?: string;
  employeeCode?: string;
  jobTitle?: string;
  departmentId?: string;
  role?: string;
}

export interface UpdateUserInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  employeeCode?: string;
  jobTitle?: string;
  departmentId?: string;
  role?: string;
  status?: string;
}
