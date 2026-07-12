import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AssetPaginationProps {
  currentShowing: number;
  totalAssets: number;
}

export function AssetPagination({ currentShowing, totalAssets }: AssetPaginationProps) {
  return (
    <div className="flex items-center justify-between mt-4">
      <div className="text-sm text-slate-400">
        Showing {currentShowing} of {totalAssets} assets
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="icon" 
          disabled 
          className="h-8 w-8 bg-[#090909] border-[#262626] text-slate-400 hover:bg-[#111111]"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8 bg-[#090909] border-[#262626] text-slate-200 hover:bg-[#111111] hover:text-white"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
