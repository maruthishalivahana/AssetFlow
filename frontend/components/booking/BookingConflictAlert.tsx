import React from "react";
import { TriangleAlert } from "lucide-react";

interface BookingConflictAlertProps {
  message?: string;
  suggestedAlternatives?: string[];
}

export function BookingConflictAlert({ 
  message = "This time slot overlaps with an existing booking.",
  suggestedAlternatives = ["11:00 AM", "1:00 PM", "3:00 PM"]
}: BookingConflictAlertProps) {
  return (
    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
      <div className="mt-0.5 shrink-0">
        <TriangleAlert className="h-5 w-5 text-red-500" />
      </div>
      <div>
        <h4 className="text-sm font-semibold text-red-200">Booking Conflict Detected</h4>
        <p className="text-sm text-red-300/80 mt-1">{message}</p>
        
        {suggestedAlternatives.length > 0 && (
          <div className="mt-3">
            <p className="text-xs text-red-300/60 font-medium uppercase tracking-wider mb-2">Suggested Alternatives</p>
            <div className="flex flex-wrap gap-2">
              {suggestedAlternatives.map(alt => (
                <span key={alt} className="text-xs bg-red-500/20 text-red-200 px-2 py-1 rounded-md border border-red-500/20 cursor-pointer hover:bg-red-500/30 transition-colors">
                  {alt}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
