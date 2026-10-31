"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { MOCK_ADMIN_NOTIFICATIONS } from "@/lib/mock/admin-notifications";
import { cn } from "@/lib/utils";

export function OperationalAlertsWidget() {
  return (
    <div className="bg-white p-5 rounded-2xl border border-dairy-subtle shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-dairy-subtle">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-secondary" />
            <h3 className="font-serif text-base font-bold text-primary">
              Operations &amp; Risk Alerts
            </h3>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold">
            5 Active
          </span>
        </div>

        <div className="divide-y divide-dairy-subtle/80 mt-1">
          {MOCK_ADMIN_NOTIFICATIONS.map((alert) => {
            let badgeStyle = "bg-dairy-surface-low text-muted-foreground border-dairy-subtle";
            if (alert.severity === "urgent") {
              badgeStyle = "bg-rose-50 text-rose-700 border-rose-200";
            } else if (alert.severity === "warning") {
              badgeStyle = "bg-amber-50 text-amber-800 border-amber-200";
            } else if (alert.severity === "info") {
              badgeStyle = "bg-blue-50 text-blue-700 border-blue-200";
            }

            return (
              <div key={alert.id} className="py-3">
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded border",
                      badgeStyle
                    )}
                  >
                    <span
                      className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        alert.severity === "urgent"
                          ? "bg-rose-500"
                          : alert.severity === "warning"
                          ? "bg-amber-500"
                          : "bg-blue-500"
                      )}
                    />
                    {alert.title}
                  </span>
                  <Link
                    href={alert.actionHref}
                    className="text-xs font-bold text-secondary hover:underline flex items-center gap-0.5"
                  >
                    {alert.actionText}
                  </Link>
                </div>
                <p className="text-xs font-bold text-dairy-dark mt-1.5">
                  {alert.entity}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                  {alert.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-3 border-t border-dairy-subtle text-center">
        <Link
          href="/notifications"
          className="text-xs font-bold text-primary hover:text-secondary flex items-center justify-center gap-1"
        >
          <span>View All System Triage Alerts</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

