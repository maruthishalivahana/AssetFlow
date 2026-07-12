import axios, { AxiosError } from 'axios';
import { clearAuthSession, getAuthSession } from '../utils/authStorage';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5000/api';

const client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

const getAuthorizationHeader = (): string | null => {
    if (typeof window === 'undefined') {
        return null;
    }

    const session = getAuthSession();

    if (!session?.accessToken) {
        return null;
    }

    return `Bearer ${session.accessToken}`;
};

const handleUnauthorized = (): void => {
    clearAuthSession();

    if (typeof window !== 'undefined') {
        window.location.href = '/signin';
    }
};

client.interceptors.request.use((config) => {
    const authHeader = getAuthorizationHeader();

    if (authHeader && config.headers) {
        config.headers = {
            ...config.headers,
            Authorization: authHeader,
        };
    }

    return config;
});

client.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        const status = error.response?.status;

        if (status === 401 || status === 403) {
            handleUnauthorized();
        }

        return Promise.reject(error);
    },
);

export const getApiErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        const response = error.response?.data as { message?: string } | undefined;

        if (response?.message) {
            return response.message;
        }

        return error.message || 'An unexpected error occurred.';
    }

    if (error instanceof Error) {
        return error.message;
    }

    return 'An unexpected error occurred.';
};

export default client;
