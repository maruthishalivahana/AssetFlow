import React from "react";
import { PackageX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyAssetsProps {
  onRegisterClick: () => void;
}

export function EmptyAssets({ onRegisterClick }: EmptyAssetsProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="bg-[#262626]/30 p-6 rounded-full mb-6">
        <PackageX className="w-16 h-16 text-slate-500" strokeWidth={1.5} />
      </div>
      <h3 className="text-2xl font-semibold text-slate-200 mb-2 font-heading">
        No Assets Found
      </h3>
      <p className="text-slate-400 max-w-md mb-8">
        Register your first asset to begin tracking inventory across your organization.
      </p>
      <Button 
        onClick={onRegisterClick}
        className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[160px] shadow-sm transition-all hover:shadow-emerald-900/20"
      >
        Register Asset
      </Button>
    </div>
  );
}
