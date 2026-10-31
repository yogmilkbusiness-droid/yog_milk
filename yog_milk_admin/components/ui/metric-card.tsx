import * as React from "react";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardDescription } from "./card";
import { cn } from "@/lib/utils";

export interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number; // e.g. 12.5 (represents +12.5%)
    label?: string; // e.g. "vs yesterday"
  };
  variant?: "default" | "secondary" | "warning" | "success";
  className?: string;
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = "default",
  className,
}: MetricCardProps) {
  const isPositive = trend && trend.value > 0;
  const isNegative = trend && trend.value < 0;

  const iconBg = {
    default: "bg-dairy-surface-low text-primary",
    secondary: "bg-secondary/10 text-secondary",
    warning: "bg-amber-50 text-amber-700",
    success: "bg-emerald-50 text-emerald-700",
  }[variant];

  return (
    <Card className={cn("hover:shadow-md transition-shadow", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardDescription className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </CardDescription>
        {icon && (
          <div className={cn("p-2 rounded-lg flex-shrink-0", iconBg)}>
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="font-serif text-2xl font-bold tracking-tight text-primary">
          {value}
        </div>
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          {trend && (
            <div
              className={cn(
                "inline-flex items-center text-xs font-semibold",
                isPositive && "text-emerald-700",
                isNegative && "text-destructive",
                !isPositive && !isNegative && "text-muted-foreground"
              )}
            >
              {isPositive && <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" />}
              {isNegative && <ArrowDownRight className="h-3.5 w-3.5 mr-0.5" />}
              {!isPositive && !isNegative && <Minus className="h-3.5 w-3.5 mr-0.5" />}
              <span>{Math.abs(trend.value)}%</span>
              {trend.label && (
                <span className="text-muted-foreground font-normal ml-1">
                  {trend.label}
                </span>
              )}
            </div>
          )}
          {subtitle && (
            <p className="text-[11px] text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

