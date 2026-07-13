import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AuthUser } from "@/src/types/auth";
import { Department } from "@/src/types/organization";

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().optional(),
  phone: z.string().optional(),
  employeeCode: z.string().optional(),
  jobTitle: z.string().optional(),
  departmentId: z.string().optional(),
  role: z.string().optional(),
  status: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface EmployeeFormDialogProps {
  employee: AuthUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: FormData) => void;
  departments: Department[];
}

export function EmployeeFormDialog({
  employee,
  open,
  onOpenChange,
  onSave,
  departments,
}: EmployeeFormDialogProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
      employeeCode: "",
      jobTitle: "",
      departmentId: "none",
      role: "EMPLOYEE",
      status: "ACTIVE",
    },
  });

  useEffect(() => {
    if (open) {
      if (employee) {
        reset({
          firstName: employee.firstName,
          lastName: employee.lastName,
          email: employee.email,
          phone: employee.phone || "",
          employeeCode: employee.employeeCode || "",
          jobTitle: employee.jobTitle || "",
          departmentId: employee.department?.id || "none",
          role: employee.role || "EMPLOYEE",
          status: employee.status || "ACTIVE",
        });
      } else {
        reset({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          phone: "",
          employeeCode: "",
          jobTitle: "",
          departmentId: "none",
          role: "EMPLOYEE",
          status: "ACTIVE",
        });
      }
    }
  }, [open, employee, reset]);

  const departmentId = watch("departmentId");
  const role = watch("role");
  const status = watch("status");

  const onSubmit = (data: FormData) => {
    const payload = {
      ...data,
      departmentId: data.departmentId === "none" ? undefined : data.departmentId,
      password: data.password || undefined,
    };
    onSave(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border text-foreground rounded-2xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-heading text-slate-100">
            {employee ? "Edit Employee" : "Add New Employee"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">First Name *</Label>
              <Input
                {...register("firstName")}
                className="bg-slate-900 border-border"
                placeholder="John"
              />
              {errors.firstName && (
                <p className="text-xs text-red-500">{errors.firstName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Last Name *</Label>
              <Input
                {...register("lastName")}
                className="bg-slate-900 border-border"
                placeholder="Doe"
              />
              {errors.lastName && (
                <p className="text-xs text-red-500">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Email *</Label>
            <Input
              {...register("email")}
              type="email"
              className="bg-slate-900 border-border"
              placeholder="john.doe@example.com"
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          {!employee && (
            <div className="space-y-2">
              <Label className="text-slate-300">Password (optional)</Label>
              <Input
                {...register("password")}
                type="password"
                className="bg-slate-900 border-border"
                placeholder="Leave blank for default"
              />
              {errors.password && (
                <p className="text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Phone</Label>
              <Input
                {...register("phone")}
                className="bg-slate-900 border-border"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Employee Code</Label>
              <Input
                {...register("employeeCode")}
                className="bg-slate-900 border-border"
                placeholder="EMP-001"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Job Title</Label>
              <Input
                {...register("jobTitle")}
                className="bg-slate-900 border-border"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Department</Label>
              <Select
                value={departmentId || "none"}
                onValueChange={(val) => setValue("departmentId", val || undefined)}
              >
                <SelectTrigger className="bg-slate-900 border-border">
                  <SelectValue placeholder="Select dept" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {departments.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Role</Label>
              <Select
                value={role || "EMPLOYEE"}
                onValueChange={(val) => setValue("role", val || undefined)}
              >
                <SelectTrigger className="bg-slate-900 border-border">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EMPLOYEE">Employee</SelectItem>
                  <SelectItem value="DEPARTMENT_HEAD">Department Head</SelectItem>
                  <SelectItem value="ASSET_MANAGER">Asset Manager</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {employee && (
              <div className="space-y-2">
                <Label className="text-slate-300">Status</Label>
                <Select
                  value={status || "ACTIVE"}
                  onValueChange={(val) => setValue("status", val || undefined)}
                >
                  <SelectTrigger className="bg-slate-900 border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="bg-slate-800 border-border hover:bg-slate-700 text-slate-300"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
              {employee ? "Update" : "Add"} Employee
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
