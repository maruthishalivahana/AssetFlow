import api from './api';
import type { 
    Department, 
    AssetCategory, 
    CreateDepartmentInput, 
    UpdateDepartmentInput,
    CreateCategoryInput,
    UpdateCategoryInput,
    PaginatedDepartments,
    PaginatedCategories
} from '../types/organization';

export const organizationService = {
    // Departments
    async getDepartments(params?: { page?: number; limit?: number; search?: string; status?: string }): Promise<PaginatedDepartments> {
        const response = await api.get('/departments', { params });
        return response.data.data ? response.data.data : response.data;
    },

    async getDepartmentById(id: string): Promise<Department> {
        const response = await api.get(`/departments/${id}`);
        return response.data.data ? response.data.data : response.data;
    },

    async createDepartment(data: CreateDepartmentInput): Promise<Department> {
        const response = await api.post('/departments', data);
        return response.data.data ? response.data.data : response.data;
    },

    async updateDepartment(id: string, data: UpdateDepartmentInput): Promise<Department> {
        const response = await api.patch(`/departments/${id}`, data);
        return response.data.data ? response.data.data : response.data;
    },

    async deleteDepartment(id: string): Promise<void> {
        await api.delete(`/departments/${id}`);
    },

    // Categories
    async getCategories(params?: { page?: number; limit?: number; search?: string; status?: string }): Promise<PaginatedCategories> {
        const response = await api.get('/asset-categories', { params });
        return response.data.data ? response.data.data : response.data;
    },

    async getCategoryById(id: string): Promise<AssetCategory> {
        const response = await api.get(`/asset-categories/${id}`);
        return response.data.data ? response.data.data : response.data;
    },

    async createCategory(data: CreateCategoryInput): Promise<AssetCategory> {
        const response = await api.post('/asset-categories', data);
        return response.data.data ? response.data.data : response.data;
    },

    async updateCategory(id: string, data: UpdateCategoryInput): Promise<AssetCategory> {
        const response = await api.patch(`/asset-categories/${id}`, data);
        return response.data.data ? response.data.data : response.data;
    },

    async deleteCategory(id: string): Promise<void> {
        await api.delete(`/asset-categories/${id}`);
    }
};
