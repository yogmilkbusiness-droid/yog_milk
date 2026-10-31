"use client";

import Link from "next/link";
import {
  ShieldCheck,
  ArrowRight,
  Clock,
  IndianRupee,
  Truck,
  ShoppingCart,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MOCK_ADMIN_ACTIVITIES } from "@/lib/mock/admin-activities";

export function RecentActivitiesWidget() {
  return (
    <div className="bg-white p-5 rounded-2xl border border-dairy-subtle shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-dairy-subtle">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <h3 className="font-serif text-base font-bold text-primary">
              Recent Activity &amp; Audit Trail
            </h3>
          </div>
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
            Live Stream
          </span>
        </div>

        <div className="space-y-3.5 mt-3">
          {MOCK_ADMIN_ACTIVITIES.slice(0, 5).map((act) => {
            let IconComponent = Clock;
            if (act.category === "PAYMENT") IconComponent = IndianRupee;
            else if (act.category === "LOGISTICS") IconComponent = Truck;
            else if (act.category === "ORDER") IconComponent = ShoppingCart;
            else if (act.category === "RETAILER") IconComponent = CheckCircle2;

            return (
              <div key={act.id} className="flex items-start gap-3 text-xs">
                <div className="h-7 w-7 rounded-lg bg-dairy-surface-low border border-dairy-subtle flex items-center justify-center shrink-0 text-primary mt-0.5">
                  <IconComponent className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-semibold text-dairy-dark truncate">
                      {act.title}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono shrink-0">
                      {act.timestamp}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">
                    {act.description}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-primary/80 font-medium">
                    <span>by {act.adminName}</span>
                    <span>•</span>
                    <span className="text-muted-foreground">{act.adminRole}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-3 border-t border-dairy-subtle text-center mt-3">
        <Link
          href="/audit"
          className="text-xs font-bold text-primary hover:text-secondary flex items-center justify-center gap-1"
        >
          <span>View Append-Only Audit Trail</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

