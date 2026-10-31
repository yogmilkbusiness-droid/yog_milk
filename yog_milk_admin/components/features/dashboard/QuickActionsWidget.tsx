"use client";

import Link from "next/link";
import {
  IndianRupee,
  Clock,
  Truck,
  FileDown,
  Sparkles,
} from "lucide-react";

interface ActionItem {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: string;
  colorClass: string;
}

const actions: ActionItem[] = [
  {
    title: "Record Manual COD Payment",
    description: "Settle driver cash collection and resolve Rule 4.4 pending block",
    icon: IndianRupee,
    href: "/payments",
    badge: "Rule 4.3",
    colorClass: "bg-amber-50 text-amber-800 border-amber-200 hover:border-amber-400",
  },
  {
    title: "Adjust Ordering Hours",
    description: "Configure daily 07:00 – 17:00 IST automated gate and exception closures",
    icon: Clock,
    href: "/schedule",
    badge: "Rule 4.1",
    colorClass: "bg-emerald-50 text-emerald-800 border-emerald-200 hover:border-emerald-400",
  },
  {
    title: "Assign Delivery Route Van",
    description: "Triage crates to Western India cold-chain fleet routes",
    icon: Truck,
    href: "/deliveries",
    colorClass: "bg-blue-50 text-blue-800 border-blue-200 hover:border-blue-400",
  },
  {
    title: "Commercial Non-GST Invoices",
    description: "Download itemized farm bills & batch delivery memos",
    icon: FileDown,
    href: "/invoices",
    badge: "Rule 4.5",
    colorClass: "bg-purple-50 text-purple-800 border-purple-200 hover:border-purple-400",
  },
];

export function QuickActionsWidget() {
  return (
    <div className="bg-white p-5 rounded-2xl border border-dairy-subtle shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-dairy-subtle mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-secondary" />
          <h3 className="font-serif text-base font-bold text-primary">
            Quick Operational Actions
          </h3>
        </div>
        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
          Standard Protocols
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {actions.map((act) => (
          <Link
            key={act.title}
            href={act.href}
            className={`p-3.5 rounded-xl border transition-all text-left flex flex-col justify-between group shadow-xs hover:shadow-md ${act.colorClass}`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-white shadow-xs">
                  <act.icon className="h-4 w-4" />
                </div>
                {act.badge && (
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/80 font-mono shadow-2xs">
                    {act.badge}
                  </span>
                )}
              </div>
              <h4 className="text-xs font-bold leading-tight group-hover:text-primary transition-colors">
                {act.title}
              </h4>
              <p className="text-[11px] opacity-80 mt-1 leading-snug">
                {act.description}
              </p>
            </div>
            <div className="mt-3 text-[10px] font-bold uppercase tracking-wider text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Launch Action →
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

