"use client";

import React, { useState, useMemo } from "react";
import { AssetHeader } from "./AssetHeader";
import { AssetToolbar } from "./AssetToolbar";
import { AssetTable } from "./AssetTable";
import { AssetPagination } from "./AssetPagination";
import { EmptyAssets } from "./EmptyAssets";

import { ViewAssetDialog } from "./ViewAssetDialog";
import { RegisterAssetDialog } from "./RegisterAssetDialog";
import { DeleteAssetDialog } from "./DeleteAssetDialog";

import { Asset, mockAssets } from "./mockData";

export function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>(mockAssets);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [conditionFilter, setConditionFilter] = useState("all");

  // Modals State
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Derived Options for Dropdowns
  const departments = useMemo(() => Array.from(new Set(mockAssets.map(a => a.department))), []);
  const locations = useMemo(() => Array.from(new Set(mockAssets.map(a => a.location))), []);

  // Filter Logic
  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const q = searchQuery.toLowerCase();
      const matchSearch = 
        asset.name.toLowerCase().includes(q) || 
        asset.tag.toLowerCase().includes(q) || 
        asset.serialNumber.toLowerCase().includes(q);

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
    if (selectedAsset) {
      // Edit
      setAssets(assets.map(a => a.id === selectedAsset.id ? { ...a, ...data } : a));
    } else {
      // Create
      const newAsset: Asset = {
        ...data,
        id: `a${Date.now()}`,
        tag: `AF-${Math.floor(1000 + Math.random() * 9000)}`,
      };
      setAssets([newAsset, ...assets]);
    }
  };

  const handleDeleteAsset = (id: string) => {
    setAssets(assets.filter(a => a.id !== id));
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
            assets={filteredAssets}
            onView={(asset) => { setSelectedAsset(asset); setIsViewOpen(true); }}
            onEdit={(asset) => { setSelectedAsset(asset); setIsRegisterOpen(true); }}
            onDelete={(asset) => { setSelectedAsset(asset); setIsDeleteOpen(true); }}
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
        asset={selectedAsset}
      />
      <RegisterAssetDialog
        open={isRegisterOpen}
        onOpenChange={setIsRegisterOpen}
        asset={selectedAsset}
        onSave={handleSaveAsset}
        departments={departments}
        locations={locations}
      />
      <DeleteAssetDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        asset={selectedAsset}
        onConfirm={handleDeleteAsset}
      />
    </div>
  );
}
