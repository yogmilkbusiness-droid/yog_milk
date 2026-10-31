import * as React from "react";
import { Check, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TimelineStep {
  title: string;
  description?: string;
  timestamp?: string;
  status: "completed" | "current" | "upcoming" | "error";
}

interface TimelineProps {
  steps: TimelineStep[];
  className?: string;
}

export function Timeline({ steps, className }: TimelineProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {steps.map((step, idx) => {
        const isCompleted = step.status === "completed";
        const isCurrent = step.status === "current";
        const isError = step.status === "error";
        const isLast = idx === steps.length - 1;

        return (
          <div key={idx} className="relative flex items-start gap-4">
            {/* Vertical connector line */}
            {!isLast && (
              <span
                className={cn(
                  "absolute left-3.5 top-8 -bottom-4 w-0.5",
                  isCompleted ? "bg-primary" : "bg-dairy-subtle"
                )}
                aria-hidden="true"
              />
            )}

            {/* Step Icon Indicator */}
            <div
              className={cn(
                "relative z-10 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all",
                isCompleted && "bg-primary text-white shadow-sm",
                isCurrent &&
                  "bg-secondary text-white ring-4 ring-secondary/20 shadow-sm",
                isError && "bg-destructive text-white ring-4 ring-destructive/20",
                step.status === "upcoming" &&
                  "bg-dairy-surface-low border border-dairy-subtle text-muted-foreground"
              )}
            >
              {isCompleted ? (
                <Check className="h-3.5 w-3.5 stroke-[3]" />
              ) : isCurrent ? (
                <Clock className="h-3.5 w-3.5 animate-pulse" />
              ) : (
                idx + 1
              )}
            </div>

            {/* Step Content */}
            <div className="flex-1 pt-0.5">
              <div className="flex items-center justify-between">
                <p
                  className={cn(
                    "text-xs font-bold",
                    isCurrent ? "text-secondary" : isCompleted ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {step.title}
                </p>
                {step.timestamp && (
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {step.timestamp}
                  </span>
                )}
              </div>
              {step.description && (
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {step.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

