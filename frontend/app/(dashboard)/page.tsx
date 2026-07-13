import React from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { OverviewCard } from "@/components/dashboard/OverviewCard";
import { AlertBanner } from "@/components/dashboard/AlertBanner";
import { QuickActionCard } from "@/components/dashboard/QuickActionCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { UpcomingTasks } from "@/components/dashboard/UpcomingTasks";
import {
  Package,
  Link2,
  Wrench,
  Calendar,
  ArrowRight,
  RotateCcw,
  Plus,
  CalendarPlus,
  FilePlus,
  ArrowLeftRight
} from "lucide-react";

const overviewData = [
  {
    title: "Available Assets",
    value: "128",
    icon: Package,
    iconBgColor: "bg-emerald-500/10",
    iconColor: "text-emerald-500"
  },
  {
    title: "Allocated",
    value: "76",
    icon: Link2,
    iconBgColor: "bg-blue-500/10",
    iconColor: "text-blue-500"
  },
  {
    title: "Maintenance",
    value: "4",
    icon: Wrench,
    iconBgColor: "bg-amber-500/10",
    iconColor: "text-amber-500"
  },
  {
    title: "Active Bookings",
    value: "9",
    icon: Calendar,
    iconBgColor: "bg-blue-500/10",
    iconColor: "text-blue-500"
  },
  {
    title: "Pending Transfers",
    value: "3",
    icon: ArrowRight,
    iconBgColor: "bg-amber-500/10",
    iconColor: "text-amber-500"
  },
  {
    title: "Upcoming Returns",
    value: "12",
    icon: RotateCcw,
    iconBgColor: "bg-emerald-500/10",
    iconColor: "text-emerald-500"
  }
];

const quickActionsData = [
  { title: "Register Asset", icon: Plus, href: "/dashboard/assets" },
  { title: "Book Resource", icon: CalendarPlus, href: "/dashboard/bookings" },
  { title: "Raise Requests", icon: FilePlus, href: "/dashboard/maintenance" },
];

const recentActivityData = [
  {
    id: "1",
    title: "Laptop AF-0114",
    description: "allocated to Priya Shah - IT dept",
    timestamp: "7:30 pm",
    status: "Allocated",
    statusColor: "text-emerald-500 border-emerald-500/20",
    avatarSrc: "https://i.pravatar.cc/150?u=priya",
    avatarInitials: "PS",
  },
  {
    id: "2",
    title: "Room B2",
    description: "booking confirmed - 2:00 to 3:00 PM",
    timestamp: "1:00 pm",
    status: "Confirmed",
    statusColor: "text-blue-500 border-blue-500/20",
    icon: <Calendar className="w-4 h-4" />
  },
  {
    id: "3",
    title: "Projector AF-0062",
    description: "maintenance resolved",
    timestamp: "1:05 am",
    status: "Resolved",
    statusColor: "text-emerald-500 border-emerald-500/20",
    icon: <Wrench className="w-4 h-4" />
  }
];

const upcomingTasksData = [
  {
    id: "1",
    title: "Complete Audit Report Q2",
    dueDate: "2/21/2024",
    status: "Unaawn",
    statusColor: "bg-muted/50 text-muted-foreground border-transparent",
  },
  {
    id: "2",
    title: "Review Maintenance Schedule",
    dueDate: "1/22/2024",
    status: "Status",
    statusColor: "bg-amber-500/10 text-amber-500 border-transparent",
  },
  {
    id: "3",
    title: "Approve New Asset Requests",
    dueDate: "5/17/2023",
    status: "Status",
    statusColor: "bg-emerald-500/10 text-emerald-500 border-transparent",
  }
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      <DashboardHeader
        title="Good Morning, Maruthi"
        subtitle="Here's what's happening today."
      />

      {/* Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
        {overviewData.map((data, idx) => (
          <OverviewCard key={idx} {...data} />
        ))}
      </div>

      <AlertBanner
        message="3 assets overdue for return - flagged for follow-up."
        actionText="View Details"
        actionHref="/reports/overdue"
      />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {quickActionsData.map((data, idx) => (
          <QuickActionCard key={idx} {...data} />
        ))}
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
        <RecentActivity activities={recentActivityData} />
        <UpcomingTasks tasks={upcomingTasksData} />
      </div>
    </div>
  );
}
