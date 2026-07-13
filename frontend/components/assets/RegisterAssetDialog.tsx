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
import { Checkbox } from "@/components/ui/checkbox";
import { Asset, AssetCategory, AssetStatus, AssetCondition } from "./mockData";
import { assetConditionOptions, getRelationId, normalizeAssetCondition } from "./assetDisplay";

const assetSchema = z.object({
  name: z.string().min(1, "Asset Name is required"),
  category: z.string().min(1, "Category is required"),
  serialNumber: z.string().min(1, "Serial Number is required"),
  department: z.string().min(1, "Department is required"),
  location: z.string().min(1, "Location is required"),
  condition: z.string().min(1, "Condition is required"),
  status: z.string().min(1, "Status is required"),
  purchaseDate: z.string().min(1, "Purchase Date is required"),
  purchaseCost: z.coerce.number().min(0, "Cost must be a positive number"),
  warrantyExpiry: z.string().min(1, "Warranty Expiry is required"),
  assignedEmployee: z.string().optional(),
  description: z.string().optional(),
  bookable: z.boolean().default(false),
});

type AssetFormValues = z.infer<typeof assetSchema>;

interface RegisterAssetDialogProps {
  asset?: Asset | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: any) => void;

  // Data for selects
  departments: { id: string; name: string }[];
}

export function RegisterAssetDialog({
  asset,
  open,
  onOpenChange,
  onSave,
  departments,
}: RegisterAssetDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!asset;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AssetFormValues>({
    resolver: zodResolver(assetSchema) as any,
    defaultValues: {
      name: "",
      category: "",
      serialNumber: "",
      department: "",
      location: "",
      condition: "NEW",
      status: "Available",
      purchaseDate: new Date().toISOString().split("T")[0],
      purchaseCost: 0,
      warrantyExpiry: "",
      assignedEmployee: "",
      description: "",
      bookable: false,
    },
  });

  const category = watch("category");
  const department = watch("department");
  const location = watch("location");
  const condition = watch("condition");
  const status = watch("status");
  const bookable = watch("bookable");

  useEffect(() => {
    if (asset && open) {
      reset({
        name: asset.name,
        category: getRelationId((asset as any).category || (asset as any).assetCategory),
        serialNumber: asset.serialNumber,
        department: getRelationId((asset as any).department),
        location: getRelationId((asset as any).location),
        condition: normalizeAssetCondition(typeof asset.condition === "string" ? asset.condition : "NEW"),
        status: asset.status,
        purchaseDate: asset.purchaseDate,
        purchaseCost: asset.purchaseCost,
        warrantyExpiry: asset.warrantyExpiry,
        assignedEmployee: asset.assignedEmployee || "",
        description: asset.description || "",
        bookable: asset.bookable,
      });
    } else if (open && !asset) {
      reset({
        name: "",
        category: "",
        serialNumber: "",
        department: "",
        location: "",
        condition: "NEW",
        status: "Available",
        purchaseDate: new Date().toISOString().split("T")[0],
        purchaseCost: 0,
        warrantyExpiry: "",
        assignedEmployee: "",
        description: "",
        bookable: false,
      });
    }
  }, [asset, open, reset]);

  const onSubmit = async (data: AssetFormValues) => {
    setIsSubmitting(true);
    try {
      await onSave(data);
      onOpenChange(false);
    } catch (err) {
      console.error('Failed to save asset', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const [remoteCategories, setRemoteCategories] = useState<{ id: string; name: string }[]>([]);
  const [remoteDepartments, setRemoteDepartments] = useState<{ id: string; name: string }[]>([]);
  const categories: AssetCategory[] = ["Electronics", "Furniture", "Vehicles", "Network", "IT Equipment", "AV Equipment"];
  const statuses: AssetStatus[] = ["Available", "Allocated", "Maintenance", "Reserved", "Lost", "Disposed", "Retired"];
  const conditions = assetConditionOptions;

  useEffect(() => {
    // fetch remote lists once when dialog opens
    if (!open) return;
    let mounted = true;
    (async () => {
      try {
        const { organizationService } = await import("@/src/services/organization.service");
        const cats = await organizationService.getCategories({ limit: 100 });
        const depts = await organizationService.getDepartments({ limit: 100 });
        if (!mounted) return;
        setRemoteCategories(cats.categories || (cats as any));
        setRemoteDepartments(depts.departments || (depts as any));
      } catch (err) {
        console.warn('Failed to load organization lists', err);
      }
    })();
    return () => { mounted = false; };
  }, [open]);

  const departmentOptions = remoteDepartments.length > 0 ? remoteDepartments : departments;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] bg-[#111111] border-[#262626] text-white rounded-2xl shadow-lg p-0 max-h-[90vh] flex flex-col">
        <DialogHeader className="px-6 py-5 border-b border-[#262626]">
          <DialogTitle className="text-xl font-heading text-slate-100">
            {isEditing ? "Edit Asset" : "Register New Asset"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-300">Asset Name <span className="text-red-500">*</span></Label>
              <Input
                id="name"
                placeholder="e.g. MacBook Pro 16"
                className={`bg-[#090909] border-[#262626] text-slate-100 placeholder:text-slate-500 ${errors.name ? "border-red-500" : ""}`}
                {...register("name")}
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Category <span className="text-red-500">*</span></Label>
              <Select value={category} onValueChange={(val) => setValue("category", val as string)}>
                <SelectTrigger className={`bg-[#090909] border-[#262626] text-slate-100 ${errors.category ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {remoteCategories.length > 0 ? (
                    remoteCategories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)
                  ) : (
                    categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)
                  )}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-xs text-red-500">{errors.category.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="serialNumber" className="text-slate-300">Serial Number <span className="text-red-500">*</span></Label>
              <Input
                id="serialNumber"
                placeholder="e.g. SN-12345"
                className={`bg-[#090909] border-[#262626] text-slate-100 placeholder:text-slate-500 ${errors.serialNumber ? "border-red-500" : ""}`}
                {...register("serialNumber")}
              />
              {errors.serialNumber && <p className="text-xs text-red-500">{errors.serialNumber.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Department <span className="text-red-500">*</span></Label>
              <Select value={department} onValueChange={(val) => setValue("department", val as string)}>
                <SelectTrigger className={`bg-[#090909] border-[#262626] text-slate-100 ${errors.department ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departmentOptions.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.department && <p className="text-xs text-red-500">{errors.department.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-slate-300">Location <span className="text-red-500">*</span></Label>
              <Input
                id="location"
                placeholder="e.g. HQ Floor 3"
                className={`bg-[#090909] border-[#262626] text-slate-100 placeholder:text-slate-500 ${errors.location ? "border-red-500" : ""}`}
                {...register("location")}
              />
              {errors.location && <p className="text-xs text-red-500">{errors.location.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Condition <span className="text-red-500">*</span></Label>
              <Select value={condition} onValueChange={(val) => setValue("condition", val as string)}>
                <SelectTrigger className={`bg-[#090909] border-[#262626] text-slate-100 ${errors.condition ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  {conditions.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.condition && <p className="text-xs text-red-500">{errors.condition.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Status <span className="text-red-500">*</span></Label>
              <Select value={status} onValueChange={(val) => setValue("status", val as string)}>
                <SelectTrigger className={`bg-[#090909] border-[#262626] text-slate-100 ${errors.status ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.status && <p className="text-xs text-red-500">{errors.status.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignedEmployee" className="text-slate-300">Assignee (Optional)</Label>
              <Input
                id="assignedEmployee"
                placeholder="e.g. John Doe"
                className="bg-[#090909] border-[#262626] text-slate-100 placeholder:text-slate-500"
                {...register("assignedEmployee")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="purchaseDate" className="text-slate-300">Purchase Date <span className="text-red-500">*</span></Label>
              <Input
                id="purchaseDate"
                type="date"
                className={`bg-[#090909] border-[#262626] text-slate-100 ${errors.purchaseDate ? "border-red-500" : ""}`}
                {...register("purchaseDate")}
              />
              {errors.purchaseDate && <p className="text-xs text-red-500">{errors.purchaseDate.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="warrantyExpiry" className="text-slate-300">Warranty Expiry <span className="text-red-500">*</span></Label>
              <Input
                id="warrantyExpiry"
                type="date"
                className={`bg-[#090909] border-[#262626] text-slate-100 ${errors.warrantyExpiry ? "border-red-500" : ""}`}
                {...register("warrantyExpiry")}
              />
              {errors.warrantyExpiry && <p className="text-xs text-red-500">{errors.warrantyExpiry.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="purchaseCost" className="text-slate-300">Purchase Cost ($) <span className="text-red-500">*</span></Label>
              <Input
                id="purchaseCost"
                type="number"
                step="0.01"
                className={`bg-[#090909] border-[#262626] text-slate-100 placeholder:text-slate-500 ${errors.purchaseCost ? "border-red-500" : ""}`}
                {...register("purchaseCost")}
              />
              {errors.purchaseCost && <p className="text-xs text-red-500">{errors.purchaseCost.message}</p>}
            </div>

            <div className="space-y-2 flex flex-col justify-end">
              <div className="flex items-center space-x-2 bg-[#090909] border border-[#262626] p-3 rounded-md h-10">
                <Checkbox
                  id="bookable"
                  checked={bookable}
                  onCheckedChange={(checked) => setValue("bookable", checked as boolean)}
                  className="border-[#262626] data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                />
                <label
                  htmlFor="bookable"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-200"
                >
                  Bookable Resource
                </label>
              </div>
            </div>

          </div>

          <div className="space-y-2 mt-4">
            <Label htmlFor="description" className="text-slate-300">Description (Optional)</Label>
            <textarea
              id="description"
              rows={3}
              className="w-full bg-[#090909] border border-[#262626] rounded-lg p-3 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="Additional details about the asset..."
              {...register("description")}
            />
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-[#262626]">
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
                  Saving...
                </>
              ) : isEditing ? (
                "Save Changes"
              ) : (
                "Register Asset"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
