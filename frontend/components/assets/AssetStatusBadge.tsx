import React from "react";
import { AssetStatus } from "./mockData";
import { cn } from "@/lib/utils";

interface AssetStatusBadgeProps {
  status: AssetStatus;
  className?: string;
}

export function AssetStatusBadge({ status, className }: AssetStatusBadgeProps) {
  const getStyles = () => {
    switch (status) {
      case "Available":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "Allocated":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "Maintenance":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "Reserved":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "Lost":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "Disposed":
      case "Retired":
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  const getDotColor = () => {
    switch (status) {
      case "Allocated": return "bg-emerald-500";
      case "Available": return "bg-blue-500";
      case "Maintenance": return "bg-amber-500";
      case "Reserved": return "bg-purple-500";
      case "Lost": return "bg-red-500";
      case "Disposed":
      case "Retired": return "bg-slate-500";
      default: return "bg-slate-500";
    }
  };

  // Note: The screenshot only shows dots on some (like Allocated, Maintenance). 
  // Let's conditionally render dots for all for consistency, or just match screenshot exactly if possible.
  // The design references "Allocated" with a green dot, "Available", "Maintenance".
  // Actually, let's just make it a pill with the color and a dot.

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium w-fit whitespace-nowrap",
        getStyles(),
        className
      )}
    >
      {/* Some statuses might not need a dot, but let's include it if it's active-like */}
      {["Allocated", "Available"].includes(status) ? (
        <>
          {status}
          <span className={cn("h-1.5 w-1.5 rounded-full", getDotColor())} />
        </>
      ) : (
        status
      )}
    </span>
  );
}
