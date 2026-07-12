import type { AuthResponse, AuthUser } from '@/src/types/auth';

const STORAGE_KEY = 'assetflow_auth_session';

export interface AuthSession {
    accessToken: string;
    refreshToken?: string | null;
    user: AuthUser;
}

export const saveAuthSession = (session: AuthSession): void => {
    if (typeof window === 'undefined') {
        return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
};

export const getAuthSession = (): AuthSession | null => {
    if (typeof window === 'undefined') {
        return null;
    }

    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
        return null;
    }

    try {
        return JSON.parse(raw) as AuthSession;
    } catch {
        return null;
    }
};

export const clearAuthSession = (): void => {
    if (typeof window === 'undefined') {
        return;
    }

    window.localStorage.removeItem(STORAGE_KEY);
};
