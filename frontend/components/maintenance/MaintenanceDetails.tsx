import React from "react";
import { MaintenanceRequest, mockTechnicians } from "./mockData";
import { MaintenanceStatusBadge } from "./MaintenanceStatusBadge";
import { PriorityBadge } from "./PriorityBadge";
import { MaintenanceTimeline } from "./MaintenanceTimeline";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Package,
  Building2,
  User,
  CalendarDays,
  DollarSign,
  UserCog,
  X,
  BadgeCheck,
  Trash2,
  Wrench,
} from "lucide-react";

interface MaintenanceDetailsProps {
  request: MaintenanceRequest;
  onClose: () => void;
  onApprove: (req: MaintenanceRequest) => void;
  onAssign: (req: MaintenanceRequest) => void;
  onResolve: (req: MaintenanceRequest) => void;
  onReject: (req: MaintenanceRequest) => void;
}

export function MaintenanceDetails({
  request,
  onClose,
  onApprove,
  onAssign,
  onResolve,
  onReject,
}: MaintenanceDetailsProps) {
  const technician = request.technicianId
    ? mockTechnicians.find((t) => t.id === request.technicianId)
    : null;

  const techInitials = technician
    ? technician.name.split(" ").map((n) => n[0]).join("").substring(0, 2)
    : null;

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="bg-[#111111] border border-[#262626] rounded-2xl flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between px-5 py-4 border-b border-[#262626] shrink-0">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-mono text-slate-500 mb-1">{request.assetTag}</p>
          <h3 className="text-base font-heading font-semibold text-slate-100 leading-snug">
            {request.issueTitle}
          </h3>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <MaintenanceStatusBadge status={request.status} />
            <PriorityBadge priority={request.priority} />
          </div>
        </div>
        <button
          onClick={onClose}
          className="ml-3 p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-[#262626] transition-colors shrink-0"
          aria-label="Close details panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Asset image placeholder */}
        <div className="mx-5 mt-4 h-28 bg-[#090909] border border-[#262626] rounded-xl flex items-center justify-center mb-4">
          <div className="text-center">
            <Package className="w-8 h-8 text-slate-600 mx-auto mb-1" />
            <p className="text-xs text-slate-600">{request.assetCategory}</p>
          </div>
        </div>

        <div className="px-5 pb-5 space-y-5">
          {/* Asset Info */}
          <section>
            <h4 className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-3">
              Asset Details
            </h4>
            <div className="space-y-2.5">
              <InfoRow icon={Package} label="Asset" value={request.assetName} />
              <InfoRow icon={Building2} label="Department" value={request.department} />
              <InfoRow icon={User} label="Holder" value={request.currentHolder} />
            </div>
          </section>

          {/* Issue */}
          <section className="border-t border-[#262626] pt-4">
            <h4 className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-3">
              Issue Description
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed bg-[#090909] border border-[#262626] rounded-xl p-3">
              {request.issueDescription}
            </p>
          </section>

          {/* Technician */}
          {technician && (
            <section className="border-t border-[#262626] pt-4">
              <h4 className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-3">
                Assigned Technician
              </h4>
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9 border border-[#262626]">
                  <AvatarFallback className="bg-purple-900/40 text-purple-300 text-xs">
                    {techInitials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-slate-200">{technician.name}</p>
                  <p className="text-xs text-slate-500">{technician.specialty}</p>
                </div>
              </div>
            </section>
          )}

          {/* Dates & Cost */}
          <section className="border-t border-[#262626] pt-4">
            <h4 className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-3">
              Scheduling & Cost
            </h4>
            <div className="space-y-2.5">
              <InfoRow icon={CalendarDays} label="Raised" value={formatDate(request.createdAt)} />
              <InfoRow icon={CalendarDays} label="Updated" value={formatDate(request.updatedAt)} />
              {request.estimatedCompletion && (
                <InfoRow
                  icon={CalendarDays}
                  label="Est. Completion"
                  value={new Date(request.estimatedCompletion).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                />
              )}
              {request.repairCost !== undefined && (
                <InfoRow icon={DollarSign} label="Repair Cost" value={`$${request.repairCost.toLocaleString()}`} />
              )}
              {request.conditionAfterRepair && (
                <InfoRow icon={Wrench} label="Condition After" value={request.conditionAfterRepair} />
              )}
            </div>
          </section>

          {/* Resolution Notes */}
          {request.resolutionNotes && (
            <section className="border-t border-[#262626] pt-4">
              <h4 className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-3">
                Resolution Notes
              </h4>
              <p className="text-sm text-slate-300 bg-[#090909] border border-[#262626] rounded-xl p-3 leading-relaxed">
                {request.resolutionNotes}
              </p>
            </section>
          )}

          {/* Timeline */}
          <section className="border-t border-[#262626] pt-4">
            <h4 className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-4">
              Activity Timeline
            </h4>
            <MaintenanceTimeline events={request.timeline} />
          </section>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-5 py-4 border-t border-[#262626] shrink-0 space-y-2">
        {request.status === "Pending" && (
          <div className="flex gap-2">
            <Button
              onClick={() => onApprove(request)}
              size="sm"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <BadgeCheck className="w-4 h-4 mr-1.5" />
              Approve
            </Button>
            <Button
              onClick={() => onReject(request)}
              size="sm"
              variant="outline"
              className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10 bg-transparent"
            >
              <Trash2 className="w-4 h-4 mr-1.5" />
              Reject
            </Button>
          </div>
        )}
        {request.status === "Approved" && (
          <Button
            onClick={() => onAssign(request)}
            size="sm"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            <UserCog className="w-4 h-4 mr-1.5" />
            Assign Technician
          </Button>
        )}
        {(request.status === "Assigned" || request.status === "In Progress") && (
          <Button
            onClick={() => onResolve(request)}
            size="sm"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Wrench className="w-4 h-4 mr-1.5" />
            Mark as Resolved
          </Button>
        )}
      </div>
    </div>
  );
}

// Small helper row component
function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <Icon className="w-4 h-4 text-slate-500 shrink-0" />
      <span className="text-slate-400 w-20 shrink-0">{label}</span>
      <span className="text-slate-200 font-medium truncate">{value}</span>
    </div>
  );
}
