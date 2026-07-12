import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AssetCategory } from "./mockData";
import { StatusBadge } from "./StatusBadge";
import { Package, Calendar, Settings2, ShieldCheck } from "lucide-react";

interface CategoryDetailsDialogProps {
  category: AssetCategory | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CategoryDetailsDialog({
  category,
  open,
  onOpenChange,
}: CategoryDetailsDialogProps) {
  if (!category) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border text-foreground rounded-2xl shadow-lg">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-heading text-slate-100 flex items-center gap-2">
            <Package className="h-5 w-5 text-slate-400" />
            {category.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-slate-400 mb-1">Description</h4>
            <p className="text-sm text-slate-200">{category.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-y-6 gap-x-4">
            <div>
              <h4 className="text-sm font-medium text-slate-400 mb-2">Status</h4>
              <StatusBadge status={category.status} />
            </div>

            <div>
              <h4 className="text-sm font-medium text-slate-400 mb-1">Assets Assigned</h4>
              <p className="text-sm font-semibold text-slate-200">{category.assetsCount}</p>
            </div>
          </div>

          <div className="space-y-3 p-4 bg-slate-900/50 rounded-xl border border-border">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Default Fields</h4>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-slate-500" />
                <span className="text-sm text-slate-300">Warranty Period</span>
              </div>
              <span className="text-sm font-medium text-slate-200">{category.warrantyPeriod}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings2 className="h-4 w-4 text-slate-500" />
                <span className="text-sm text-slate-300">Maintenance Interval</span>
              </div>
              <span className="text-sm font-medium text-slate-200">{category.maintenanceInterval}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 pt-2 border-t border-border">
            <Calendar className="h-3 w-3" />
            <span>Created on {new Date(category.createdDate).toLocaleDateString()}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
