import type { AuthLoginInput, AuthRegisterInput, AuthResponse, ApiResponse, AuthUser } from '../types/auth';
import api from './api';

const getData = <T>(response: { data: ApiResponse<T> }): T => {
    return response.data.data;
};

export const authService = {
    register: async (payload: AuthRegisterInput): Promise<AuthResponse> => {
        const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', payload);
        return getData(response);
    },

    login: async (payload: AuthLoginInput): Promise<AuthResponse> => {
        const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', payload);
        return getData(response);
    },

    fetchCurrentUser: async (): Promise<AuthUser> => {
        const response = await api.get<ApiResponse<{ user: AuthUser }>>('/auth/me');
        return getData(response).user;
    },
};
