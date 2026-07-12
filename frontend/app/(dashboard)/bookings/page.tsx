import React, { Suspense } from "react";
import { ResourceBookingPage } from "@/components/booking/ResourceBookingPage";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Resource Booking | AssetFlow",
  description: "Reserve meeting rooms, shared equipment and organizational resources.",
};

export default function BookingsRoutePage() {
  return (
    <Suspense 
      fallback={
        <div className="flex items-center justify-center h-full w-full">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      }
    >
      <ResourceBookingPage />
    </Suspense>
  );
}
