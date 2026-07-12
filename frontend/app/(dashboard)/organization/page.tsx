import React, { Suspense } from "react";
import { OrganizationTabs } from "@/components/organization/OrganizationTabs";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Organization Setup | AssetFlow",
  description: "Manage departments, categories, and employees.",
};

export default function OrganizationSetupPage() {
  return (
    <Suspense 
      fallback={
        <div className="flex items-center justify-center h-full w-full">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      }
    >
      <OrganizationTabs />
    </Suspense>
  );
}
