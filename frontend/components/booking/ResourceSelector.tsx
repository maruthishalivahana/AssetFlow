import React from "react";
import type { BookingResource } from "@/src/types/booking";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { CalendarDays, Building2, Monitor, Car } from "lucide-react";

interface ResourceSelectorProps {
  resources: BookingResource[];
  selectedResourceId: string;
  onResourceChange: (id: string) => void;
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export function ResourceSelector({
  resources,
  selectedResourceId,
  onResourceChange,
  selectedDate,
  onDateChange,
}: ResourceSelectorProps) {
  const getResourceIcon = (type: string) => {
    switch (type) {
      case "Meeting Room": return <Building2 className="w-4 h-4 text-slate-400 mr-2 shrink-0" />;
      case "Projector": return <Monitor className="w-4 h-4 text-slate-400 mr-2 shrink-0" />;
      case "Vehicle": return <Car className="w-4 h-4 text-slate-400 mr-2 shrink-0" />;
      default: return <CalendarDays className="w-4 h-4 text-slate-400 mr-2 shrink-0" />;
    }
  };

  return (
    <div className="bg-[#111111] border border-[#262626] rounded-2xl p-4 mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
      <div className="w-full sm:flex-1 sm:max-w-md">
        <label className="text-xs text-slate-400 mb-1.5 block uppercase tracking-wider font-semibold">Resource</label>
        <Select value={selectedResourceId} onValueChange={(v) => onResourceChange(v as string)}>
          <SelectTrigger className="w-full bg-[#090909] border-[#262626] text-slate-200">
            <SelectValue placeholder="Select a resource..." />
          </SelectTrigger>
          <SelectContent>
            {resources.map((res) => (
              <SelectItem key={res.id} value={res.id}>
                <div className="flex items-center">
                  {getResourceIcon(res.type)}
                  <span>{res.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-full sm:w-auto">
        <label className="text-xs text-slate-400 mb-1.5 block uppercase tracking-wider font-semibold">Date</label>
        <div className="relative">
          <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="pl-9 bg-[#090909] border-[#262626] text-slate-200 w-full sm:w-[180px] custom-date-input"
          />
        </div>
      </div>
    </div>
  );
}
