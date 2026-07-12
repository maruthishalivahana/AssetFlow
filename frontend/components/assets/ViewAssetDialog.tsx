import React from "react";
import { Asset } from "./mockData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AssetStatusBadge } from "./AssetStatusBadge";
import { AssetConditionBadge } from "./AssetConditionBadge";
import { QrCode, Calendar, MapPin, Building2, User, Clock, HardDrive, Tag, FileText, Download } from "lucide-react";

interface ViewAssetDialogProps {
  asset: Asset | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewAssetDialog({ asset, open, onOpenChange }: ViewAssetDialogProps) {
  if (!asset) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] bg-[#111111] border-[#262626] text-white rounded-2xl shadow-2xl overflow-hidden p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-[#262626]">
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-2xl font-heading font-semibold text-slate-50 flex items-center gap-3">
                {asset.name}
              </DialogTitle>
              <div className="flex items-center gap-3 mt-3">
                <AssetStatusBadge status={asset.status} />
                <AssetConditionBadge condition={asset.condition} />
                <span className="text-sm text-slate-400 bg-[#262626]/50 px-2.5 py-0.5 rounded-full border border-[#262626]">
                  {asset.category}
                </span>
              </div>
            </div>

            {/* Fake QR Code */}
            <div className="bg-white p-2 rounded-lg border border-[#262626]">
              <QrCode className="w-12 h-12 text-black" />
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 overflow-y-auto max-h-[70vh] custom-scrollbar">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2">Identification</h4>
              <div className="flex items-center gap-3 text-sm">
                <Tag className="w-4 h-4 text-slate-500" />
                <span className="text-slate-400 w-24">Asset Tag:</span>
                <span className="text-slate-100 font-medium font-mono">{asset.tag}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <HardDrive className="w-4 h-4 text-slate-500" />
                <span className="text-slate-400 w-24">Serial No:</span>
                <span className="text-slate-100 font-medium font-mono">{asset.serialNumber}</span>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2">Assignment</h4>
              <div className="flex items-center gap-3 text-sm">
                <Building2 className="w-4 h-4 text-slate-500" />
                <span className="text-slate-400 w-24">Department:</span>
                <span className="text-slate-100 font-medium">{asset.department}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <User className="w-4 h-4 text-slate-500" />
                <span className="text-slate-400 w-24">Assignee:</span>
                <span className="text-slate-100 font-medium">{asset.assignedEmployee || "Unassigned"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-slate-500" />
                <span className="text-slate-400 w-24">Location:</span>
                <span className="text-slate-100 font-medium">{asset.location}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pt-6 border-t border-[#262626]">
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2">Purchase Info</h4>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-slate-500" />
                <span className="text-slate-400 w-24">Purchased:</span>
                <span className="text-slate-100 font-medium">{asset.purchaseDate}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="w-4 h-4 flex items-center justify-center font-bold text-slate-500">$</span>
                <span className="text-slate-400 w-24">Cost:</span>
                <span className="text-slate-100 font-medium">${asset.purchaseCost.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock className="w-4 h-4 text-slate-500" />
                <span className="text-slate-400 w-24">Warranty:</span>
                <span className="text-slate-100 font-medium">{asset.warrantyExpiry}</span>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2">Additional</h4>
              <div className="flex flex-col gap-2 text-sm">
                <span className="text-slate-400">Description:</span>
                <span className="text-slate-200 leading-relaxed bg-[#090909] p-3 rounded-xl border border-[#262626]">
                  {asset.description || "No description provided."}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm mt-2">
                <span className="text-slate-400">Bookable Resource:</span>
                <span className="text-slate-100 font-medium">{asset.bookable ? "Yes" : "No"}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pt-6 border-t border-[#262626]">
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2">Purchase Info</h4>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-slate-500" />
                <span className="text-slate-400 w-24">Purchased:</span>
                <span className="text-slate-100 font-medium">{asset.purchaseDate}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="w-4 h-4 flex items-center justify-center font-bold text-slate-500">$</span>
                <span className="text-slate-400 w-24">Cost:</span>
                <span className="text-slate-100 font-medium">${asset.purchaseCost.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock className="w-4 h-4 text-slate-500" />
                <span className="text-slate-400 w-24">Warranty:</span>
                <span className="text-slate-100 font-medium">{asset.warrantyExpiry}</span>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2">Additional</h4>
              <div className="flex flex-col gap-2 text-sm">
                <span className="text-slate-400">Description:</span>
                <span className="text-slate-200 leading-relaxed bg-[#090909] p-3 rounded-xl border border-[#262626]">
                  {asset.description || "No description provided."}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm mt-2">
                <span className="text-slate-400">Bookable Resource:</span>
                <span className="text-slate-100 font-medium">{asset.bookable ? "Yes" : "No"}</span>
              </div>
            </div>
          </div>

          <div className="px-6 pb-6">
            {/* Note: asset.files should be returned by the API (array of { id, fileName, filePath, mimeType }) */}
            {(asset as any).files && (asset as any).files.length > 0 && (
              <div>
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">Files & Documents</h4>
                  <div className="space-y-2">
                    {(asset as any).files.map((f: any) => (
                      <div key={f.id} className="flex items-center justify-between gap-3 bg-[#090909] border border-[#262626] rounded-md p-3">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-slate-400" />
                          <div>
                            <div className="text-sm text-slate-100">{f.fileName}</div>
                            <div className="text-xs text-slate-500">{f.mimeType || 'file'}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              const downloadUrl = f.filePath ? `/uploads/${encodeURIComponent(f.filePath)}` : '#';
                              window.open(downloadUrl, '_blank');
                            }}
                          >
                            <button className="inline-flex items-center gap-2 bg-transparent border border-[#262626] text-slate-200 px-3 py-1 rounded-md">
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </button>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
