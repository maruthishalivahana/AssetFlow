import React from "react";
import { cn } from "@/lib/utils";

interface BookingStatusBadgeProps {
  status: string;
  className?: string;
}

const getLabel = (status: string) => {
  switch (status) {
    case 'UPCOMING':
      return 'Upcoming';
    case 'ONGOING':
      return 'In Progress';
    case 'COMPLETED':
      return 'Completed';
    case 'CANCELLED':
      return 'Cancelled';
    case 'Booked':
      return 'Booked';
    case 'In Progress':
      return 'In Progress';
    case 'Conflict':
      return 'Conflict';
    default:
      return status;
  }
};

export function BookingStatusBadge({ status, className }: BookingStatusBadgeProps) {
  const getStyles = () => {
    switch (status) {
      case 'UPCOMING':
      case 'Booked':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'ONGOING':
      case 'In Progress':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'COMPLETED':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'CANCELLED':
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      case 'Conflict':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap',
        getStyles(),
        className,
      )}
    >
      {getLabel(status)}
    </span>
  );
}
