import React from "react";
import { LucideIcon } from "lucide-react";

interface OverviewCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
}

export function OverviewCard({ title, value, icon: Icon, iconBgColor, iconColor }: OverviewCardProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 flex items-center gap-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring">
      <div className={`p-4 rounded-xl ${iconBgColor} ${iconColor} shrink-0`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-3xl font-bold tracking-tight text-foreground mt-1">{value}</p>
      </div>
    </div>
  );
}
