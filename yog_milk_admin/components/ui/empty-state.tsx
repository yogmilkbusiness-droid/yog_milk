import * as React from "react";
import { LucideIcon, PackageOpen } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon = PackageOpen,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-dairy-subtle bg-white/60",
        className
      )}
    >
      <div className="h-12 w-12 rounded-full bg-dairy-surface-low flex items-center justify-center text-primary mb-3">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="font-serif text-base font-bold text-dairy-dark">{title}</h3>
      <p className="text-xs text-muted-foreground mt-1 max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <Button size="sm" onClick={onAction} className="mt-4">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

