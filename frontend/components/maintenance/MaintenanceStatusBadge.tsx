import React from "react";
import { MaintenanceStatus } from "./mockData";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: MaintenanceStatus;
  className?: string;
}

export function MaintenanceStatusBadge({ status, className }: StatusBadgeProps) {
  const styles: Record<MaintenanceStatus, string> = {
    Pending: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    Approved: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    Assigned: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    "In Progress": "bg-amber-500/10 text-amber-400 border-amber-500/20",
    Resolved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    Rejected: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        styles[status] ?? "bg-slate-500/10 text-slate-400 border-slate-500/20",
        className
      )}
    >
      {status}
    </span>
  );
}
