import React from "react";
import { MaintenanceRequest } from "./mockData";
import { Clock3, BadgeCheck, UserCog, LoaderCircle, CircleCheckBig, Timer } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  iconClass: string;
  bgClass: string;
}

function StatCard({ icon: Icon, label, value, iconClass, bgClass }: StatCardProps) {
  return (
    <div className="bg-[#111111] border border-[#262626] rounded-2xl p-5 flex items-center gap-4 hover:border-[#363636] transition-colors">
      <div className={cn("p-3 rounded-xl shrink-0", bgClass)}>
        <Icon className={cn("h-5 w-5", iconClass)} />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-semibold text-slate-50 font-heading">{value}</p>
        <p className="text-sm text-slate-400 mt-0.5 truncate">{label}</p>
      </div>
    </div>
  );
}

interface MaintenanceStatsProps {
  requests: MaintenanceRequest[];
}

export function MaintenanceStats({ requests }: MaintenanceStatsProps) {
  const pending = requests.filter((r) => r.status === "Pending").length;
  const approvedToday = requests.filter(
    (r) => r.status === "Approved" && r.updatedAt.startsWith(new Date().toISOString().split("T")[0])
  ).length;
  const assigned = requests.filter((r) => r.status === "Assigned").length;
  const inProgress = requests.filter((r) => r.status === "In Progress").length;
  const resolvedToday = requests.filter(
    (r) => r.status === "Resolved" && r.updatedAt.startsWith(new Date().toISOString().split("T")[0])
  ).length;

  // Average resolution time for resolved items (rough estimate in days)
  const resolved = requests.filter((r) => r.status === "Resolved");
  const avgDays =
    resolved.length > 0
      ? Math.round(
          resolved.reduce((acc, r) => {
            const created = new Date(r.createdAt).getTime();
            const updated = new Date(r.updatedAt).getTime();
            return acc + (updated - created) / (1000 * 60 * 60 * 24);
          }, 0) / resolved.length
        )
      : 0;

  const stats: StatCardProps[] = [
    {
      icon: Clock3,
      label: "Pending Requests",
      value: pending,
      iconClass: "text-slate-400",
      bgClass: "bg-slate-500/10",
    },
    {
      icon: BadgeCheck,
      label: "Approved Today",
      value: approvedToday,
      iconClass: "text-blue-400",
      bgClass: "bg-blue-500/10",
    },
    {
      icon: UserCog,
      label: "Technicians Assigned",
      value: assigned,
      iconClass: "text-purple-400",
      bgClass: "bg-purple-500/10",
    },
    {
      icon: LoaderCircle,
      label: "In Progress",
      value: inProgress,
      iconClass: "text-amber-400",
      bgClass: "bg-amber-500/10",
    },
    {
      icon: CircleCheckBig,
      label: "Resolved Today",
      value: resolvedToday,
      iconClass: "text-emerald-400",
      bgClass: "bg-emerald-500/10",
    },
    {
      icon: Timer,
      label: "Avg. Resolution",
      value: `${avgDays}d`,
      iconClass: "text-slate-400",
      bgClass: "bg-slate-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      {stats.map((s) => (
        <StatCard key={s.label} {...s} />
      ))}
    </div>
  );
}
