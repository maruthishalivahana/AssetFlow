import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Department } from "./mockData";
import { StatusBadge } from "./StatusBadge";
import { Building, Users, Package, Calendar } from "lucide-react";

interface DepartmentDetailsDialogProps {
  department: Department | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DepartmentDetailsDialog({
  department,
  open,
  onOpenChange,
}: DepartmentDetailsDialogProps) {
  if (!department) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border text-foreground rounded-2xl shadow-lg">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-heading text-slate-100 flex items-center gap-2">
            <Building className="h-5 w-5 text-slate-400" />
            {department.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {department.description && (
            <div>
              <h4 className="text-sm font-medium text-slate-400 mb-1">Description</h4>
              <p className="text-sm text-slate-200">{department.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-y-6 gap-x-4">
            <div>
              <h4 className="text-sm font-medium text-slate-400 mb-2">Department Head</h4>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 border border-border">
                  <AvatarImage src={department.headAvatar} />
                  <AvatarFallback className="bg-slate-800 text-slate-300 text-xs">
                    {department.headName.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-slate-200">
                  {department.headName}
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-slate-400 mb-2">Status</h4>
              <StatusBadge status={department.status} />
            </div>

            <div>
              <h4 className="text-sm font-medium text-slate-400 mb-1">Code</h4>
              <p className="text-sm text-slate-200 font-mono">{department.code}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-slate-400 mb-1">Parent Dept</h4>
              <p className="text-sm text-slate-200">
                {department.parentDept || "-"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 p-4 bg-slate-900/50 rounded-xl border border-border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Users className="h-4 w-4 text-emerald-500" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Employees</p>
                <p className="font-semibold text-slate-200">{department.employeesCount}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Package className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Assets</p>
                <p className="font-semibold text-slate-200">{department.assetsCount}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 pt-2 border-t border-border">
            <Calendar className="h-3 w-3" />
            <span>Created on {new Date(department.createdDate).toLocaleDateString()}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
