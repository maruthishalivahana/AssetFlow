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
import { AssetCategory } from "./mockData";

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().min(1, "Description is required"),
  warrantyPeriod: z.string().min(1, "Warranty period is required"),
  maintenanceInterval: z.string().min(1, "Maintenance interval is required"),
  status: z.enum(["Active", "Inactive"]),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryDialogProps {
  category?: AssetCategory | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: CategoryFormValues) => void;
}

export function CategoryDialog({
  category,
  open,
  onOpenChange,
  onSave,
}: CategoryDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!category;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      warrantyPeriod: "",
      maintenanceInterval: "",
      status: "Active",
    },
  });

  const status = watch("status");
  const warrantyPeriod = watch("warrantyPeriod");
  const maintenanceInterval = watch("maintenanceInterval");

  useEffect(() => {
    if (category && open) {
      reset({
        name: category.name,
        description: category.description,
        warrantyPeriod: category.warrantyPeriod,
        maintenanceInterval: category.maintenanceInterval,
        status: category.status,
      });
    } else if (open && !category) {
      reset({
        name: "",
        description: "",
        warrantyPeriod: "1 Year",
        maintenanceInterval: "12 Months",
        status: "Active",
      });
    }
  }, [category, open, reset]);

  const onSubmit = async (data: CategoryFormValues) => {
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
            {isEditing ? "Edit Category" : "Add New Category"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-300">Category Name <span className="text-red-500">*</span></Label>
            <Input
              id="name"
              placeholder="e.g. Electronics"
              className={`bg-slate-900 border-border text-slate-100 placeholder:text-slate-500 ${errors.name ? "border-red-500" : ""}`}
              {...register("name")}
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-slate-300">Description <span className="text-red-500">*</span></Label>
            <textarea
              id="description"
              rows={3}
              className={`w-full bg-slate-900 border border-border rounded-lg p-3 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${errors.description ? "border-red-500" : ""}`}
              placeholder="Brief description of the category..."
              {...register("description")}
            />
            {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Default Warranty</Label>
              <Select value={warrantyPeriod} onValueChange={(val) => setValue("warrantyPeriod", val as string)}>
                <SelectTrigger className="bg-slate-900 border-border text-slate-100">
                  <SelectValue placeholder="Select warranty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="No Warranty">No Warranty</SelectItem>
                  <SelectItem value="6 Months">6 Months</SelectItem>
                  <SelectItem value="1 Year">1 Year</SelectItem>
                  <SelectItem value="2 Years">2 Years</SelectItem>
                  <SelectItem value="3 Years">3 Years</SelectItem>
                  <SelectItem value="5 Years">5 Years</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Maintenance Interval</Label>
              <Select value={maintenanceInterval} onValueChange={(val) => setValue("maintenanceInterval", val as string)}>
                <SelectTrigger className="bg-slate-900 border-border text-slate-100">
                  <SelectValue placeholder="Select interval" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="None">None</SelectItem>
                  <SelectItem value="1 Month">1 Month</SelectItem>
                  <SelectItem value="3 Months">3 Months</SelectItem>
                  <SelectItem value="6 Months">6 Months</SelectItem>
                  <SelectItem value="12 Months">12 Months</SelectItem>
                  <SelectItem value="24 Months">24 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
                "Create Category"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
