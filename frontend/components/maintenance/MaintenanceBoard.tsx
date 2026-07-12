"use client";

import React, { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  closestCenter,
} from "@dnd-kit/core";
import { MaintenanceRequest, MaintenanceStatus } from "./mockData";
import { MaintenanceColumn } from "./MaintenanceColumn";
import { MaintenanceCard } from "./MaintenanceCard";

const COLUMN_ORDER: MaintenanceStatus[] = [
  "Pending",
  "Approved",
  "Assigned",
  "In Progress",
  "Resolved",
];

interface MaintenanceBoardProps {
  requests: MaintenanceRequest[];
  selectedId: string | null;
  onCardClick: (req: MaintenanceRequest) => void;
  onStatusChange: (requestId: string, newStatus: MaintenanceStatus) => void;
}

export function MaintenanceBoard({
  requests,
  selectedId,
  onCardClick,
  onStatusChange,
}: MaintenanceBoardProps) {
  const [activeRequest, setActiveRequest] = useState<MaintenanceRequest | null>(null);

  // Require pointer to move 8px before starting drag (prevents accidental drags on click)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const req = requests.find((r) => r.id === event.active.id);
    setActiveRequest(req ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveRequest(null);

    if (!over) return;

    const draggedId = active.id as string;
    const targetColumn = over.id as MaintenanceStatus;

    // Only update if the target is a valid column and it's a different status
    if (!COLUMN_ORDER.includes(targetColumn)) return;

    const draggedRequest = requests.find((r) => r.id === draggedId);
    if (!draggedRequest) return;

    if (draggedRequest.status !== targetColumn) {
      onStatusChange(draggedId, targetColumn);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div
        className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar"
        style={{ height: "calc(100vh - 320px)", minHeight: "500px" }}
      >
        {COLUMN_ORDER.map((status) => (
          <MaintenanceColumn
            key={status}
            status={status}
            requests={requests.filter((r) => r.status === status)}
            selectedId={selectedId}
            onCardClick={onCardClick}
          />
        ))}
      </div>

      {/* DragOverlay renders the "ghost" card that follows the cursor */}
      <DragOverlay dropAnimation={{ duration: 200, easing: "ease" }}>
        {activeRequest ? (
          <div className="rotate-1 scale-105 opacity-95 cursor-grabbing shadow-2xl shadow-black/50">
            <MaintenanceCard
              request={activeRequest}
              isSelected={false}
              onClick={() => {}}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
