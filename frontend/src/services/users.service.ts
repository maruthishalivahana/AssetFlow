import api from './api';
import { AuthUser, ApiResponse } from '../types/auth';
import { PaginatedUsers, UserDropdownItem, CreateUserInput, UpdateUserInput } from '../types/user';

export const usersService = {
  async getUsers(params?: { page?: number; limit?: number; search?: string; role?: string; status?: string; departmentId?: string }): Promise<PaginatedUsers> {
    const response = await api.get('/users', { params });
    return response.data?.data || response.data;
  },

  async getUserById(id: string): Promise<AuthUser> {
    const response = await api.get(`/users/${id}`);
    return response.data?.data || response.data;
  },

  async createEmployee(data: CreateUserInput): Promise<AuthUser> {
    const response = await api.post('/users', data);
    return response.data?.data || response.data;
  },

  async updateEmployee(id: string, data: UpdateUserInput): Promise<AuthUser> {
    const response = await api.patch(`/users/${id}`, data);
    return response.data?.data || response.data;
  },

  async deleteEmployee(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  },

  async getUsersDropdown(): Promise<UserDropdownItem[]> {
    const response = await api.get('/users/dropdown');
    return response.data?.data || response.data;
  }
};
