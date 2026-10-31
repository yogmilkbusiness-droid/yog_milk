"use client";

import { useState } from "react";
import {
  MOCK_HOURLY_CURVE,
  MOCK_STATUS_DISTRIBUTION,
} from "@/lib/mock/admin-chart-data";
import { cn } from "@/lib/utils";

export function DashboardCharts() {
  const [hoveredHour, setHoveredHour] = useState<string | null>(null);

  return (
    <div className="bg-white p-5 lg:p-6 rounded-2xl border border-dairy-subtle shadow-xs">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-dairy-subtle">
        <div>
          <h2 className="font-serif text-lg font-bold text-primary">
            Dawn Dispatch &amp; Hourly Intake Curve
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Hourly order volume showing peak 04:00 – 08:00 AM Vedic cold dispatch
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <span className="w-3 h-3 rounded-sm bg-primary" /> Dawn Dispatch
          </span>
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <span className="w-3 h-3 rounded-sm bg-secondary" /> Afternoon Intake
          </span>
        </div>
      </div>

      {/* Stylized Bar Curve with Tabular Hours */}
      <div className="mt-6">
        <div className="h-48 sm:h-56 flex items-end gap-2 sm:gap-4 px-2 pb-2 border-b border-dairy-subtle">
          {MOCK_HOURLY_CURVE.map((item) => {
            const isDawn = item.dawnDispatch > 0;
            const value = isDawn ? item.dawnDispatch : item.afternoonIntake;
            // Max is 134 at 06:00
            const heightPercent = Math.max(12, Math.round((value / 134) * 100));
            const isHovered = hoveredHour === item.time;

            return (
              <div
                key={item.time}
                onMouseEnter={() => setHoveredHour(item.time)}
                onMouseLeave={() => setHoveredHour(null)}
                className="flex-1 flex flex-col items-center gap-2 group cursor-pointer relative"
              >
                {/* Bar */}
                <div
                  className="w-full rounded-t-md transition-all duration-200 relative flex flex-col justify-end"
                  style={{ height: `${heightPercent}%` }}
                >
                  <div
                    className={cn(
                      "w-full h-full rounded-t-md transition-colors",
                      isDawn
                        ? item.highlight
                          ? "bg-primary group-hover:bg-primary-container"
                          : "bg-primary/80 group-hover:bg-primary"
                        : "bg-secondary/70 group-hover:bg-secondary"
                    )}
                  >
                    {item.highlight && (
                      <div className="w-full h-1.5 bg-secondary rounded-t" />
                    )}
                  </div>

                  {/* Tooltip */}
                  <div
                    className={cn(
                      "absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] px-2 py-0.5 rounded-md font-mono whitespace-nowrap shadow-md pointer-events-none transition-opacity z-10",
                      isHovered ? "opacity-100" : "opacity-0"
                    )}
                  >
                    {value} orders {isDawn ? "(Dawn)" : "(Intake)"}
                  </div>
                </div>

                {/* Time Label */}
                <span
                  className={cn(
                    "text-[10px] sm:text-[11px] font-mono",
                    item.highlight
                      ? "font-bold text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {item.time}
                </span>
              </div>
            );
          })}
        </div>

        {/* Status Distribution Progress Bar */}
        <div className="mt-5 pt-4 border-t border-dairy-subtle">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Batch Status Distribution (142 Total Orders)
            </span>
            <span className="text-xs font-mono text-primary font-bold">
              Fulfillment: 73% Complete
            </span>
          </div>

          {/* Stacked Progress Strip */}
          <div className="h-3.5 w-full rounded-full bg-dairy-surface-low flex overflow-hidden border border-dairy-subtle">
            {MOCK_STATUS_DISTRIBUTION.map((segment) => (
              <div
                key={segment.name}
                className="h-full transition-all"
                style={{
                  width: `${segment.percentage}%`,
                  backgroundColor: segment.color,
                }}
                title={`${segment.name}: ${segment.percentage}% (${segment.count} orders)`}
              />
            ))}
          </div>

          {/* Legends */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 text-xs">
            {MOCK_STATUS_DISTRIBUTION.map((segment) => (
              <div key={segment.name} className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: segment.color }}
                />
                <span className="text-dairy-dark font-medium">
                  {segment.name} ({segment.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

