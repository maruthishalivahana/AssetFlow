export interface DepartmentUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface ParentDepartment {
  id: string;
  name: string;
  code: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  status: "ACTIVE" | "INACTIVE";
  parentDepartmentId: string | null;
  headUserId: string | null;
  headUser: DepartmentUser | null;
  parentDepartment: ParentDepartment | null;
  createdAt: string;
  updatedAt: string;
  // Fallbacks for UI that isn't connected to backend aggregates yet
  employeesCount?: number;
  assetsCount?: number;
}

export interface AssetCategory {
  id: string;
  name: string;
  code: string;
  description: string | null;
  status: "ACTIVE" | "INACTIVE";
  parentCategoryId: string | null;
  parentCategory: {
    id: string;
    name: string;
    code: string;
  } | null;
  createdAt: string;
  updatedAt: string;
  // Fallback for UI
  assetsCount?: number;
}

export interface PaginatedDepartments {
  departments: Department[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedCategories {
  categories: AssetCategory[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateDepartmentInput {
  name: string;
  code: string;
  parentDepartmentId?: string;
  headUserId?: string;
}

export interface UpdateDepartmentInput {
  name?: string;
  code?: string;
  status?: "ACTIVE" | "INACTIVE";
  parentDepartmentId?: string;
  headUserId?: string;
}

export interface CreateCategoryInput {
  name: string;
  code: string;
  description?: string;
  parentCategoryId?: string;
}

export interface UpdateCategoryInput {
  name?: string;
  code?: string;
  description?: string;
  status?: "ACTIVE" | "INACTIVE";
  parentCategoryId?: string;
}
