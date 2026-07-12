import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Department } from "./mockData";
import { StatusBadge } from "./StatusBadge";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DepartmentTableProps {
  departments: Department[];
  onView: (dept: Department) => void;
  onEdit: (dept: Department) => void;
  onDelete: (dept: Department) => void;
}

export function DepartmentTable({
  departments,
  onView,
  onEdit,
  onDelete,
}: DepartmentTableProps) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-900/50">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="w-[250px] font-medium text-slate-400">Department</TableHead>
              <TableHead className="font-medium text-slate-400">Department Head</TableHead>
              <TableHead className="font-medium text-slate-400">Parent Dept</TableHead>
              <TableHead className="font-medium text-slate-400">Status</TableHead>
              <TableHead className="text-right font-medium text-slate-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {departments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No departments found.
                </TableCell>
              </TableRow>
            ) : (
              departments.map((dept) => (
                <TableRow
                  key={dept.id}
                  className="border-border hover:bg-slate-800/30 transition-colors group"
                >
                  <TableCell className="font-medium text-slate-200">
                    {dept.name}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6 border border-border">
                        <AvatarImage src={dept.headAvatar} />
                        <AvatarFallback className="bg-slate-800 text-slate-300 text-[10px]">
                          {dept.headName.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-slate-300">{dept.headName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-400">
                    {dept.parentDept || "-"}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={dept.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800"
                        onClick={() => onView(dept)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800"
                        onClick={() => onEdit(dept)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                        onClick={() => onDelete(dept)}
                      >
                        <Trash2 className="h-4 w-4" />
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
