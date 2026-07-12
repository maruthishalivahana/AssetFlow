import React from "react";
import { MaintenanceTimelineEvent } from "./mockData";
import { cn } from "@/lib/utils";
import {
  CircleCheck,
  UserCog,
  Wrench,
  Package,
  BadgeCheck,
  CircleCheckBig,
  RotateCcw,
  MessageSquare,
} from "lucide-react";

interface MaintenanceTimelineProps {
  events: MaintenanceTimelineEvent[];
}

const eventIcon: Record<string, React.ElementType> = {
  "Request Raised": MessageSquare,
  Approved: BadgeCheck,
  "Technician Assigned": UserCog,
  "Repair Started": Wrench,
  "Parts Ordered": Package,
  "Repair Completed": CircleCheck,
  "Asset Returned": RotateCcw,
};

const eventColor: Record<string, string> = {
  "Request Raised": "bg-slate-700 text-slate-300 border-slate-600",
  Approved: "bg-blue-900/40 text-blue-400 border-blue-700/30",
  "Technician Assigned": "bg-purple-900/40 text-purple-400 border-purple-700/30",
  "Repair Started": "bg-amber-900/40 text-amber-400 border-amber-700/30",
  "Parts Ordered": "bg-orange-900/40 text-orange-400 border-orange-700/30",
  "Repair Completed": "bg-emerald-900/40 text-emerald-400 border-emerald-700/30",
  "Asset Returned": "bg-emerald-900/50 text-emerald-300 border-emerald-600/30",
};

export function MaintenanceTimeline({ events }: MaintenanceTimelineProps) {
  return (
    <div className="space-y-0">
      {events.map((event, idx) => {
        const Icon = eventIcon[event.event] ?? CircleCheckBig;
        const colorClass = eventColor[event.event] ?? "bg-slate-700 text-slate-300 border-slate-600";
        const isLast = idx === events.length - 1;

        const dateStr = new Date(event.timestamp).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
        const timeStr = new Date(event.timestamp).toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        });

        return (
          <div key={event.id} className="flex gap-3">
            {/* Icon + connector line */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center border shrink-0",
                  colorClass
                )}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
              {!isLast && <div className="w-px flex-1 bg-[#262626] my-1" />}
            </div>

            {/* Content */}
            <div className={cn("pb-4 flex-1 min-w-0", isLast && "pb-0")}>
              <p className="text-sm font-semibold text-slate-200">{event.event}</p>
              <p className="text-xs text-slate-500 mt-0.5">
                {event.actor} · {dateStr} at {timeStr}
              </p>
              {event.note && (
                <p className="text-xs text-slate-400 mt-1.5 bg-[#090909] border border-[#262626] rounded-lg px-3 py-2">
                  {event.note}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
