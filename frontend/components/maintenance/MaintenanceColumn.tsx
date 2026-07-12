import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { MaintenanceRequest, MaintenanceStatus } from "./mockData";
import { MaintenanceCard } from "./MaintenanceCard";
import { cn } from "@/lib/utils";

interface MaintenanceColumnProps {
  status: MaintenanceStatus;
  requests: MaintenanceRequest[];
  selectedId: string | null;
  onCardClick: (req: MaintenanceRequest) => void;
}

const columnConfig: Record<
  MaintenanceStatus,
  { label: string; headerBg: string; countBg: string; dropBg: string }
> = {
  Pending: {
    label: "Pending",
    headerBg: "bg-slate-500/10",
    countBg: "bg-slate-500/20 text-slate-400",
    dropBg: "bg-slate-500/5 border-slate-500/20",
  },
  Approved: {
    label: "Approved",
    headerBg: "bg-blue-500/10",
    countBg: "bg-blue-500/20 text-blue-400",
    dropBg: "bg-blue-500/5 border-blue-500/20",
  },
  Assigned: {
    label: "Technician Assigned",
    headerBg: "bg-purple-500/10",
    countBg: "bg-purple-500/20 text-purple-400",
    dropBg: "bg-purple-500/5 border-purple-500/20",
  },
  "In Progress": {
    label: "In Progress",
    headerBg: "bg-amber-500/10",
    countBg: "bg-amber-500/20 text-amber-400",
    dropBg: "bg-amber-500/5 border-amber-500/20",
  },
  Resolved: {
    label: "Resolved",
    headerBg: "bg-emerald-500/10",
    countBg: "bg-emerald-500/20 text-emerald-400",
    dropBg: "bg-emerald-500/5 border-emerald-500/20",
  },
  Rejected: {
    label: "Rejected",
    headerBg: "bg-red-500/10",
    countBg: "bg-red-500/20 text-red-400",
    dropBg: "bg-red-500/5 border-red-500/20",
  },
};

export function MaintenanceColumn({
  status,
  requests,
  selectedId,
  onCardClick,
}: MaintenanceColumnProps) {
  const config = columnConfig[status];

  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div className="flex flex-col bg-[#0d0d0d] border border-[#262626] rounded-2xl min-w-[280px] w-[280px] flex-shrink-0 h-full">
      {/* Sticky Column Header */}
      <div
        className={cn(
          "flex items-center justify-between px-4 py-3 rounded-t-2xl border-b border-[#262626] sticky top-0 z-10",
          config.headerBg
        )}
      >
        <span className="text-sm font-semibold text-slate-200">{config.label}</span>
        <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full", config.countBg)}>
          {requests.length}
        </span>
      </div>

      {/* Drop Zone — scrollable cards */}
      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar rounded-b-2xl transition-colors",
          isOver && cn("border-2 border-dashed", config.dropBg)
        )}
      >
        {requests.length === 0 ? (
          <div
            className={cn(
              "text-center py-10 text-slate-600 text-sm rounded-xl border-2 border-dashed border-[#262626] transition-colors",
              isOver && config.dropBg
            )}
          >
            {isOver ? "Release to drop here" : "No requests"}
          </div>
        ) : (
          requests.map((req) => (
            <MaintenanceCard
              key={req.id}
              request={req}
              isSelected={selectedId === req.id}
              onClick={() => onCardClick(req)}
            />
          ))
        )}
      </div>
    </div>
  );
}
