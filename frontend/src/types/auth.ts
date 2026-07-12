export interface AuthUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    department?: {
        id: string;
        name: string;
        code: string;
    } | null;
    phone?: string | null;
    employeeCode?: string | null;
    jobTitle?: string | null;
    status?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
}

export interface AuthResponse {
    user: AuthUser;
    token: string;
    refreshToken?: string | null;
}

export interface AuthLoginInput {
    email: string;
    password: string;
}

export interface AuthRegisterInput {
    fullName: string;
    email: string;
    password: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}
