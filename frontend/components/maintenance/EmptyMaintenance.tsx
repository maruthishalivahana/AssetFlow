import React from "react";
import { Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyMaintenanceProps {
  onRaiseClick: () => void;
}

export function EmptyMaintenance({ onRaiseClick }: EmptyMaintenanceProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="bg-[#262626]/30 p-6 rounded-full mb-6 border border-[#262626]">
        <Wrench className="w-16 h-16 text-slate-500" strokeWidth={1.5} />
      </div>
      <h3 className="text-2xl font-semibold text-slate-200 mb-2 font-heading">
        No Maintenance Requests Found
      </h3>
      <p className="text-slate-400 max-w-md mb-8">
        Raise your first maintenance request to begin tracking asset repairs and technician assignments.
      </p>
      <Button
        onClick={onRaiseClick}
        className="bg-slate-50 text-slate-900 hover:bg-slate-200 min-w-[160px] shadow-sm"
      >
        Raise Request
      </Button>
    </div>
  );
}
