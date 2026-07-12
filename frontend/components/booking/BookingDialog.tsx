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
import { BookableResource } from "./mockData";
import { BookingConflictAlert } from "./BookingConflictAlert";

const bookingSchema = z.object({
  resourceId: z.string().min(1, "Resource is required"),
  date: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start Time is required"),
  endTime: z.string().min(1, "End Time is required"),
  purpose: z.string().min(1, "Purpose is required"),
  department: z.string().min(1, "Department is required"),
  attendees: z.coerce.number().min(1, "At least 1 attendee is required"),
  notes: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resources: BookableResource[];
  selectedResourceId?: string;
  selectedDate?: string;
  onSave: (data: BookingFormValues) => void;
  hasConflict?: boolean; // Mock prop to trigger the conflict UI for demo
}

export function BookingDialog({
  open,
  onOpenChange,
  resources,
  selectedResourceId,
  selectedDate,
  onSave,
  hasConflict = false
}: BookingDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConflict, setShowConflict] = useState(hasConflict);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema) as any,
    defaultValues: {
      resourceId: selectedResourceId || "",
      date: selectedDate || new Date().toISOString().split("T")[0],
      startTime: "09:00",
      endTime: "10:00",
      purpose: "",
      department: "",
      attendees: 1,
      notes: "",
    },
  });

  // Re-sync defaults if props change while open
  React.useEffect(() => {
    if (open) {
      if (selectedResourceId) setValue("resourceId", selectedResourceId);
      if (selectedDate) setValue("date", selectedDate);
      setShowConflict(hasConflict);
    }
  }, [open, selectedResourceId, selectedDate, setValue, hasConflict]);

  const resourceId = watch("resourceId");
  const department = watch("department");

  const onSubmit = async (data: BookingFormValues) => {
    // For demo purposes, we will pretend a specific time causes a conflict
    if (data.startTime === "14:30" && !showConflict) {
      setShowConflict(true);
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800)); // Mock network
    onSave(data);
    setIsSubmitting(false);
    onOpenChange(false);
  };

  const departments = ["Engineering", "HR", "Marketing", "Finance", "Operations", "Executive"];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-[#111111] border-[#262626] text-white rounded-2xl shadow-lg p-0 max-h-[90vh] flex flex-col">
        <DialogHeader className="px-6 py-5 border-b border-[#262626]">
          <DialogTitle className="text-xl font-heading text-slate-100">
            Book Resource
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          
          {showConflict && <BookingConflictAlert />}

          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-slate-300">Resource <span className="text-red-500">*</span></Label>
              <Select value={resourceId} onValueChange={(val) => setValue("resourceId", val as string)}>
                <SelectTrigger className={`bg-[#090909] border-[#262626] text-slate-100 ${errors.resourceId ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Select resource" />
                </SelectTrigger>
                <SelectContent>
                  {resources.map(r => <SelectItem key={r.id} value={r.id}>{r.name} ({r.type})</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.resourceId && <p className="text-xs text-red-500">{errors.resourceId.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-slate-300">Date <span className="text-red-500">*</span></Label>
                <Input
                  id="date"
                  type="date"
                  className={`bg-[#090909] border-[#262626] text-slate-100 ${errors.date ? "border-red-500" : ""}`}
                  {...register("date")}
                />
                {errors.date && <p className="text-xs text-red-500">{errors.date.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="startTime" className="text-slate-300">Start Time <span className="text-red-500">*</span></Label>
                <Input
                  id="startTime"
                  type="time"
                  className={`bg-[#090909] border-[#262626] text-slate-100 ${errors.startTime ? "border-red-500" : ""}`}
                  {...register("startTime")}
                />
                {errors.startTime && <p className="text-xs text-red-500">{errors.startTime.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime" className="text-slate-300">End Time <span className="text-red-500">*</span></Label>
                <Input
                  id="endTime"
                  type="time"
                  className={`bg-[#090909] border-[#262626] text-slate-100 ${errors.endTime ? "border-red-500" : ""}`}
                  {...register("endTime")}
                />
                {errors.endTime && <p className="text-xs text-red-500">{errors.endTime.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Department <span className="text-red-500">*</span></Label>
                <Select value={department} onValueChange={(val) => setValue("department", val as string)}>
                  <SelectTrigger className={`bg-[#090909] border-[#262626] text-slate-100 ${errors.department ? "border-red-500" : ""}`}>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
                {errors.department && <p className="text-xs text-red-500">{errors.department.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="attendees" className="text-slate-300">Attendees <span className="text-red-500">*</span></Label>
                <Input
                  id="attendees"
                  type="number"
                  min="1"
                  className={`bg-[#090909] border-[#262626] text-slate-100 ${errors.attendees ? "border-red-500" : ""}`}
                  {...register("attendees")}
                />
                {errors.attendees && <p className="text-xs text-red-500">{errors.attendees.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="purpose" className="text-slate-300">Booking Purpose <span className="text-red-500">*</span></Label>
              <Input
                id="purpose"
                placeholder="e.g. Quarterly Planning Meeting"
                className={`bg-[#090909] border-[#262626] text-slate-100 ${errors.purpose ? "border-red-500" : ""}`}
                {...register("purpose")}
              />
              {errors.purpose && <p className="text-xs text-red-500">{errors.purpose.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-slate-300">Additional Notes (Optional)</Label>
              <textarea
                id="notes"
                rows={3}
                className="w-full bg-[#090909] border border-[#262626] rounded-lg p-3 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Any special requirements..."
                {...register("notes")}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-[#262626]">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="bg-transparent border-[#262626] text-slate-300 hover:bg-[#262626] hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[140px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Confirm Booking"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
