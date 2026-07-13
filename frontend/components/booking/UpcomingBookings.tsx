import React from "react";
import type { BookingItem } from "@/src/types/booking";
import { BookingStatusBadge } from "./BookingStatusBadge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface UpcomingBookingsProps {
  bookings: BookingItem[];
}

export function UpcomingBookings({ bookings }: UpcomingBookingsProps) {
  // Filter out past bookings if needed, for now just sort by time
  const sortedBookings = [...bookings].sort((a, b) => a.startTime.localeCompare(b.startTime));

  if (sortedBookings.length === 0) {
    return (
      <div className="text-center py-8 bg-[#090909] rounded-xl border border-[#262626]">
        <p className="text-sm text-slate-500">No upcoming bookings today.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sortedBookings.map((booking) => {
        const bookedByName = booking.bookedBy || "Unknown User";
        const initials = bookedByName.split(" ").map(n => n[0]).join("").substring(0, 2);

        return (
          <div key={booking.id} className="bg-[#090909] border border-[#262626] rounded-xl p-3 flex gap-3 hover:bg-[#151515] transition-colors">
            <Avatar className="h-9 w-9 border border-[#262626] shrink-0 mt-0.5">
              <AvatarFallback className="bg-slate-800 text-slate-300 text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-2 mb-1">
                <p className="font-semibold text-sm text-slate-100 truncate">{booking.title}</p>
                <BookingStatusBadge status={booking.status} className="shrink-0 text-[10px] px-1.5 py-0" />
              </div>
              <p className="text-xs text-slate-400 mb-1 truncate">
                {booking.bookedBy} • {booking.department}
              </p>
              <div className="text-xs font-medium text-slate-300">
                {booking.startTime} - {booking.endTime}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
