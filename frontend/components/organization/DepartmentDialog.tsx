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
import { Department } from "@/src/types/organization";
import { AuthUser } from "@/src/types/auth";

const departmentSchema = z.object({
  name: z.string().min(1, "Department name is required"),
  code: z.string().min(1, "Code is required"),
  parentDepartmentId: z.string().optional().nullable(),
  headUserId: z.string().optional().nullable(),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

type DepartmentFormValues = z.infer<typeof departmentSchema>;

interface DepartmentDialogProps {
  departments: Department[];
  users: AuthUser[];
  department?: Department | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: DepartmentFormValues) => void;
}

export function DepartmentDialog({
  departments,
  users,
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
      parentDepartmentId: "none",
      headUserId: "none",
      status: "ACTIVE",
    },
  });

  const parentDept = watch("parentDepartmentId");
  const headUser = watch("headUserId");
  const status = watch("status");

  useEffect(() => {
    if (department && open) {
      reset({
        name: department.name,
        code: department.code,
        parentDepartmentId: department.parentDepartmentId || "none",
        headUserId: department.headUserId || "none",
        status: department.status,
      });
    } else if (open && !department) {
      reset({
        name: "",
        code: "",
        parentDepartmentId: "none",
        headUserId: "none",
        status: "ACTIVE",
      });
    }
  }, [department, open, reset]);

  const onSubmit = async (data: DepartmentFormValues) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        parentDepartmentId: data.parentDepartmentId === "none" ? undefined : data.parentDepartmentId,
        headUserId: data.headUserId === "none" ? undefined : data.headUserId,
      };
      await onSave(payload);
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
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
            <Label className="text-slate-300">Parent Department</Label>
            <Select value={parentDept || "none"} onValueChange={(val) => setValue("parentDepartmentId", val as string)}>
              <SelectTrigger className="bg-slate-900 border-border text-slate-100">
                <SelectValue placeholder="Select parent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None (Top Level)</SelectItem>
                {departments
                  .filter((d) => d.id !== department?.id) // Prevent self as parent
                  .map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Department Head</Label>
            <Select value={headUser || "none"} onValueChange={(val) => setValue("headUserId", val as string)}>
              <SelectTrigger className="bg-slate-900 border-border text-slate-100">
                <SelectValue placeholder="Select head" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {users.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.firstName} {u.lastName}
                  </SelectItem>
                ))}
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
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
              </SelectContent>
            </Select>
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
