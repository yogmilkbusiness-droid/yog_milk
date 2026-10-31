"use client";

import { useState, useEffect, useRef } from "react";
import {
  Clock,
  Search,
  CheckCircle2,
  AlertCircle,
  PauseCircle,
  Menu,
} from "lucide-react";
import { NotificationPanel } from "./NotificationPanel";
import { ProfileMenu } from "./ProfileMenu";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onToggleMobileSidebar?: () => void;
}

export function Header({ onToggleMobileSidebar }: HeaderProps) {
  const [time, setTime] = useState<string>("");
  const [isGateOpen, setIsGateOpen] = useState<boolean>(true);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  // Global ⌘K / Ctrl+K keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-dairy-subtle px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      {/* Left: Mobile Menu Toggle & Global Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        {/* Mobile Hamburger */}
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          aria-label="Open sidebar"
          className="lg:hidden p-2 rounded-xl text-dairy-dark hover:bg-dairy-surface-low border border-dairy-subtle"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Global Search Bar (with ⌘K shortcut) */}
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search by order code (YM-2026-...), retailer, phone, route..."
            className="w-full bg-dairy-surface-low border border-dairy-subtle rounded-xl pl-10 pr-12 py-2 text-xs font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all shadow-inner"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground bg-white rounded border border-dairy-subtle font-mono shadow-xs">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right Cluster: Operational Gate, Emergency Freeze, IST Clock, Notifications, Profile */}
      <div className="flex items-center gap-3 sm:gap-4 pl-3 shrink-0">
        {/* Operational Ordering Gate Chip (Rule 4.1) */}
        <div
          className={cn(
            "hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors shadow-xs text-xs font-medium",
            isGateOpen
              ? "bg-emerald-50 border-emerald-300 text-emerald-800"
              : "bg-rose-50 border-rose-300 text-rose-800"
          )}
        >
          <span className="relative flex h-2.5 w-2.5">
            <span
              className={cn(
                "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                isGateOpen ? "bg-emerald-500" : "bg-rose-500"
              )}
            />
            <span
              className={cn(
                "relative inline-flex rounded-full h-2.5 w-2.5",
                isGateOpen ? "bg-emerald-600" : "bg-rose-600"
              )}
            />
          </span>
          <span>
            {isGateOpen
              ? "Ordering Open · Closes 5:00 PM"
              : "Ordering Closed · Next 07:00 AM"}
          </span>
          <button
            type="button"
            onClick={() => setIsGateOpen(!isGateOpen)}
            className="ml-1 text-[10px] font-bold underline pl-1 border-l border-emerald-300/60 opacity-80 hover:opacity-100"
            title="Simulate Window Toggle for Testing"
          >
            {isGateOpen ? "Simulate Close" : "Simulate Open"}
          </button>
        </div>

        {/* Emergency Freeze Button (Stitch Pattern) */}
        <button
          type="button"
          onClick={() => setIsGateOpen(!isGateOpen)}
          className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50/60 text-rose-700 hover:bg-rose-100 transition-colors text-xs font-semibold shadow-xs"
        >
          <PauseCircle className="h-3.5 w-3.5" />
          <span>{isGateOpen ? "Emergency Freeze" : "Resume Ordering"}</span>
        </button>

        {/* IST Clock */}
        <div className="hidden 2xl:flex items-center gap-1.5 text-xs text-muted-foreground font-mono bg-dairy-surface-low px-2.5 py-1.5 rounded-xl border border-dairy-subtle">
          <Clock className="h-3.5 w-3.5 text-primary" />
          <span>{time || "05:00:00 PM"} IST</span>
        </div>

        <div className="h-5 w-px bg-dairy-subtle hidden sm:block" />

        {/* Operational Notifications Popover */}
        <NotificationPanel />

        <div className="h-5 w-px bg-dairy-subtle" />

        {/* Staff User Avatar & Dropdown Menu */}
        <ProfileMenu />
      </div>
    </header>
  );
}
