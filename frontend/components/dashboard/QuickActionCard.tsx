import React from "react";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface QuickActionCardProps {
  title: string;
  icon: LucideIcon;
  href: string;
}

export function QuickActionCard({ title, icon: Icon, href }: QuickActionCardProps) {
  return (
    <Link
      href={href}
      className="bg-card border border-border rounded-xl p-4 flex items-center gap-3 transition-colors duration-200 hover:bg-muted/50 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Icon className="w-5 h-5 text-muted-foreground" />
      <span className="text-sm font-medium text-foreground">{title}</span>
    </Link>
  );
}
