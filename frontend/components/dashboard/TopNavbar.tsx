"use client";

import React from "react";
import { SearchBar } from "./SearchBar";
import { Bell, Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./Sidebar";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch } from "../../src/store/hooks";
import { performLogout } from "../../src/store/actions/authActions";
import { toast } from "react-hot-toast";

interface TopNavbarProps {
  onMenuClick?: () => void;
}

export function TopNavbar({ onMenuClick }: TopNavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(performLogout());
    toast.success("Logged out successfully.");
    router.replace("/signin");
  };

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-6 h-[72px] bg-background border-b border-border w-full shrink-0">
      <div className="flex items-center gap-4 flex-1">
        {/* Mobile menu trigger */}
        <Sheet>
          <SheetTrigger
            render={
              <button
                type="button"
                className="md:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            }
          >
            <Menu className="w-5 h-5" />
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[280px] border-border bg-background">
            <Sidebar isCollapsed={false} onToggle={() => { }} className="w-full border-none h-full" />
          </SheetContent>
        </Sheet>

        {/* Search */}
        <div className="hidden md:block flex-1 max-w-md">
          <SearchBar />
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Notifications */}
        <button className="relative text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border border-background animate-pulse" />
        </button>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-3 outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full md:rounded-md p-1 md:p-1.5 md:-mr-1.5 hover:bg-muted/50 transition-colors">
            <Avatar className="w-8 h-8 border border-border">
              <AvatarImage src="https://i.pravatar.cc/150?u=maruthi" alt="Maruthi R." />
              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">MR</AvatarFallback>
            </Avatar>
            <span className="hidden md:inline-flex text-sm font-medium">Maruthi R.</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-popover border-border">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem className="cursor-pointer focus:bg-muted focus:text-foreground">Profile</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer focus:bg-muted focus:text-foreground">Settings</DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer focus:bg-muted focus:text-foreground text-destructive focus:text-destructive">Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
