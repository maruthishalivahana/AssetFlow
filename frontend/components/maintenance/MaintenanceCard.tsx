import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { MaintenanceRequest, mockTechnicians } from "./mockData";
import { MaintenanceStatusBadge } from "./MaintenanceStatusBadge";
import { PriorityBadge } from "./PriorityBadge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CalendarDays, Package, Building2, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface MaintenanceCardProps {
  request: MaintenanceRequest;
  isSelected: boolean;
  onClick: () => void;
}

const statusAccent: Record<string, string> = {
  Pending: "border-l-slate-500/50",
  Approved: "border-l-blue-500/50",
  Assigned: "border-l-purple-500/50",
  "In Progress": "border-l-amber-500/50",
  Resolved: "border-l-emerald-500/50",
  Rejected: "border-l-red-500/50",
};

export function MaintenanceCard({ request, isSelected, onClick }: MaintenanceCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: request.id,
    data: { request },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    zIndex: isDragging ? 999 : undefined,
    opacity: isDragging ? 0.4 : 1,
  };

  const technician = request.technicianId
    ? mockTechnicians.find((t) => t.id === request.technicianId)
    : null;

  const techInitials = technician
    ? technician.name.split(" ").map((n) => n[0]).join("").substring(0, 2)
    : null;

  const createdDate = new Date(request.createdAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onClick}
      className={cn(
        "bg-[#111111] border border-[#262626] border-l-4 rounded-xl p-4 cursor-pointer",
        "hover:bg-[#161616] hover:border-[#363636] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20",
        "transition-all duration-150 select-none",
        statusAccent[request.status] ?? "border-l-slate-500/50",
        isSelected && "ring-1 ring-slate-400/30 bg-[#161616] border-[#363636]",
        isDragging && "shadow-2xl shadow-black/50 ring-1 ring-white/10"
      )}
    >
      {/* Drag handle + asset tag row */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
          <Package className="w-3 h-3" />
          {request.assetTag}
        </div>
        <div className="flex items-center gap-2">
          <PriorityBadge priority={request.priority} />
          {/* Drag handle */}
          <button
            {...listeners}
            {...attributes}
            onClick={(e) => e.stopPropagation()}
            className="p-0.5 rounded text-slate-600 hover:text-slate-400 hover:bg-[#262626] transition-colors cursor-grab active:cursor-grabbing"
            aria-label="Drag to move"
          >
            <GripVertical className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Issue title */}
      <p className="text-sm font-semibold text-slate-100 leading-snug mb-3 line-clamp-2">
        {request.issueTitle}
      </p>

      {/* Asset name */}
      <p className="text-xs text-slate-400 truncate mb-1">{request.assetName}</p>

      {/* Department */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
        <Building2 className="w-3 h-3" />
        {request.department}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-[#262626]">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <CalendarDays className="w-3 h-3" />
          {createdDate}
        </div>
        <div className="flex items-center gap-2">
          {technician && techInitials && (
            <Avatar className="h-6 w-6 border border-[#262626]">
              <AvatarFallback className="bg-purple-900/40 text-purple-300 text-[10px]">
                {techInitials}
              </AvatarFallback>
            </Avatar>
          )}
          <MaintenanceStatusBadge status={request.status} />
        </div>
      </div>
    </div>
  );
}
