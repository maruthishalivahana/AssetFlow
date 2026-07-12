"use client";

import React, { useState, useMemo, useCallback } from "react";
import { MaintenanceHeader } from "./MaintenanceHeader";
import { MaintenanceStats } from "./MaintenanceStats";
import { MaintenanceFilters } from "./MaintenanceFilters";
import { MaintenanceBoard } from "./MaintenanceBoard";
import { MaintenanceDetails } from "./MaintenanceDetails";
import { RaiseMaintenanceDialog } from "./RaiseMaintenanceDialog";
import { ApprovalDialog } from "./ApprovalDialog";
import { AssignTechnicianDialog } from "./AssignTechnicianDialog";
import { ResolutionDialog } from "./ResolutionDialog";
import { EmptyMaintenance } from "./EmptyMaintenance";
import {
  MaintenanceRequest,
  MaintenancePriority,
  MaintenanceStatus,
  mockMaintenanceRequests,
} from "./mockData";

export function MaintenancePage() {
  // ---- Data State ----
  const [requests, setRequests] = useState<MaintenanceRequest[]>(mockMaintenanceRequests);

  // ---- Selected request for details panel ----
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // ---- Filter state ----
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [technicianFilter, setTechnicianFilter] = useState("all");

  // ---- Dialog state ----
  const [isRaiseOpen, setIsRaiseOpen] = useState(false);
  const [isApprovalOpen, setIsApprovalOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [isResolutionOpen, setIsResolutionOpen] = useState(false);
  const [dialogTarget, setDialogTarget] = useState<MaintenanceRequest | null>(null);

  // ---- Derived: selected request ----
  const selectedRequest = useMemo(
    () => requests.find((r) => r.id === selectedId) ?? null,
    [requests, selectedId]
  );

  // ---- Filtered requests ----
  const filteredRequests = useMemo(() => {
    const q = search.toLowerCase();
    return requests.filter((r) => {
      const matchSearch =
        r.issueTitle.toLowerCase().includes(q) ||
        r.assetTag.toLowerCase().includes(q) ||
        r.assetName.toLowerCase().includes(q) ||
        r.reportedBy.toLowerCase().includes(q);
      const matchPriority = priorityFilter === "all" || r.priority === priorityFilter;
      const matchDept = departmentFilter === "all" || r.department === departmentFilter;
      const matchTech = technicianFilter === "all" || r.technicianId === technicianFilter;
      return matchSearch && matchPriority && matchDept && matchTech;
    });
  }, [requests, search, priorityFilter, departmentFilter, technicianFilter]);

  const handleReset = () => {
    setSearch("");
    setPriorityFilter("all");
    setDepartmentFilter("all");
    setTechnicianFilter("all");
  };

  // ---- Drag-and-drop status change ----
  const handleStatusChange = useCallback(
    (requestId: string, newStatus: MaintenanceStatus) => {
      setRequests((prev) =>
        prev.map((r) => {
          if (r.id !== requestId) return r;
          const newEvent = {
            id: `e${r.timeline.length + 1}`,
            event: `Moved to ${newStatus}`,
            actor: "Current User",
            timestamp: new Date().toISOString(),
          };
          return {
            ...r,
            status: newStatus,
            updatedAt: new Date().toISOString(),
            timeline: [...r.timeline, newEvent],
          };
        })
      );
    },
    []
  );

  // ---- Mutation helpers ----
  const updateRequest = useCallback(
    (id: string, updates: Partial<MaintenanceRequest>) => {
      setRequests((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r
        )
      );
    },
    []
  );

  // ---- Action handlers ----
  const handleRaise = (data: {
    assetTag: string;
    issueTitle: string;
    issueDescription: string;
    priority: MaintenancePriority;
  }) => {
    const newReq: MaintenanceRequest = {
      id: `MR-${String(requests.length + 1).padStart(3, "0")}`,
      assetTag: data.assetTag,
      assetName: `Asset ${data.assetTag}`,
      assetCategory: "General",
      department: "General",
      currentHolder: "Unassigned",
      issueTitle: data.issueTitle,
      issueDescription: data.issueDescription,
      priority: data.priority,
      status: "Pending",
      reportedBy: "Current User",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timeline: [
        {
          id: "e1",
          event: "Request Raised",
          actor: "Current User",
          timestamp: new Date().toISOString(),
        },
      ],
    };
    setRequests((prev) => [newReq, ...prev]);
    setSelectedId(newReq.id);
  };

  const handleApprove = (req: MaintenanceRequest, estimatedCompletion: string, notes: string) => {
    updateRequest(req.id, {
      status: "Approved",
      estimatedCompletion,
      timeline: [
        ...req.timeline,
        {
          id: `e${req.timeline.length + 1}`,
          event: "Approved",
          actor: "Admin",
          timestamp: new Date().toISOString(),
          note: notes || undefined,
        },
      ],
    });
  };

  const handleReject = (req: MaintenanceRequest, reason: string) => {
    updateRequest(req.id, {
      status: "Rejected",
      timeline: [
        ...req.timeline,
        {
          id: `e${req.timeline.length + 1}`,
          event: "Rejected",
          actor: "Admin",
          timestamp: new Date().toISOString(),
          note: reason,
        },
      ],
    });
  };

  const handleAssign = (
    req: MaintenanceRequest,
    technicianId: string,
    priority: MaintenancePriority,
    estimatedCompletion: string
  ) => {
    updateRequest(req.id, {
      status: "Assigned",
      technicianId,
      priority,
      estimatedCompletion,
      timeline: [
        ...req.timeline,
        {
          id: `e${req.timeline.length + 1}`,
          event: "Technician Assigned",
          actor: "Admin",
          timestamp: new Date().toISOString(),
        },
      ],
    });
  };

  const handleResolve = (
    req: MaintenanceRequest,
    resolutionNotes: string,
    repairCost: number,
    completionDate: string,
    conditionAfterRepair: string
  ) => {
    updateRequest(req.id, {
      status: "Resolved",
      resolutionNotes,
      repairCost,
      conditionAfterRepair,
      timeline: [
        ...req.timeline,
        {
          id: `e${req.timeline.length + 1}`,
          event: "Repair Completed",
          actor: "Technician",
          timestamp: new Date().toISOString(),
          note: resolutionNotes,
        },
        {
          id: `e${req.timeline.length + 2}`,
          event: "Asset Returned",
          actor: "Admin",
          timestamp: new Date().toISOString(),
        },
      ],
    });
  };

  // Open approval / assign / resolve dialogs from details panel
  const openApproval = (req: MaintenanceRequest) => {
    setDialogTarget(req);
    setIsApprovalOpen(true);
  };
  const openAssign = (req: MaintenanceRequest) => {
    setDialogTarget(req);
    setIsAssignOpen(true);
  };
  const openResolve = (req: MaintenanceRequest) => {
    setDialogTarget(req);
    setIsResolutionOpen(true);
  };

  const hasResults = filteredRequests.length > 0;

  return (
    <div className="w-full h-full flex flex-col pt-6 pb-12 px-4 sm:px-6 lg:px-8">
      <MaintenanceHeader onRaiseClick={() => setIsRaiseOpen(true)} />
      <MaintenanceStats requests={requests} />
      <MaintenanceFilters
        search={search}
        onSearchChange={setSearch}
        priority={priorityFilter}
        onPriorityChange={setPriorityFilter}
        department={departmentFilter}
        onDepartmentChange={setDepartmentFilter}
        technicianId={technicianFilter}
        onTechnicianChange={setTechnicianFilter}
        onReset={handleReset}
      />

      {!hasResults ? (
        <EmptyMaintenance onRaiseClick={() => setIsRaiseOpen(true)} />
      ) : (
        <div
          className={`flex gap-5 transition-all ${
            selectedRequest ? "flex-col xl:flex-row" : "flex-col"
          }`}
          style={{
            height: selectedRequest ? "calc(100vh - 310px)" : "auto",
            minHeight: "500px",
          }}
        >
          {/* Board (full width, or 70% when details open) */}
          <div className={selectedRequest ? "xl:flex-[7] min-w-0 h-full" : "w-full"}>
            <MaintenanceBoard
              requests={filteredRequests}
              selectedId={selectedId}
              onCardClick={(req) => setSelectedId(req.id)}
              onStatusChange={handleStatusChange}
            />
          </div>

          {/* Details Panel (30%) */}
          {selectedRequest && (
            <div className="xl:flex-[3] min-w-[300px] max-w-full xl:max-w-[380px] h-full">
              <MaintenanceDetails
                request={selectedRequest}
                onClose={() => setSelectedId(null)}
                onApprove={openApproval}
                onAssign={openAssign}
                onResolve={openResolve}
                onReject={openApproval}
              />
            </div>
          )}
        </div>
      )}

      {/* Dialogs */}
      <RaiseMaintenanceDialog
        open={isRaiseOpen}
        onOpenChange={setIsRaiseOpen}
        onSubmit={handleRaise}
      />
      <ApprovalDialog
        open={isApprovalOpen}
        onOpenChange={setIsApprovalOpen}
        request={dialogTarget}
        onApprove={handleApprove}
        onReject={handleReject}
      />
      <AssignTechnicianDialog
        open={isAssignOpen}
        onOpenChange={setIsAssignOpen}
        request={dialogTarget}
        onAssign={handleAssign}
      />
      <ResolutionDialog
        open={isResolutionOpen}
        onOpenChange={setIsResolutionOpen}
        request={dialogTarget}
        onResolve={handleResolve}
      />
    </div>
  );
}
