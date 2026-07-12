import React from "react";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

interface ValidationMessageProps {
  message?: string;
  state?: "valid" | "error" | "default";
}

export function ValidationMessage({ message, state = "error" }: ValidationMessageProps) {
  if (!message) return null;

  return (
    <div
      className={`flex items-center gap-1.5 mt-1.5 text-sm font-medium transition-all animate-in slide-in-from-top-1 fade-in-0 duration-300 ${
        state === "valid"
          ? "text-green-600"
          : state === "error"
          ? "text-red-500"
          : "text-slate-500"
      }`}
      role="alert"
    >
      {state === "valid" && <CheckCircle2 className="w-4 h-4" />}
      {state === "error" && <XCircle className="w-4 h-4" />}
      {state === "default" && <AlertCircle className="w-4 h-4" />}
      <span>{message}</span>
    </div>
  );
}
