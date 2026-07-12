"use client";

import { useEffect } from "react";
import { useAuth } from "../src/hooks/useAuth";
import { useAuthGuard } from "../src/middleware/authGuard";

export function AuthInitializer() {
    const { restoreSession } = useAuth();
    useAuthGuard();

    useEffect(() => {
        restoreSession();
    }, [restoreSession]);

    return null;
}
