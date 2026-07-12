import React from "react";
import { Plus, History } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MaintenanceHeaderProps {
  onRaiseClick: () => void;
}

export function MaintenanceHeader({ onRaiseClick }: MaintenanceHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-heading font-semibold text-slate-50 tracking-tight">
          Maintenance Management
        </h1>
        <p className="text-slate-400 mt-1">
          Track maintenance requests, approvals, technicians and repair progress.
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <Button
          variant="outline"
          className="bg-transparent border-[#262626] text-slate-300 hover:bg-[#262626] hover:text-white"
        >
          <History className="mr-2 h-4 w-4" />
          View History
        </Button>
        <Button
          onClick={onRaiseClick}
          className="bg-slate-50 text-slate-900 hover:bg-slate-200 shadow-sm transition-all"
        >
          <Plus className="mr-2 h-4 w-4" />
          Raise Request
        </Button>
      </div>
    </div>
  );
}
