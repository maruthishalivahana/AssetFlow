import React from "react";
import { MaintenancePriority } from "./mockData";
import { cn } from "@/lib/utils";

interface PriorityBadgeProps {
  priority: MaintenancePriority;
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const styles: Record<MaintenancePriority, string> = {
    Low: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    Medium: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    High: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    Critical: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  const dot: Record<MaintenancePriority, string> = {
    Low: "bg-slate-400",
    Medium: "bg-blue-400",
    High: "bg-orange-400",
    Critical: "bg-red-400",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        styles[priority],
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", dot[priority])} />
      {priority}
    </span>
  );
}
