import React from "react";
import type { BookingResource, BookingItem } from "@/src/types/booking";
import { UpcomingBookings } from "./UpcomingBookings";
import { Users, MapPin, Activity } from "lucide-react";

interface ResourceDetailsCardProps {
  resource: BookingResource | undefined;
  todayBookings: BookingItem[];
}

export function ResourceDetailsCard({ resource, todayBookings }: ResourceDetailsCardProps) {
  if (!resource) return null;

  return (
    <div className="bg-[#111111] border border-[#262626] rounded-2xl p-6 h-full flex flex-col">
      <div className="mb-6">
        {/* Placeholder for Resource Image */}
        <div className="w-full h-32 bg-[#090909] rounded-xl border border-[#262626] mb-4 flex items-center justify-center overflow-hidden">
          {resource.imageUrl ? (
            <img src={resource.imageUrl} alt={resource.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-slate-600 font-medium">{resource.type} Image</span>
          )}
        </div>

        <h2 className="text-xl font-heading font-semibold text-slate-50 mb-1">
          {resource.name}
        </h2>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-slate-400 bg-[#262626]/50 px-2.5 py-0.5 rounded-full border border-[#262626]">
            {resource.type}
          </span>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${resource.status === 'Available' ? 'bg-emerald-500/10 text-emerald-500' :
              resource.status === 'In Use' ? 'bg-blue-500/10 text-blue-500' :
                'bg-amber-500/10 text-amber-500'
            }`}>
            {resource.status}
          </span>
        </div>

        <div className="space-y-3 pt-4 border-t border-[#262626]">
          {resource.capacity && (
            <div className="flex items-center gap-3 text-sm">
              <Users className="w-4 h-4 text-slate-500 shrink-0" />
              <span className="text-slate-400 w-16">Capacity</span>
              <span className="text-slate-100 font-medium">{resource.capacity} people</span>
            </div>
          )}
          <div className="flex items-center gap-3 text-sm">
            <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
            <span className="text-slate-400 w-16">Location</span>
            <span className="text-slate-100 font-medium">{resource.location}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center">
            <Activity className="w-4 h-4 mr-2 text-slate-400" />
            Today's Bookings
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            {todayBookings.length} total
          </span>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
          <UpcomingBookings bookings={todayBookings} />
        </div>
      </div>
    </div>
  );
}
