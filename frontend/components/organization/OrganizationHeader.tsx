import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrganizationHeaderProps {
  activeTab: string;
  onAddClick?: () => void;
}

export function OrganizationHeader({ activeTab, onAddClick }: OrganizationHeaderProps) {
  const getButtonText = () => {
    switch (activeTab) {
      case "departments":
        return "Add Department";
      case "categories":
        return "Add Category";
      case "employees":
        return "Add Employee";
      default:
        return "Add New";
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-heading font-semibold text-slate-50 tracking-tight">
          Organization Setup
        </h1>
        <p className="text-slate-400 mt-1">
          Manage departments, asset categories, employees and reporting hierarchy.
        </p>
      </div>
      
      {onAddClick && (
        <Button 
          onClick={onAddClick}
          className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[140px] shadow-sm transition-all hover:shadow-emerald-900/20"
        >
          <Plus className="mr-2 h-4 w-4" />
          {getButtonText()}
        </Button>
      )}
    </div>
  );
}
