import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AssetCategory } from "./mockData";
import { StatusBadge } from "./StatusBadge";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CategoryTableProps {
  categories: AssetCategory[];
  onView: (category: AssetCategory) => void;
  onEdit: (category: AssetCategory) => void;
  onDelete: (category: AssetCategory) => void;
}

export function CategoryTable({
  categories,
  onView,
  onEdit,
  onDelete,
}: CategoryTableProps) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-900/50">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="w-[200px] font-medium text-slate-400">Category</TableHead>
              <TableHead className="font-medium text-slate-400">Description</TableHead>
              <TableHead className="font-medium text-slate-400">Warranty / Maint.</TableHead>
              <TableHead className="font-medium text-slate-400">Assets</TableHead>
              <TableHead className="font-medium text-slate-400">Status</TableHead>
              <TableHead className="text-right font-medium text-slate-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No categories found.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow
                  key={category.id}
                  className="border-border hover:bg-slate-800/30 transition-colors group"
                >
                  <TableCell className="font-medium text-slate-200">
                    {category.name}
                  </TableCell>
                  <TableCell className="text-slate-400 text-sm max-w-[200px] truncate">
                    {category.description}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs text-slate-300">{category.warrantyPeriod}</span>
                      <span className="text-xs text-slate-500">{category.maintenanceInterval}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center justify-center px-2 py-1 rounded-md bg-slate-800 text-xs font-medium text-slate-300">
                      {category.assetsCount}
                    </span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={category.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800"
                        onClick={() => onView(category)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800"
                        onClick={() => onEdit(category)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                        onClick={() => onDelete(category)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
