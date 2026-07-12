import React from "react";

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
}

export function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  return (
    <div className="space-y-1 mb-8">
      <h1 className="text-3xl md:text-4xl lg:text-[40px] font-bold tracking-tight text-foreground">
        {title}
      </h1>
      <p className="text-muted-foreground text-sm md:text-base">
        {subtitle}
      </p>
    </div>
  );
}
