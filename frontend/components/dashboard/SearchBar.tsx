"use client";

import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function SearchBar() {
  return (
    <div className="relative w-full max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
        <Search className="h-4 w-4" />
      </div>
      <Input
        type="search"
        placeholder="Search assets, bookings..."
        className="pl-10 rounded-full bg-input/40 border-border h-10 w-full focus-visible:bg-input focus-visible:ring-primary/20 text-sm placeholder:text-muted-foreground"
      />
    </div>
  );
}
