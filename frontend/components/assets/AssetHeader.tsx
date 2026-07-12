import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AssetHeaderProps {
  onRegisterClick: () => void;
}

export function AssetHeader({ onRegisterClick }: AssetHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-heading font-semibold text-slate-50 tracking-tight">
          Assets
        </h1>
        <p className="text-slate-400 mt-1">
          Manage and track your organization's asset directory.
        </p>
      </div>
      
      <Button 
        onClick={onRegisterClick}
        className="bg-slate-50 text-slate-900 hover:bg-slate-200 min-w-[140px] shadow-sm transition-all"
      >
        <Plus className="mr-2 h-4 w-4" />
        Register Asset
      </Button>
    </div>
  );
}
