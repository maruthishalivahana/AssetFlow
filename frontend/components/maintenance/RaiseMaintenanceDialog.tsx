import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MaintenancePriority } from "./mockData";

const schema = z.object({
  assetTag: z.string().min(1, "Asset is required"),
  issueTitle: z.string().min(3, "Issue title must be at least 3 characters"),
  issueDescription: z.string().min(10, "Please describe the issue in detail"),
  priority: z.enum(["Low", "Medium", "High", "Critical"]),
});

type FormValues = z.infer<typeof schema>;

interface RaiseMaintenanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FormValues) => void;
}

const sampleAssets = [
  { tag: "AF-0062", name: "Epson Projector P01" },
  { tag: "AF-0114", name: "HP LaserJet Printer" },
  { tag: "AF-0201", name: "MacBook Pro (Engineering Pool)" },
  { tag: "AF-0332", name: "Cisco Switch (Floor 2)" },
  { tag: "AF-0441", name: "Office Chair – Executive Suite" },
  { tag: "AF-0093", name: "LG Air Conditioner" },
  { tag: "AF-0289", name: "Dell Monitor 27\"" },
  { tag: "AF-0078", name: "Toyota Forklift FV01" },
  { tag: "AF-0145", name: "Conference Room Display B2" },
  { tag: "AF-0377", name: "Aruba Wi-Fi Access Point" },
  { tag: "AF-0460", name: "Ergonomic Chair (Finance)" },
  { tag: "AF-0557", name: "UPS Battery Backup" },
  { tag: "AF-0321", name: "Dell Latitude Laptop (Ops)" },
];

const priorities: MaintenancePriority[] = ["Low", "Medium", "High", "Critical"];

export function RaiseMaintenanceDialog({ open, onOpenChange, onSubmit }: RaiseMaintenanceDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: { assetTag: "", issueTitle: "", issueDescription: "", priority: "Medium" },
  });

  const assetTag = watch("assetTag");
  const priority = watch("priority");

  const handleClose = (open: boolean) => {
    if (!open) reset();
    onOpenChange(open);
  };

  const onFormSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    onSubmit(data);
    setIsSubmitting(false);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[560px] bg-[#111111] border-[#262626] text-white rounded-2xl shadow-xl p-0 max-h-[90vh] flex flex-col">
        <DialogHeader className="px-6 py-5 border-b border-[#262626]">
          <DialogTitle className="text-xl font-heading text-slate-100">
            Raise Maintenance Request
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar"
        >
          {/* Asset Selector */}
          <div className="space-y-2">
            <Label className="text-slate-300">
              Select Asset <span className="text-red-500">*</span>
            </Label>
            <Select value={assetTag} onValueChange={(v) => setValue("assetTag", v as string)}>
              <SelectTrigger
                className={`bg-[#090909] border-[#262626] text-slate-100 ${errors.assetTag ? "border-red-500" : ""}`}
              >
                <SelectValue placeholder="Choose an asset..." />
              </SelectTrigger>
              <SelectContent>
                {sampleAssets.map((a) => (
                  <SelectItem key={a.tag} value={a.tag}>
                    {a.tag} — {a.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.assetTag && (
              <p className="text-xs text-red-400">{errors.assetTag.message}</p>
            )}
          </div>

          {/* Issue Title */}
          <div className="space-y-2">
            <Label htmlFor="issueTitle" className="text-slate-300">
              Issue Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="issueTitle"
              placeholder="e.g. Printer paper jam – recurring"
              className={`bg-[#090909] border-[#262626] text-slate-100 placeholder:text-slate-500 ${errors.issueTitle ? "border-red-500" : ""}`}
              {...register("issueTitle")}
            />
            {errors.issueTitle && (
              <p className="text-xs text-red-400">{errors.issueTitle.message}</p>
            )}
          </div>

          {/* Issue Description */}
          <div className="space-y-2">
            <Label htmlFor="issueDescription" className="text-slate-300">
              Issue Description <span className="text-red-500">*</span>
            </Label>
            <textarea
              id="issueDescription"
              rows={4}
              placeholder="Describe the problem in detail. Include when it started and what was tried."
              className={`w-full bg-[#090909] border rounded-lg p-3 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none ${errors.issueDescription ? "border-red-500" : "border-[#262626]"}`}
              {...register("issueDescription")}
            />
            {errors.issueDescription && (
              <p className="text-xs text-red-400">{errors.issueDescription.message}</p>
            )}
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label className="text-slate-300">
              Priority <span className="text-red-500">*</span>
            </Label>
            <Select
              value={priority}
              onValueChange={(v) => setValue("priority", v as MaintenancePriority)}
            >
              <SelectTrigger className="bg-[#090909] border-[#262626] text-slate-100">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                {priorities.map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Photo attachment placeholder */}
          <div className="space-y-2">
            <Label className="text-slate-300">Attach Photo (Optional)</Label>
            <div className="border border-dashed border-[#262626] rounded-xl p-6 text-center hover:border-[#363636] transition-colors cursor-pointer">
              <p className="text-sm text-slate-500">Click to upload or drag & drop</p>
              <p className="text-xs text-slate-600 mt-1">PNG, JPG up to 10MB</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[#262626]">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleClose(false)}
              className="bg-transparent border-[#262626] text-slate-300 hover:bg-[#262626] hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-slate-50 text-slate-900 hover:bg-slate-200 min-w-[140px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Request"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
