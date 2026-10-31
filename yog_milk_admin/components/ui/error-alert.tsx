import * as React from "react";
import { AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ErrorAlertProps {
  title?: string;
  message: string;
  onDismiss?: () => void;
  className?: string;
}

export function ErrorAlert({
  title = "Operational Attention Required",
  message,
  onDismiss,
  className,
}: ErrorAlertProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 rounded-xl border border-red-200 bg-red-50 text-red-900",
        className
      )}
    >
      <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
      <div className="flex-1 text-xs">
        {title && <p className="font-bold text-destructive mb-0.5">{title}</p>}
        <p className="text-red-800 leading-relaxed">{message}</p>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="text-red-600 hover:text-red-900 p-0.5 rounded transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

