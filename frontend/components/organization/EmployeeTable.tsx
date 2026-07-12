import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Employee } from "./mockData";
import { StatusBadge } from "./StatusBadge";
import { Eye, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmployeeTableProps {
  employees: Employee[];
  onView: (emp: Employee) => void;
  onPromote: (emp: Employee) => void;
}

export function EmployeeTable({
  employees,
  onView,
  onPromote,
}: EmployeeTableProps) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-900/50">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="w-[300px] font-medium text-slate-400">Employee</TableHead>
              <TableHead className="font-medium text-slate-400">Department</TableHead>
              <TableHead className="font-medium text-slate-400">Role</TableHead>
              <TableHead className="font-medium text-slate-400">Status</TableHead>
              <TableHead className="text-right font-medium text-slate-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No employees found.
                </TableCell>
              </TableRow>
            ) : (
              employees.map((emp) => (
                <TableRow
                  key={emp.id}
                  className="border-border hover:bg-slate-800/30 transition-colors group"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 border border-border">
                        <AvatarImage src={emp.avatarSrc} />
                        <AvatarFallback className="bg-slate-800 text-slate-300 text-xs">
                          {emp.avatarInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-200">{emp.fullName}</span>
                        <span className="text-xs text-slate-500">{emp.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-300">
                    {emp.department}
                  </TableCell>
                  <TableCell className="text-slate-400 text-sm">
                    {emp.role}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={emp.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800"
                        title="View Details"
                        onClick={() => onView(emp)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10"
                        title="Change Role"
                        onClick={() => onPromote(emp)}
                      >
                        <ShieldAlert className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
