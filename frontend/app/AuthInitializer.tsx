"use client";

import { useEffect } from "react";
import { useAuth } from "../src/hooks/useAuth";

export function AuthInitializer() {
    const { restoreSession } = useAuth();

    useEffect(() => {
        restoreSession();
    }, [restoreSession]);

    return null;
}
