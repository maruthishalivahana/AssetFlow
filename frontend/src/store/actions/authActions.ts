import type { AppDispatch } from '../index';
import { loginFailure, loginStart, loginSuccess, logout } from '../slices/authSlice';
import { authService } from '../../services/auth.service';
import { clearAuthSession, saveAuthSession, getAuthSession } from '../../utils/authStorage';
import { getApiErrorMessage } from '../../services/api';
import type { AuthLoginInput, AuthRegisterInput } from '../../types/auth';

export const performLogin = (payload: AuthLoginInput) => async (dispatch: AppDispatch) => {
    dispatch(loginStart());

    try {
        const result = await authService.login(payload);

        const session = {
            accessToken: result.token,
            refreshToken: result.refreshToken ?? null,
            user: result.user,
        };

        saveAuthSession(session);
        dispatch(loginSuccess(session));

        return result;
    } catch (error) {
        const message = getApiErrorMessage(error);
        dispatch(loginFailure(message));
        throw new Error(message);
    }
};

export const performRegister = (payload: AuthRegisterInput) => async (dispatch: AppDispatch) => {
    dispatch(loginStart());

    try {
        const result = await authService.register(payload);

        if (result.token) {
            const session = {
                accessToken: result.token,
                refreshToken: result.refreshToken ?? null,
                user: result.user,
            };

            saveAuthSession(session);
            dispatch(loginSuccess(session));
            return result;
        }

        clearAuthSession();
        dispatch(logout());
        return result;
    } catch (error) {
        const message = getApiErrorMessage(error);
        dispatch(loginFailure(message));
        throw new Error(message);
    }
};

export const restoreAuthSession = () => async (dispatch: AppDispatch) => {
    const session = getAuthSession();

    if (!session?.accessToken || !session.user) {
        clearAuthSession();
        dispatch(logout());
        return;
    }

    dispatch(loginStart());

    try {
        const user = await authService.fetchCurrentUser();

        const restored = {
            accessToken: session.accessToken,
            refreshToken: session.refreshToken ?? null,
            user,
        };

        saveAuthSession(restored);
        dispatch(loginSuccess(restored));
    } catch {
        clearAuthSession();
        dispatch(logout());
    }
};

export const performLogout = () => (dispatch: AppDispatch) => {
    clearAuthSession();
    dispatch(logout());
};
