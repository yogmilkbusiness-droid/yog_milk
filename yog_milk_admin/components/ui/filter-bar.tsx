import * as React from "react";
import { cn } from "@/lib/utils";

export interface FilterTab {
  id: string;
  label: string;
  count?: number;
}

export interface FilterBarProps {
  tabs?: FilterTab[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  searchSlot?: React.ReactNode;
  actionsSlot?: React.ReactNode;
  className?: string;
}

export function FilterBar({
  tabs,
  activeTab,
  onTabChange,
  searchSlot,
  actionsSlot,
  className,
}: FilterBarProps) {
  return (
    <div
      className={cn(
        "flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-4 rounded-xl border border-dairy-subtle bg-white shadow-sm mb-6",
        className
      )}
    >
      {/* Left: Status Filter Tabs */}
      {tabs && tabs.length > 0 && (
        <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange?.(tab.id)}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors",
                  isActive
                    ? "bg-primary text-white shadow-sm"
                    : "text-muted-foreground hover:bg-dairy-surface-low hover:text-dairy-dark"
                )}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={cn(
                      "px-1.5 py-0.2 rounded-full text-[10px]",
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-dairy-surface-low text-muted-foreground"
                    )}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Right: Search and Action Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        {searchSlot}
        {actionsSlot}
      </div>
    </div>
  );
}

