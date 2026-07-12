import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: React.ElementType;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[400px] border border-dashed rounded-xl bg-slate-50/50 dark:bg-card/50 dark:border-border/50">
      <div className="h-16 w-16 bg-slate-100 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
        <Icon className="h-8 w-8 text-slate-400 dark:text-slate-500" />
      </div>
      <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-1">
        {title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="bg-emerald-600 hover:bg-emerald-700 text-white">
          <Plus className="mr-2 h-4 w-4" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
