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
import { MaintenanceRequest } from "./mockData";

interface ResolutionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: MaintenanceRequest | null;
  onResolve: (
    req: MaintenanceRequest,
    resolutionNotes: string,
    repairCost: number,
    completionDate: string,
    conditionAfterRepair: string
  ) => void;
}

const conditions = ["Excellent", "Good", "Fair", "Poor"];

export function ResolutionDialog({
  open,
  onOpenChange,
  request,
  onResolve,
}: ResolutionDialogProps) {
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [repairCost, setRepairCost] = useState("");
  const [completionDate, setCompletionDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [condition, setCondition] = useState("Good");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!request) return null;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    onResolve(
      request,
      resolutionNotes,
      parseFloat(repairCost) || 0,
      completionDate,
      condition
    );
    setIsSubmitting(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] bg-[#111111] border-[#262626] text-white rounded-2xl shadow-xl p-0">
        <DialogHeader className="px-6 py-5 border-b border-[#262626]">
          <DialogTitle className="text-xl font-heading text-slate-100">
            Mark as Resolved
          </DialogTitle>
          <p className="text-sm text-slate-400 mt-1 font-normal">
            {request.assetTag} — {request.issueTitle}
          </p>
        </DialogHeader>

        <div className="p-6 space-y-5">
          {/* Resolution Notes */}
          <div className="space-y-2">
            <Label htmlFor="resNotes" className="text-slate-300">
              Resolution Notes <span className="text-red-500">*</span>
            </Label>
            <textarea
              id="resNotes"
              rows={4}
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              placeholder="Describe what was done to resolve the issue..."
              className="w-full bg-[#090909] border border-[#262626] rounded-lg p-3 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Repair Cost */}
            <div className="space-y-2">
              <Label htmlFor="repairCost" className="text-slate-300">
                Repair Cost ($)
              </Label>
              <Input
                id="repairCost"
                type="number"
                step="0.01"
                value={repairCost}
                onChange={(e) => setRepairCost(e.target.value)}
                placeholder="0.00"
                className="bg-[#090909] border-[#262626] text-slate-100 placeholder:text-slate-500"
              />
            </div>

            {/* Completion Date */}
            <div className="space-y-2">
              <Label htmlFor="completionDate" className="text-slate-300">
                Completion Date
              </Label>
              <Input
                id="completionDate"
                type="date"
                value={completionDate}
                onChange={(e) => setCompletionDate(e.target.value)}
                className="bg-[#090909] border-[#262626] text-slate-100"
              />
            </div>
          </div>

          {/* Condition After Repair */}
          <div className="space-y-2">
            <Label className="text-slate-300">Asset Condition After Repair</Label>
            <Select value={condition} onValueChange={(v) => setCondition(v || "")}>
              <SelectTrigger className="bg-[#090909] border-[#262626] text-slate-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {conditions.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              disabled={isSubmitting || !resolutionNotes.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[140px]"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Mark as Resolved"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
