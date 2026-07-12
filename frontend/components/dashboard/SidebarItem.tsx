import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  isActive?: boolean;
  isCollapsed?: boolean;
}

export function SidebarItem({
  icon: Icon,
  label,
  href,
  isActive,
  isCollapsed,
}: SidebarItemProps) {
  const content = (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isActive
          ? "bg-sidebar-primary/20 text-sidebar-primary font-medium"
          : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
      )}
      aria-label={isCollapsed ? label : undefined}
    >
      <Icon className="w-5 h-5 shrink-0" />
      {!isCollapsed && <span className="truncate leading-none">{label}</span>}
    </Link>
  );

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger>{content}</TooltipTrigger>
        <TooltipContent side="right" className="bg-popover text-popover-foreground border-border font-medium">
          {label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
}
