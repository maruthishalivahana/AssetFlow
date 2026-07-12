import React from "react";
import { Search, Filter, RotateCw, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OrganizationToolbarProps {
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
  extraFilterLabel?: string;
  extraFilterValue?: string;
  onExtraFilterChange?: (val: string) => void;
  extraFilterOptions?: { label: string; value: string }[];
  onRefresh?: () => void;
  onExport?: () => void;
}

export function OrganizationToolbar({
  searchPlaceholder,
  searchValue,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  extraFilterLabel,
  extraFilterValue,
  onExtraFilterChange,
  extraFilterOptions,
  onRefresh,
  onExport,
}: OrganizationToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto flex-1">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 bg-card border-border text-foreground"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={(val) => onStatusFilterChange(val as string)}>
          <SelectTrigger className="w-full sm:w-[130px] bg-card border-border">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>

        {extraFilterLabel && extraFilterOptions && onExtraFilterChange && (
          <Select value={extraFilterValue} onValueChange={(val) => onExtraFilterChange(val as string)}>
            <SelectTrigger className="w-full sm:w-[150px] bg-card border-border">
              <SelectValue placeholder={extraFilterLabel} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All {extraFilterLabel}s</SelectItem>
              {extraFilterOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        <Button variant="outline" size="icon" onClick={onRefresh} className="bg-card border-border hover:bg-muted text-foreground">
          <RotateCw className="h-4 w-4" />
        </Button>
        <Button variant="outline" onClick={onExport} className="bg-card border-border hover:bg-muted text-foreground hidden sm:flex">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>
    </div>
  );
}
