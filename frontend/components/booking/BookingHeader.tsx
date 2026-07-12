import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookingHeaderProps {
  onBookClick: () => void;
}

export function BookingHeader({ onBookClick }: BookingHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-heading font-semibold text-slate-50 tracking-tight">
          Resource Booking
        </h1>
        <p className="text-slate-400 mt-1">
          Reserve meeting rooms, shared equipment and organizational resources.
        </p>
      </div>
      
      <Button 
        onClick={onBookClick}
        className="bg-slate-50 text-slate-900 hover:bg-slate-200 min-w-[140px] shadow-sm transition-all"
      >
        <Plus className="mr-2 h-4 w-4" />
        Book Resource
      </Button>
    </div>
  );
}
