import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground border border-dairy-subtle",

        // Domain-specific status variants
        placed: "bg-status-placed-bg text-status-placed-text border border-sky-200",
        confirmed: "bg-status-confirmed-bg text-status-confirmed-text border border-indigo-200",
        processing: "bg-status-processing-bg text-status-processing-text border border-amber-200",
        ready: "bg-status-ready-bg text-status-ready-text border border-fuchsia-200",
        outForDelivery: "bg-status-out-bg text-status-out-text border border-purple-200",
        delivered: "bg-status-delivered-bg text-status-delivered-text border border-green-200",
        cancelled: "bg-status-cancelled-bg text-status-cancelled-text border border-red-200",
        pending: "bg-status-pending-bg text-status-pending-text border border-amber-200",
        paid: "bg-status-paid-bg text-status-paid-text border border-emerald-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  showDot?: boolean;
}

function Badge({ className, variant, showDot = true, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {showDot && (
        <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
      )}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };

