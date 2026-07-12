import React, { Suspense } from "react";
import { AssetsPage } from "@/components/assets/AssetsPage";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Assets | AssetFlow",
  description: "Manage and track your organization's asset directory.",
};

export default function AssetsRoutePage() {
  return (
    <Suspense 
      fallback={
        <div className="flex items-center justify-center h-full w-full">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      }
    >
      <AssetsPage />
    </Suspense>
  );
}
