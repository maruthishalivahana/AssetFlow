import React, { Suspense } from "react";
import { MaintenancePage } from "@/components/maintenance/MaintenancePage";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Maintenance | AssetFlow",
  description: "Track maintenance requests, approvals, technicians and repair progress.",
};

export default function MaintenanceRoutePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-full w-full">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      }
    >
      <MaintenancePage />
    </Suspense>
  );
}
