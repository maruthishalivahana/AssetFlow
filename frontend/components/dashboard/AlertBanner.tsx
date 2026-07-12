import React from "react";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

interface AlertBannerProps {
  message: string;
  actionText?: string;
  actionHref?: string;
}

export function AlertBanner({ message, actionText, actionHref }: AlertBannerProps) {
  return (
    <div className="bg-destructive/15 border border-destructive/20 rounded-xl p-4 flex items-center justify-between mt-8 mb-8">
      <div className="flex items-center gap-3">
        <AlertTriangle className="w-5 h-5 text-destructive" />
        <p className="text-sm font-medium text-destructive-foreground">{message}</p>
      </div>
      {actionText && actionHref && (
        <Link 
          href={actionHref}
          className="text-sm font-semibold text-destructive hover:underline outline-none focus-visible:ring-2 focus-visible:ring-destructive rounded"
        >
          {actionText}
        </Link>
      )}
    </div>
  );
}
