import React from "react";
import { AssetCondition } from "./mockData";
import { cn } from "@/lib/utils";

interface AssetConditionBadgeProps {
  condition: AssetCondition;
  className?: string;
}

export function AssetConditionBadge({ condition, className }: AssetConditionBadgeProps) {
  const getStyles = () => {
    switch (condition) {
      case "Excellent":
        return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      case "Good":
        return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      case "Fair":
        return "text-orange-500 bg-orange-500/10 border-orange-500/20";
      case "Poor":
        return "text-red-500 bg-red-500/10 border-red-500/20";
      case "New":
        return "text-teal-500 bg-teal-500/10 border-teal-500/20";
      default:
        return "text-slate-400 bg-slate-500/10 border-slate-500/20";
    }
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap",
        getStyles(),
        className
      )}
    >
      {condition}
    </span>
  );
}
