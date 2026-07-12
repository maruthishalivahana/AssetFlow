import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AuthUser } from "@/src/types/auth";
import { StatusBadge } from "./StatusBadge";
import { Users, Calendar, Mail, Phone, Building } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface EmployeeDialogProps {
  employee: AuthUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EmployeeDialog({
  employee,
  open,
  onOpenChange,
}: EmployeeDialogProps) {
  if (!employee) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border text-foreground rounded-2xl shadow-lg">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-heading text-slate-100 flex items-center gap-2">
            <Users className="h-5 w-5 text-slate-400" />
            Employee Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-border">
              <AvatarFallback className="bg-slate-800 text-slate-300 text-lg font-medium">
                {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold text-slate-100">{employee.firstName} {employee.lastName}</h3>
              <p className="text-sm text-slate-400 font-mono">{employee.employeeCode}</p>
              <div className="mt-1 flex items-center gap-2">
                <StatusBadge status={employee.status as any} />
                <Badge variant="outline" className="text-xs bg-slate-900 border-border text-slate-300">
                  {employee.role}
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-y-6 gap-x-4">
            <div>
              <h4 className="text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
                <Mail className="h-4 w-4" /> Email
              </h4>
              <p className="text-sm text-slate-200">{employee.email}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
                <Phone className="h-4 w-4" /> Phone
              </h4>
              <p className="text-sm text-slate-200">{employee.phone || 'N/A'}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
                <Building className="h-4 w-4" /> Department
              </h4>
              <p className="text-sm text-slate-200">{employee.department?.name || 'None'}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Joining Date
              </h4>
              <p className="text-sm text-slate-200">
                {employee.createdAt ? new Date(employee.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Users className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Assets Assigned</p>
                <p className="font-semibold text-slate-200">{(employee as any).assetsAssigned || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
