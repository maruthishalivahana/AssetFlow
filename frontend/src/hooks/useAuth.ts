import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { performLogout, restoreAuthSession } from "../store/actions/authActions";
export const useAuth = () => {
    const dispatch = useAppDispatch();
    const auth = useAppSelector((state) => state.auth);

    const restoreSession = useCallback(async () => {
        await dispatch(restoreAuthSession());
    }, [dispatch]);

    const logout = useCallback(() => {
        dispatch(performLogout());
    }, [dispatch]);

    return {
        ...auth,
        restoreSession,
        logout,
    };
};
