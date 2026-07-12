"use client";

import React, { useState, useMemo, useEffect } from "react";
import { AssetHeader } from "./AssetHeader";
import { AssetToolbar } from "./AssetToolbar";
import { AssetTable } from "./AssetTable";
import { AssetPagination } from "./AssetPagination";
import { EmptyAssets } from "./EmptyAssets";

import { ViewAssetDialog } from "./ViewAssetDialog";
import { RegisterAssetDialog } from "./RegisterAssetDialog";
import { DeleteAssetDialog } from "./DeleteAssetDialog";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { fetchAssets, createAsset as createAssetAction, updateAsset as updateAssetAction, removeAsset as removeAssetAction, fetchAsset } from "@/src/store/slices/assetSlice";
import type { Asset as AssetType } from "@/src/store/slices/assetSlice";

export function AssetsPage() {
  const dispatch = useAppDispatch();
  const { items: assets, loading } = useAppSelector((s) => s.assets);

  useEffect(() => {
    dispatch(fetchAssets({ page: 1, limit: 50 }));
  }, [dispatch]);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [conditionFilter, setConditionFilter] = useState("all");

  // Modals State
  const [selectedAsset, setSelectedAsset] = useState<AssetType | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Derived Options for Dropdowns
  const departments = useMemo(() => Array.from(new Set(assets.map((a: any) => a.department || a.department?.name || 'Unassigned'))), [assets]);
  const locations = useMemo(() => Array.from(new Set(assets.map((a: any) => a.location || 'Unknown'))), [assets]);

  // Filter Logic
  const filteredAssets = useMemo(() => {
    return assets.filter((asset: any) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        (asset.name || '').toLowerCase().includes(q) ||
        (asset.assetTag || asset.tag || '').toLowerCase().includes(q) ||
        (asset.serialNumber || '').toLowerCase().includes(q);

      const matchCat = categoryFilter === "all" || asset.category === categoryFilter;
      const matchStat = statusFilter === "all" || asset.status === statusFilter;
      const matchDept = departmentFilter === "all" || asset.department === departmentFilter;
      const matchLoc = locationFilter === "all" || asset.location === locationFilter;
      const matchCond = conditionFilter === "all" || asset.condition === conditionFilter;

      return matchSearch && matchCat && matchStat && matchDept && matchLoc && matchCond;
    });
  }, [assets, searchQuery, categoryFilter, statusFilter, departmentFilter, locationFilter, conditionFilter]);

  // Handlers
  const handleRegisterClick = () => {
    setSelectedAsset(null);
    setIsRegisterOpen(true);
  };

  const handleSaveAsset = (data: any) => {
    const payload = {
      name: data.name,
      assetCategoryId: data.category,
      departmentId: data.department,
      serialNumber: data.serialNumber,
      description: data.description,
      purchaseDate: data.purchaseDate,
      purchaseCost: Number(data.purchaseCost || 0),
      isBookable: Boolean(data.bookable),
      condition: data.condition?.toUpperCase?.() || undefined,
    };

    if (selectedAsset) {
      dispatch(updateAssetAction({ id: selectedAsset.id, payload, files: undefined }));
    } else {
      dispatch(createAssetAction({ payload, files: undefined }));
    }
  };

  const handleDeleteAsset = (id: string) => {
    dispatch(removeAssetAction(id));
  };

  return (
    <div className="w-full h-full max-w-7xl mx-auto flex flex-col pt-6 pb-12 px-4 sm:px-6 lg:px-8">
      <AssetHeader onRegisterClick={handleRegisterClick} />

      <AssetToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        departmentFilter={departmentFilter}
        onDepartmentChange={setDepartmentFilter}
        locationFilter={locationFilter}
        onLocationChange={setLocationFilter}
        conditionFilter={conditionFilter}
        onConditionChange={setConditionFilter}
        departments={departments}
        locations={locations}
      />

      {filteredAssets.length === 0 ? (
        <EmptyAssets onRegisterClick={handleRegisterClick} />
      ) : (
        <div className="flex flex-col gap-2">
          <AssetTable
            assets={filteredAssets as any}
            onView={(asset: any) => { setSelectedAsset(asset); setIsViewOpen(true); }}
            onEdit={(asset: any) => { setSelectedAsset(asset); setIsRegisterOpen(true); }}
            onDelete={(asset: any) => { setSelectedAsset(asset); setIsDeleteOpen(true); }}
          />
          <AssetPagination
            currentShowing={filteredAssets.length}
            totalAssets={assets.length}
          />
        </div>
      )}

      {/* Modals */}
      <ViewAssetDialog
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        asset={selectedAsset as any}
      />
      <RegisterAssetDialog
        open={isRegisterOpen}
        onOpenChange={setIsRegisterOpen}
        asset={selectedAsset as any}
        onSave={handleSaveAsset}
        departments={departments}
        locations={locations}
      />
      <DeleteAssetDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        asset={selectedAsset as any}
        onConfirm={handleDeleteAsset}
      />
    </div>
  );
}
