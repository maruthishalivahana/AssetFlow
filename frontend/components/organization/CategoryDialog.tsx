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
import { AssetCategory } from "@/src/types/organization";

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  code: z.string().min(1, "Code is required"),
  description: z.string().optional(),
  parentCategoryId: z.string().optional().nullable(),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryDialogProps {
  categories: AssetCategory[];
  category?: AssetCategory | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: CategoryFormValues) => void;
}

export function CategoryDialog({
  categories,
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
      code: "",
      description: "",
      parentCategoryId: "none",
      status: "ACTIVE",
    },
  });

  const status = watch("status");
  const parentCategoryId = watch("parentCategoryId");

  useEffect(() => {
    if (category && open) {
      reset({
        name: category.name,
        code: category.code,
        description: category.description || "",
        parentCategoryId: category.parentCategoryId || "none",
        status: category.status,
      });
    } else if (open && !category) {
      reset({
        name: "",
        code: "",
        description: "",
        parentCategoryId: "none",
        status: "ACTIVE",
      });
    }
  }, [category, open, reset]);

  const onSubmit = async (data: CategoryFormValues) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        parentCategoryId: data.parentCategoryId === "none" ? undefined : data.parentCategoryId,
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
            {isEditing ? "Edit Category" : "Add New Category"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-4">
          <div className="grid grid-cols-2 gap-4">
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
              <Label htmlFor="code" className="text-slate-300">Category Code <span className="text-red-500">*</span></Label>
              <Input
                id="code"
                placeholder="e.g. CAT-01"
                className={`bg-slate-900 border-border text-slate-100 placeholder:text-slate-500 ${errors.code ? "border-red-500" : ""}`}
                {...register("code")}
              />
              {errors.code && <p className="text-xs text-red-500">{errors.code.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Parent Category</Label>
            <Select value={parentCategoryId || "none"} onValueChange={(val) => setValue("parentCategoryId", val as string)}>
              <SelectTrigger className="bg-slate-900 border-border text-slate-100">
                <SelectValue placeholder="Select parent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None (Top Level)</SelectItem>
                {categories
                  .filter((c) => c.id !== category?.id)
                  .map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
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

          <div className="space-y-2">
            <Label htmlFor="description" className="text-slate-300">Description (Optional)</Label>
            <textarea
              id="description"
              rows={3}
              className={`w-full bg-slate-900 border border-border rounded-lg p-3 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${errors.description ? "border-red-500" : ""}`}
              placeholder="Brief description of the category..."
              {...register("description")}
            />
            {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
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
