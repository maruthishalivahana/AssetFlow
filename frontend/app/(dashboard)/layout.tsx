import React from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

export default function AppDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dark bg-background text-foreground h-full w-full">
      <DashboardLayout>{children}</DashboardLayout>
    </div>
  );
}
