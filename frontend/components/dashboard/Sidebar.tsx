"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Boxes, ChevronLeft, ChevronRight, LayoutDashboard, Building2, Package, ArrowLeftRight, Calendar, Wrench, ClipboardCheck, BarChart3, Bell, Settings, LogOut } from "lucide-react";
import { SidebarItem } from "./SidebarItem";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  className?: string;
}

const mainNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Building2, label: "Organization Setup", href: "/organization" },
  { icon: Package, label: "Assets", href: "/assets" },
  { icon: ArrowLeftRight, label: "Allocation & Transfer", href: "/transfers" },
  { icon: Calendar, label: "Resource Booking", href: "/bookings" },
  { icon: Wrench, label: "Maintenance", href: "/maintenance" },
  { icon: ClipboardCheck, label: "Audit", href: "/audit" },
  { icon: BarChart3, label: "Reports", href: "/reports" },
  { icon: Bell, label: "Notifications", href: "/notifications" },
];

const bottomNavItems = [
  { icon: Settings, label: "Settings", href: "/settings" },
  { icon: LogOut, label: "Logout", href: "/login" },
];

export function Sidebar({ isCollapsed, onToggle, className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex flex-col bg-background border-r border-border h-screen sticky top-0 transition-all duration-300 ease-in-out shrink-0",
        isCollapsed ? "w-[80px]" : "w-[280px]",
        className
      )}
    >
      {/* Logo & Header */}
      <div className="h-[72px] flex items-center px-6 shrink-0">
        <Link href="/" className="flex items-center gap-3 outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md">
          <div className="bg-primary p-1.5 rounded-lg text-primary-foreground shadow-sm shrink-0">
            <Boxes className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <span className="font-semibold text-lg tracking-tight text-foreground truncate">
              AssetFlow
            </span>
          )}
        </Link>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-6 px-4 space-y-1 custom-scrollbar">
        {mainNavItems.map((item) => (
          <SidebarItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            href={item.href}
            isActive={pathname === item.href}
            isCollapsed={isCollapsed}
          />
        ))}
      </div>

      {/* Bottom Actions */}
      <div className="p-4 space-y-1 border-t border-border/50 shrink-0">
        {bottomNavItems.map((item) => (
          <SidebarItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            href={item.href}
            isActive={pathname === item.href}
            isCollapsed={isCollapsed}
          />
        ))}
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-8 bg-background border border-border text-muted-foreground w-6 h-6 rounded-full flex items-center justify-center hover:bg-muted hover:text-foreground transition-colors shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring z-10 hidden md:flex"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>
    </aside>
  );
}
