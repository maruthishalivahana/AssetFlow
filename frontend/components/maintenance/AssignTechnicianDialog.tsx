import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MaintenanceRequest, MaintenancePriority, mockTechnicians } from "./mockData";

interface AssignTechnicianDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: MaintenanceRequest | null;
  onAssign: (
    req: MaintenanceRequest,
    technicianId: string,
    priority: MaintenancePriority,
    estimatedCompletion: string
  ) => void;
}

const priorities: MaintenancePriority[] = ["Low", "Medium", "High", "Critical"];

export function AssignTechnicianDialog({
  open,
  onOpenChange,
  request,
  onAssign,
}: AssignTechnicianDialogProps) {
  const [technicianId, setTechnicianId] = useState("");
  const [priority, setPriority] = useState<MaintenancePriority>("Medium");
  const [estimatedCompletion, setEstimatedCompletion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!request) return null;

  const handleSubmit = async () => {
    if (!technicianId) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    onAssign(request, technicianId, priority, estimatedCompletion);
    setIsSubmitting(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[460px] bg-[#111111] border-[#262626] text-white rounded-2xl shadow-xl p-0">
        <DialogHeader className="px-6 py-5 border-b border-[#262626]">
          <DialogTitle className="text-xl font-heading text-slate-100">
            Assign Technician
          </DialogTitle>
          <p className="text-sm text-slate-400 mt-1 font-normal">
            {request.assetTag} — {request.issueTitle}
          </p>
        </DialogHeader>

        <div className="p-6 space-y-5">
          {/* Technician */}
          <div className="space-y-2">
            <Label className="text-slate-300">
              Technician <span className="text-red-500">*</span>
            </Label>
            <Select value={technicianId} onValueChange={setTechnicianId}>
              <SelectTrigger
                className={`bg-[#090909] border-[#262626] text-slate-100 ${!technicianId ? "text-slate-500" : ""}`}
              >
                <SelectValue placeholder="Select a technician..." />
              </SelectTrigger>
              <SelectContent>
                {mockTechnicians.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    <div>
                      <span className="font-medium">{t.name}</span>
                      <span className="text-slate-500 ml-2 text-xs">({t.specialty})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label className="text-slate-300">Priority</Label>
            <Select
              value={priority}
              onValueChange={(v) => setPriority(v as MaintenancePriority)}
            >
              <SelectTrigger className="bg-[#090909] border-[#262626] text-slate-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {priorities.map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Expected completion */}
          <div className="space-y-2">
            <Label htmlFor="expCompletion" className="text-slate-300">
              Expected Completion Date
            </Label>
            <Input
              id="expCompletion"
              type="date"
              value={estimatedCompletion}
              onChange={(e) => setEstimatedCompletion(e.target.value)}
              className="bg-[#090909] border-[#262626] text-slate-100"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#262626]">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="bg-transparent border-[#262626] text-slate-300 hover:bg-[#262626] hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !technicianId}
              className="bg-purple-600 hover:bg-purple-700 text-white min-w-[130px]"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Assign Technician"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
