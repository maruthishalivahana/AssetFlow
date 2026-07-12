import React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MaintenancePriority, MaintenanceStatus, mockTechnicians } from "./mockData";

interface MaintenanceFiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  priority: string;
  onPriorityChange: (v: string) => void;
  department: string;
  onDepartmentChange: (v: string) => void;
  technicianId: string;
  onTechnicianChange: (v: string) => void;
  onReset: () => void;
}

const priorities: MaintenancePriority[] = ["Low", "Medium", "High", "Critical"];
const departments = ["Engineering", "HR", "Marketing", "Finance", "Operations", "Executive"];

export function MaintenanceFilters({
  search,
  onSearchChange,
  priority,
  onPriorityChange,
  department,
  onDepartmentChange,
  technicianId,
  onTechnicianChange,
  onReset,
}: MaintenanceFiltersProps) {
  const hasFilters = search || priority !== "all" || department !== "all" || technicianId !== "all";

  return (
    <div className="bg-[#111111] border border-[#262626] rounded-2xl p-4 mb-6 flex flex-wrap gap-3 items-center">
      {/* Search */}
      <div className="relative flex-grow min-w-[220px] max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
        <Input
          placeholder="Search requests..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 bg-[#090909] border-[#262626] text-slate-200 placeholder:text-slate-500"
        />
      </div>

      {/* Priority */}
      <Select value={priority} onValueChange={(v) => onPriorityChange(v as string)}>
        <SelectTrigger className="w-[130px] bg-[#090909] border-[#262626] text-slate-200">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priorities</SelectItem>
          {priorities.map((p) => (
            <SelectItem key={p} value={p}>{p}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Department */}
      <Select value={department} onValueChange={(v) => onDepartmentChange(v as string)}>
        <SelectTrigger className="w-[140px] bg-[#090909] border-[#262626] text-slate-200">
          <SelectValue placeholder="Department" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Depts</SelectItem>
          {departments.map((d) => (
            <SelectItem key={d} value={d}>{d}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Technician */}
      <Select value={technicianId} onValueChange={(v) => onTechnicianChange(v as string)}>
        <SelectTrigger className="w-[160px] bg-[#090909] border-[#262626] text-slate-200">
          <SelectValue placeholder="Technician" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Technicians</SelectItem>
          {mockTechnicians.map((t) => (
            <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Reset */}
      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="text-slate-400 hover:text-white hover:bg-[#262626] gap-1.5"
        >
          <X className="h-4 w-4" />
          Reset
        </Button>
      )}
    </div>
  );
}
