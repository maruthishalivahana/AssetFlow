import React from "react";

interface PasswordStrengthProps {
  password?: string;
}

export function PasswordStrength({ password = "" }: PasswordStrengthProps) {
  // Calculate strength based on rules
  let strength = 0;
  if (password.length >= 8) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[a-z]/.test(password)) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  if (/[^A-Za-z0-9]/.test(password)) strength += 1;

  if (password.length === 0) strength = 0;

  const strengthLabels = ["Very Weak", "Weak", "Medium", "Strong", "Very Strong"];
  const label = password.length > 0 ? strengthLabels[strength - 1] || "Very Weak" : "";

  // Map strength (0-5) to colors
  const getProgressColor = () => {
    switch (strength) {
      case 1:
        return "bg-red-500";
      case 2:
        return "bg-orange-500";
      case 3:
        return "bg-yellow-500";
      case 4:
        return "bg-lime-500";
      case 5:
        return "bg-green-600";
      default:
        return "bg-slate-200";
    }
  };

  const percentage = password.length === 0 ? 0 : Math.max(20, (strength / 5) * 100);

  return (
    <div className="w-full mt-2 space-y-1.5 transition-all">
      <div className="flex justify-between items-center text-xs font-medium">
        <span className="text-slate-500">Password strength</span>
        <span
          className={`transition-colors duration-300 ${
            strength === 0
              ? "text-transparent"
              : strength <= 2
              ? "text-red-500"
              : strength === 3
              ? "text-yellow-600"
              : "text-green-600"
          }`}
        >
          {label}
        </span>
      </div>
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ease-out rounded-full ${getProgressColor()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
