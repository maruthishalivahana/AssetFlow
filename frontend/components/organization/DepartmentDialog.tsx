import React, { useEffect, useState } from "react";
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
import { Department } from "./mockData";

const departmentSchema = z.object({
  name: z.string().min(1, "Department name is required"),
  code: z.string().min(1, "Code is required"),
  headName: z.string().min(1, "Department Head is required"),
  parentDept: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(["Active", "Inactive"]),
});

type DepartmentFormValues = z.infer<typeof departmentSchema>;

interface DepartmentDialogProps {
  department?: Department | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: DepartmentFormValues) => void;
}

export function DepartmentDialog({
  department,
  open,
  onOpenChange,
  onSave,
}: DepartmentDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!department;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: "",
      code: "",
      headName: "",
      parentDept: "none",
      description: "",
      status: "Active",
    },
  });

  const parentDept = watch("parentDept");
  const status = watch("status");

  useEffect(() => {
    if (department && open) {
      reset({
        name: department.name,
        code: department.code,
        headName: department.headName,
        parentDept: department.parentDept || "none",
        description: department.description || "",
        status: department.status,
      });
    } else if (open && !department) {
      reset({
        name: "",
        code: "",
        headName: "",
        parentDept: "none",
        description: "",
        status: "Active",
      });
    }
  }, [department, open, reset]);

  const onSubmit = async (data: DepartmentFormValues) => {
    setIsSubmitting(true);
    // Mock network request
    await new Promise((resolve) => setTimeout(resolve, 800));
    onSave(data);
    setIsSubmitting(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border text-foreground rounded-2xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-heading text-slate-100">
            {isEditing ? "Edit Department" : "Add New Department"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-300">Department Name <span className="text-red-500">*</span></Label>
              <Input
                id="name"
                placeholder="e.g. Engineering"
                className={`bg-slate-900 border-border text-slate-100 placeholder:text-slate-500 ${errors.name ? "border-red-500" : ""}`}
                {...register("name")}
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="code" className="text-slate-300">Department Code <span className="text-red-500">*</span></Label>
              <Input
                id="code"
                placeholder="e.g. ENG-01"
                className={`bg-slate-900 border-border text-slate-100 placeholder:text-slate-500 ${errors.code ? "border-red-500" : ""}`}
                {...register("code")}
              />
              {errors.code && <p className="text-xs text-red-500">{errors.code.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="headName" className="text-slate-300">Department Head <span className="text-red-500">*</span></Label>
            <Input
              id="headName"
              placeholder="e.g. Aditi Rao"
              className={`bg-slate-900 border-border text-slate-100 placeholder:text-slate-500 ${errors.headName ? "border-red-500" : ""}`}
              {...register("headName")}
            />
            {errors.headName && <p className="text-xs text-red-500">{errors.headName.message}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Parent Department</Label>
            <Select value={parentDept} onValueChange={(val) => setValue("parentDept", val as string)}>
              <SelectTrigger className="bg-slate-900 border-border text-slate-100">
                <SelectValue placeholder="Select parent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None (Top Level)</SelectItem>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="Field Ops">Field Ops</SelectItem>
                <SelectItem value="HR">HR</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Status</Label>
            <Select value={status} onValueChange={(val) => setValue("status", val as any)}>
              <SelectTrigger className="bg-slate-900 border-border text-slate-100">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-slate-300">Description (Optional)</Label>
            <textarea
              id="description"
              rows={3}
              className="w-full bg-slate-900 border border-border rounded-lg p-3 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="Brief description of the department's role..."
              {...register("description")}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="bg-transparent border-border text-slate-300 hover:bg-slate-800 hover:text-white"
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
                  Saving...
                </>
              ) : isEditing ? (
                "Save Changes"
              ) : (
                "Create Department"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
