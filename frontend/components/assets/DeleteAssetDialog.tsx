import React, { useState } from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Asset } from "./mockData";

interface DeleteAssetDialogProps {
  asset: Asset | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (assetId: string) => void;
}

export function DeleteAssetDialog({
  asset,
  open,
  onOpenChange,
  onConfirm,
}: DeleteAssetDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!asset) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    // Mock network request
    await new Promise((resolve) => setTimeout(resolve, 800));
    onConfirm(asset.id);
    setIsDeleting(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-[#111111] border-[#262626] text-white rounded-2xl shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="bg-red-500/10 p-2.5 rounded-full border border-red-500/20">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <DialogTitle className="text-xl font-heading text-slate-100">
                Delete Asset
              </DialogTitle>
              <DialogDescription className="text-slate-400 mt-1">
                This action cannot be undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <p className="text-slate-300">
            Are you sure you want to permanently delete{" "}
            <strong className="text-slate-100">{asset.name}</strong> ({asset.tag})?
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[#262626]">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-transparent border-[#262626] text-slate-300 hover:bg-[#262626] hover:text-white"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white min-w-[100px]"
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Delete"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
