import { cn } from "@/lib/utils";

export type StatusType = "Active" | "Inactive" | "Pending";

interface StatusBadgeProps {
  status: StatusType | string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const isStatus = (s: string) => status.toLowerCase() === s.toLowerCase();

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        isStatus("active")
          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
          : isStatus("pending")
          ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
          : "bg-slate-500/10 text-slate-400 border-slate-500/20",
        className
      )}
    >
      {status}
    </span>
  );
}
