import React from "react";
import type { BookingItem } from "@/src/types/booking";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BookingCardProps {
  booking: BookingItem;
  top: number;
  height: number;
}

export function BookingCard({ booking, top, height }: BookingCardProps) {
  const isConflict = (booking.status as string) === "Conflict";

  const baseClasses =
    "absolute left-12 right-2 rounded-lg text-sm overflow-hidden shadow-sm transition-all cursor-pointer";

  const statusClasses = isConflict
    ? "bg-red-500/10 border-2 border-dashed border-red-500/50 text-red-100 z-20"
    : "bg-[#1d2b38] border border-blue-500/30 text-blue-50 z-10 hover:bg-[#25374a]";

  return (
    <TooltipProvider>
      <Tooltip>
        {/* TooltipTrigger renders its own element; style it to fill the card position */}
        <TooltipTrigger
          className={cn(
            baseClasses,
            statusClasses,
            "text-left w-auto hover:-translate-y-[1px] hover:shadow-md p-3 flex flex-col justify-between"
          )}
          style={{
            top: `${top}px`,
            height: `${height}px`,
          }}
        >
          <div className="flex justify-between items-start">
            <div className="min-w-0 flex-1">
              <p className="font-semibold truncate">{booking.title}</p>
              {height >= 60 && (
                <p className="text-xs opacity-80 mt-1 truncate">
                  {booking.bookedBy} • {booking.department}
                </p>
              )}
            </div>
            <div className="text-xs font-medium bg-black/20 px-2 py-0.5 rounded-full shrink-0 ml-2">
              {booking.startTime}–{booking.endTime}
            </div>
          </div>

          {height >= 80 && isConflict && (
            <p className="text-xs text-red-400 mt-2 font-medium">
              Conflict: Overlaps with an existing booking
            </p>
          )}
        </TooltipTrigger>

        <TooltipContent className="bg-[#111111] border-[#262626] text-white p-3 shadow-xl rounded-xl">
          <div className="space-y-1.5">
            <p className="font-semibold">{booking.title}</p>
            <p className="text-xs text-slate-400">
              {booking.startTime} – {booking.endTime}
            </p>
            <div className="pt-2 border-t border-[#262626] mt-2 space-y-1">
              <p className="text-xs">
                <span className="text-slate-400">Booked by: </span>
                {booking.bookedBy}
              </p>
              <p className="text-xs">
                <span className="text-slate-400">Dept: </span>
                {booking.department}
              </p>
            </div>
            {isConflict && (
              <p className="text-xs text-red-400 font-medium mt-1">
                ⚠ Conflict detected
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
