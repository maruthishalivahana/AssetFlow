import React from "react";
import { Asset } from "./mockData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AssetStatusBadge } from "./AssetStatusBadge";
import { AssetConditionBadge } from "./AssetConditionBadge";

interface AssetTableProps {
  assets: Asset[];
  onView: (asset: Asset) => void;
  onEdit: (asset: Asset) => void;
  onDelete: (asset: Asset) => void;
}

export function AssetTable({ assets, onView, onEdit, onDelete }: AssetTableProps) {
  return (
    <div className="rounded-2xl border border-[#262626] bg-[#111111] overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-[#090909]/50 border-b border-[#262626]">
            <TableRow className="border-[#262626] hover:bg-transparent">
              <TableHead className="w-[120px] font-medium text-slate-400 py-4 px-6">Asset Tag</TableHead>
              <TableHead className="font-medium text-slate-400 min-w-[200px]">Asset Name</TableHead>
              <TableHead className="font-medium text-slate-400">Category</TableHead>
              <TableHead className="font-medium text-slate-400">Serial Number</TableHead>
              <TableHead className="font-medium text-slate-400">Department</TableHead>
              <TableHead className="font-medium text-slate-400">Status</TableHead>
              <TableHead className="font-medium text-slate-400">Condition</TableHead>
              <TableHead className="text-right font-medium text-slate-400 px-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.map((asset) => (
              <TableRow
                key={asset.id}
                className="border-[#262626] hover:bg-[#262626]/40 transition-colors group"
              >
                <TableCell className="font-medium text-slate-300 py-4 px-6">
                  {asset.tag}
                </TableCell>
                <TableCell className="text-slate-100">
                  {asset.name}
                </TableCell>
                <TableCell className="text-slate-400 text-sm">
                  {asset.category}
                </TableCell>
                <TableCell className="text-slate-400 font-mono text-sm">
                  {asset.serialNumber}
                </TableCell>
                <TableCell className="text-slate-300">
                  {asset.department}
                </TableCell>
                <TableCell>
                  <AssetStatusBadge status={asset.status} />
                </TableCell>
                <TableCell>
                  <AssetConditionBadge condition={asset.condition} />
                </TableCell>
                <TableCell className="text-right px-6">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 bg-transparent border-[#262626] text-slate-400 hover:text-white hover:bg-[#262626] rounded-md"
                      title="View Details"
                      onClick={() => onView(asset)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 bg-transparent border-[#262626] text-slate-400 hover:text-white hover:bg-[#262626] rounded-md"
                      title="Edit Asset"
                      onClick={() => onEdit(asset)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 bg-transparent border-[#262626] text-slate-400 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/30 rounded-md"
                      title="Delete Asset"
                      onClick={() => onDelete(asset)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
