import React from "react";
import { BookingStatus } from "./mockData";
import { cn } from "@/lib/utils";

interface BookingStatusBadgeProps {
  status: BookingStatus;
  className?: string;
}

export function BookingStatusBadge({ status, className }: BookingStatusBadgeProps) {
  const getStyles = () => {
    switch (status) {
      case "Booked":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "In Progress":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "Completed":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "Conflict":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "Cancelled":
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
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
      {status}
    </span>
  );
}
