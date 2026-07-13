import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AssetCategory, AssetStatus, AssetCondition } from "./mockData";
import { assetConditionOptions } from "./assetDisplay";

interface AssetToolbarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  categoryFilter: string;
  onCategoryChange: (val: string) => void;
  statusFilter: string;
  onStatusChange: (val: string) => void;
  departmentFilter: string;
  onDepartmentChange: (val: string) => void;
  locationFilter: string;
  onLocationChange: (val: string) => void;
  conditionFilter: string;
  onConditionChange: (val: string) => void;

  // Data for dynamic dropdowns
  departments: string[];
  locations: string[];
}

export function AssetToolbar({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  statusFilter,
  onStatusChange,
  departmentFilter,
  onDepartmentChange,
  locationFilter,
  onLocationChange,
  conditionFilter,
  onConditionChange,
  departments,
  locations,
}: AssetToolbarProps) {

  const categories: AssetCategory[] = ["Electronics", "Furniture", "Vehicles", "Network", "IT Equipment", "AV Equipment"];
  const statuses: AssetStatus[] = ["Available", "Allocated", "Maintenance", "Reserved", "Lost", "Disposed", "Retired"];
  const conditions = assetConditionOptions;

  return (
    <div className="bg-[#111111] border border-[#262626] rounded-2xl p-4 mb-6 flex flex-wrap gap-4 items-center">

      {/* Search Input */}
      <div className="relative flex-grow min-w-[280px] lg:max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
        <Input
          placeholder="Search by Tag, Serial, or QR code"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 bg-[#090909] border-[#262626] text-slate-200 placeholder:text-slate-500 w-full"
        />
      </div>

      {/* Category Dropdown */}
      <Select value={categoryFilter} onValueChange={(val) => onCategoryChange(val as string)}>
        <SelectTrigger className="w-full sm:w-[140px] bg-[#090909] border-[#262626] text-slate-200">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Status Dropdown */}
      <Select value={statusFilter} onValueChange={(val) => onStatusChange(val as string)}>
        <SelectTrigger className="w-full sm:w-[130px] bg-[#090909] border-[#262626] text-slate-200">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          {statuses.map((s) => (
            <SelectItem key={s} value={s}>{s}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Department Dropdown */}
      <Select value={departmentFilter} onValueChange={(val) => onDepartmentChange(val as string)}>
        <SelectTrigger className="w-full sm:w-[140px] bg-[#090909] border-[#262626] text-slate-200">
          <SelectValue placeholder="Department" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Depts</SelectItem>
          {departments.map((d) => (
            <SelectItem key={d} value={d}>{d}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Location Dropdown */}
      <Select value={locationFilter} onValueChange={(val) => onLocationChange(val as string)}>
        <SelectTrigger className="w-full sm:w-[130px] bg-[#090909] border-[#262626] text-slate-200">
          <SelectValue placeholder="Location" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Locations</SelectItem>
          {locations.map((loc) => (
            <SelectItem key={loc} value={loc}>{loc}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Condition Dropdown */}
      <Select value={conditionFilter} onValueChange={(val) => onConditionChange(val as string)}>
        <SelectTrigger className="w-full sm:w-[130px] bg-[#090909] border-[#262626] text-slate-200">
          <SelectValue placeholder="Condition" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Conditions</SelectItem>
          {conditions.map((c) => (
            <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

    </div>
  );
}
