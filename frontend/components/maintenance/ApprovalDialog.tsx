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
import { MaintenanceRequest } from "./mockData";

interface ApprovalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: MaintenanceRequest | null;
  onApprove: (req: MaintenanceRequest, estimatedCompletion: string, notes: string) => void;
  onReject: (req: MaintenanceRequest, reason: string) => void;
}

export function ApprovalDialog({
  open,
  onOpenChange,
  request,
  onApprove,
  onReject,
}: ApprovalDialogProps) {
  const [estimatedCompletion, setEstimatedCompletion] = useState("");
  const [notes, setNotes] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [mode, setMode] = useState<"approve" | "reject">("approve");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!request) return null;

  const handleApprove = async () => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    onApprove(request, estimatedCompletion, notes);
    setIsSubmitting(false);
    onOpenChange(false);
  };

  const handleReject = async () => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    onReject(request, rejectReason);
    setIsSubmitting(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] bg-[#111111] border-[#262626] text-white rounded-2xl shadow-xl p-0">
        <DialogHeader className="px-6 py-5 border-b border-[#262626]">
          <DialogTitle className="text-xl font-heading text-slate-100">
            Review Request
          </DialogTitle>
          <p className="text-sm text-slate-400 mt-1 font-normal">
            {request.assetTag} — {request.issueTitle}
          </p>
        </DialogHeader>

        <div className="p-6 space-y-5">
          {/* Mode tabs */}
          <div className="flex rounded-xl overflow-hidden border border-[#262626]">
            <button
              onClick={() => setMode("approve")}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                mode === "approve"
                  ? "bg-blue-600 text-white"
                  : "bg-[#090909] text-slate-400 hover:text-white"
              }`}
            >
              Approve
            </button>
            <button
              onClick={() => setMode("reject")}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                mode === "reject"
                  ? "bg-red-600 text-white"
                  : "bg-[#090909] text-slate-400 hover:text-white"
              }`}
            >
              Reject
            </button>
          </div>

          {mode === "approve" ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="estCompletion" className="text-slate-300">
                  Estimated Completion Date
                </Label>
                <Input
                  id="estCompletion"
                  type="date"
                  value={estimatedCompletion}
                  onChange={(e) => setEstimatedCompletion(e.target.value)}
                  className="bg-[#090909] border-[#262626] text-slate-100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="approvalNotes" className="text-slate-300">
                  Approval Notes
                </Label>
                <textarea
                  id="approvalNotes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any instructions for the technician..."
                  className="w-full bg-[#090909] border border-[#262626] rounded-lg p-3 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2 border-t border-[#262626]">
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="bg-transparent border-[#262626] text-slate-300 hover:bg-[#262626] hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleApprove}
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]"
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Approve"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rejectReason" className="text-slate-300">
                  Rejection Reason <span className="text-red-500">*</span>
                </Label>
                <textarea
                  id="rejectReason"
                  rows={4}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Explain why this request is being rejected..."
                  className="w-full bg-[#090909] border border-[#262626] rounded-lg p-3 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2 border-t border-[#262626]">
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="bg-transparent border-[#262626] text-slate-300 hover:bg-[#262626] hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleReject}
                  disabled={isSubmitting || !rejectReason.trim()}
                  className="bg-red-600 hover:bg-red-700 text-white min-w-[120px]"
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Reject"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
