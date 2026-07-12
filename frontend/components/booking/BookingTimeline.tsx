import React from "react";
import type { BookingItem } from "@/types/booking";
import { BookingCard } from "./BookingCard";

interface BookingTimelineProps {
  bookings: BookingItem[];
}

const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
const ROW_HEIGHT = 80; // px per hour

// Helper to convert "HH:mm" to minutes since 08:00
function getMinutesFrom8AM(timeStr: string) {
  const [h, m] = timeStr.split(":").map(Number);
  return (h - 8) * 60 + m;
}

export function BookingTimeline({ bookings }: BookingTimelineProps) {

  // Format hour label
  const formatHour = (hour: number) => {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const h = hour > 12 ? hour - 12 : hour;
    return `${h}:00 ${ampm}`;
  };

  return (
    <div className="bg-[#111111] border border-[#262626] rounded-2xl overflow-hidden flex flex-col h-[700px]">
      <div className="px-6 py-4 border-b border-[#262626] bg-[#090909]/50 shrink-0">
        <h2 className="text-lg font-heading font-medium text-slate-100">Schedule</h2>
      </div>

      <div className="flex-1 overflow-y-auto relative custom-scrollbar">
        {/* Background Grid */}
        <div className="absolute inset-0 pointer-events-none" style={{ height: `${HOURS.length * ROW_HEIGHT}px` }}>
          {HOURS.map((hour, idx) => (
            <div
              key={hour}
              className="flex border-b border-[#262626]/50"
              style={{ height: `${ROW_HEIGHT}px` }}
            >
              <div className="w-16 shrink-0 border-r border-[#262626]/50 pr-4 pt-2 text-right">
                <span className="text-xs font-medium text-slate-500">
                  {formatHour(hour)}
                </span>
              </div>
              <div className="flex-1" />
            </div>
          ))}
        </div>

        {/* Interactive Layer (Click to book could go here) */}
        <div className="absolute left-16 right-0 top-0 bottom-0" style={{ height: `${HOURS.length * ROW_HEIGHT}px` }}>
          {/* We could add hoverable slots here for creating new bookings */}
        </div>

        {/* Bookings Overlay */}
        <div className="absolute left-16 right-0 top-0 pointer-events-auto" style={{ height: `${HOURS.length * ROW_HEIGHT}px` }}>
          {bookings.map((booking) => {
            const startMins = getMinutesFrom8AM(booking.startTime);
            const endMins = getMinutesFrom8AM(booking.endTime);

            // Only render if within our 8 AM - 6 PM timeline
            if (endMins <= 0 || startMins >= (HOURS.length - 1) * 60) return null;

            // Constrain to timeline bounds
            const boundedStart = Math.max(0, startMins);
            const boundedEnd = Math.min((HOURS.length - 1) * 60, endMins);

            const topPx = (boundedStart / 60) * ROW_HEIGHT;
            const heightPx = ((boundedEnd - boundedStart) / 60) * ROW_HEIGHT;

            return (
              <BookingCard
                key={booking.id}
                booking={booking}
                top={topPx}
                height={heightPx}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
