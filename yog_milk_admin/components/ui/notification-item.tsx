import * as React from "react";
import { AlertCircle, CheckCircle2, Clock, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NotificationItemProps {
  title: string;
  message: string;
  timestamp: string;
  severity?: "info" | "success" | "warning" | "error";
  read?: boolean;
  onMarkRead?: () => void;
  className?: string;
}

export function NotificationItem({
  title,
  message,
  timestamp,
  severity = "info",
  read = false,
  onMarkRead,
  className,
}: NotificationItemProps) {
  const iconConfig = {
    info: { icon: Info, color: "text-sky-600 bg-sky-50" },
    success: { icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50" },
    warning: { icon: Clock, color: "text-amber-600 bg-amber-50" },
    error: { icon: AlertCircle, color: "text-red-600 bg-red-50" },
  }[severity];

  const IconComponent = iconConfig.icon;

  return (
    <div
      onClick={onMarkRead}
      className={cn(
        "flex items-start gap-3 p-3.5 rounded-lg border transition-colors cursor-pointer",
        read
          ? "bg-white border-dairy-subtle/80 opacity-75"
          : "bg-dairy-surface-low/80 border-primary/20 shadow-sm",
        className
      )}
    >
      <div className={cn("p-2 rounded-full flex-shrink-0 mt-0.5", iconConfig.color)}>
        <IconComponent className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-bold text-dairy-dark truncate">{title}</p>
          <span className="text-[10px] text-muted-foreground whitespace-nowrap">
            {timestamp}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
          {message}
        </p>
      </div>
      {!read && (
        <span className="h-2 w-2 rounded-full bg-secondary flex-shrink-0 mt-2" />
      )}
    </div>
  );
}

