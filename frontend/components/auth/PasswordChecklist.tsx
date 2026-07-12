import React from "react";
import { CheckCircle2, Circle, XCircle } from "lucide-react";

interface PasswordChecklistProps {
  password?: string;
  isDirty?: boolean;
}

export function PasswordChecklist({ password = "", isDirty = false }: PasswordChecklistProps) {
  const rules = [
    { label: "Minimum 8 characters", valid: password.length >= 8 },
    { label: "One uppercase letter", valid: /[A-Z]/.test(password) },
    { label: "One lowercase letter", valid: /[a-z]/.test(password) },
    { label: "One number", valid: /[0-9]/.test(password) },
    { label: "One special character", valid: /[^A-Za-z0-9]/.test(password) },
  ];

  return (
    <div className="mt-3 space-y-2">
      {rules.map((rule, idx) => {
        const isError = isDirty && !rule.valid && password.length > 0;
        
        return (
          <div
            key={idx}
            className={`flex items-center gap-2 text-xs transition-colors duration-300 ${
              rule.valid
                ? "text-green-600"
                : isError
                ? "text-red-500"
                : "text-slate-500"
            }`}
          >
            <div className="relative w-4 h-4 flex items-center justify-center">
              {/* Green Check */}
              <CheckCircle2
                className={`absolute inset-0 w-4 h-4 text-green-600 transition-all duration-300 ${
                  rule.valid ? "opacity-100 scale-100" : "opacity-0 scale-50"
                }`}
              />
              {/* Red X */}
              <XCircle
                className={`absolute inset-0 w-4 h-4 text-red-500 transition-all duration-300 ${
                  !rule.valid && isError ? "opacity-100 scale-100" : "opacity-0 scale-50"
                }`}
              />
              {/* Gray Circle */}
              <Circle
                className={`absolute inset-0 w-4 h-4 text-slate-300 transition-all duration-300 ${
                  !rule.valid && !isError ? "opacity-100 scale-100" : "opacity-0 scale-50"
                }`}
              />
            </div>
            <span>{rule.label}</span>
          </div>
        );
      })}
    </div>
  );
}
