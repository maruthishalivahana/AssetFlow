import React from "react";
import { AssetCondition } from "./mockData";
import { cn } from "@/lib/utils";
import { getAssetConditionLabel, normalizeAssetCondition } from "./assetDisplay";

interface AssetConditionBadgeProps {
  condition: AssetCondition;
  className?: string;
}

export function AssetConditionBadge({ condition, className }: AssetConditionBadgeProps) {
  const normalizedCondition = normalizeAssetCondition(condition);

  const getStyles = () => {
    switch (normalizedCondition) {
      case "GOOD":
        return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      case "FAIR":
        return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      case "DAMAGED":
        return "text-orange-500 bg-orange-500/10 border-orange-500/20";
      case "NEW":
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
      {getAssetConditionLabel(condition)}
    </span>
  );
}
