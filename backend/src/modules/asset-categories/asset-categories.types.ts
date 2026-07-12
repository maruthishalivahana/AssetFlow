import type { CategoryStatus } from '@prisma/client';

export interface CustomFieldConfig {
  name: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'date';
  required: boolean;
}

export interface CreateCategoryInput {
  name: string;
  code: string;
  description?: string | null;
  parentCategoryId?: string | null;
  customFields?: CustomFieldConfig[];
}

export interface UpdateCategoryInput {
  name?: string;
  code?: string;
  description?: string | null;
  parentCategoryId?: string | null;
  status?: CategoryStatus;
  customFields?: CustomFieldConfig[];
}

export interface CategoryQueryInput {
  page?: number;
  limit?: number;
  search?: string;
  status?: CategoryStatus;
}

export interface CategoryResponseDto {
  id: string;
  name: string;
  code: string;
  description: string | null;
  status: CategoryStatus;
  parentCategoryId: string | null;
  customFields: CustomFieldConfig[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedCategoriesResponse {
  categories: CategoryResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CategoryTreeNode {
  id: string;
  name: string;
  code: string;
  status: CategoryStatus;
  parentCategoryId: string | null;
  customFields: CustomFieldConfig[];
  children: CategoryTreeNode[];
}
