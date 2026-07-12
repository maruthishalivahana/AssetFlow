"use client";

import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ReduxProvider } from "../src/store/provider";
import { AuthInitializer } from "./AuthInitializer";

interface ProvidersProps {
    children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
    return (
        <ReduxProvider>
            <TooltipProvider>
                <AuthInitializer />
                {children}
                <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
            </TooltipProvider>
        </ReduxProvider>
    );
}
