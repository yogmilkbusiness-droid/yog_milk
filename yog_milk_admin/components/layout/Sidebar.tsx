"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Truck,
  IndianRupee,
  FileText,
  Clock,
  BarChart3,
  Settings,
  ShieldCheck,
  Bell,
  LogOut,
  X,
} from "lucide-react";
import { useAdminAuth } from "@/components/auth/AuthContext";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeVariant?: "saffron" | "amber" | "emerald";
}

const navItems: NavItem[] = [
  {
    title: "Operations Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Live Orders Queue",
    href: "/orders",
    icon: ShoppingCart,
    badge: "18 new",
    badgeVariant: "saffron",
  },
  {
    title: "Payments & COD Ledger",
    href: "/payments",
    icon: IndianRupee,
    badge: "4 COD",
    badgeVariant: "amber",
  },
  {
    title: "Dispatch & Logistics",
    href: "/deliveries",
    icon: Truck,
    badge: "8 due",
    badgeVariant: "emerald",
  },
  {
    title: "Retailers 360°",
    href: "/retailers",
    icon: Users,
  },
  {
    title: "Product Catalog",
    href: "/catalog",
    icon: Package,
  },
  {
    title: "Commercial Invoices",
    href: "/invoices",
    icon: FileText,
  },
  {
    title: "Analytics & Reports",
    href: "/reports",
    icon: BarChart3,
  },
  {
    title: "Operational Alerts",
    href: "/notifications",
    icon: Bell,
  },
  {
    title: "Ordering Schedule",
    href: "/schedule",
    icon: Clock,
  },
  {
    title: "Append-Only Audit Log",
    href: "/audit",
    icon: ShieldCheck,
  },
  {
    title: "Settings & Staff",
    href: "/settings",
    icon: Settings,
  },
  {
    title: "UI Components Kit",
    href: "/components-showcase",
    icon: ShieldCheck,
  },
];

interface SidebarProps {
  onCloseMobile?: () => void;
}

export function Sidebar({ onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAdminAuth();

  return (
    <aside className="w-64 bg-primary text-white flex flex-col flex-shrink-0 h-screen sticky top-0 border-r border-primary-container z-40 select-none">
      {/* Brand Header */}
      <div className="p-4 lg:p-5 border-b border-primary-container flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
            {/* Sacred Milk Drop Lotus Brand Emblem */}
            <svg
              className="w-6 h-6 text-secondary-container"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
              <circle cx="12" cy="14" fill="#FFFCF6" r="3" />
            </svg>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg font-bold tracking-wide text-white">
                YOG MILK
              </span>
              <span className="text-[9px] uppercase tracking-wider font-bold bg-secondary/30 text-secondary-container px-1.5 py-0.5 rounded">
                Console
              </span>
            </div>
            <span className="text-[10px] text-primary-on-container font-medium">
              Vedic Pure Dairy Admin
            </span>
          </div>
        </div>

        {/* Mobile Close Button */}
        {onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-primary-on-container hover:text-white hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* System Hub Cold-Chain Notice (Stitch Pattern) */}
      <div className="mx-3 my-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-[11px] text-primary-on-container">
        <span className="flex items-center gap-1.5 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Cold-Chain Nominal
        </span>
        <span className="font-mono text-white/90 font-bold">4.2°C</span>
      </div>

      {/* Nav List */}
      <nav className="flex-1 overflow-y-auto px-3 py-1 space-y-0.5">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          let badgeBg = "bg-secondary text-white";
          if (item.badgeVariant === "amber") {
            badgeBg = "bg-amber-500/20 text-amber-300";
          } else if (item.badgeVariant === "emerald") {
            badgeBg = "bg-emerald-500/20 text-emerald-300";
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150",
                isActive
                  ? "bg-primary-container text-white shadow-sm border-l-4 border-secondary-container pl-2"
                  : "text-primary-on-container hover:bg-primary-container/40 hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon
                  className={cn(
                    "h-4 w-4 flex-shrink-0",
                    isActive ? "text-secondary-container" : "text-primary-on-container"
                  )}
                />
                <span>{item.title}</span>
              </div>
              {item.badge ? (
                <span
                  className={cn(
                    "text-[10px] font-bold px-1.5 py-0.5 rounded-full font-mono",
                    badgeBg
                  )}
                >
                  {item.badge}
                </span>
              ) : isActive ? (
                <span className="w-1.5 h-1.5 rounded-full bg-secondary-container" />
              ) : null}
            </Link>
          );
        })}
      </nav>

      {/* Footer Profile Pill & Sign Out */}
      <div className="p-3 border-t border-primary-container bg-primary/40 space-y-2">
        <div className="flex items-center justify-between px-2.5 py-2 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-secondary-container/20 border border-secondary-container/40 flex items-center justify-center font-bold text-secondary-container text-xs shrink-0">
              {user.avatarText}
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-white truncate">
                {user.name}
              </p>
              <p className="text-[10px] text-primary-on-container truncate">
                {user.roleLabel}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            title="Log out"
            className="text-primary-on-container hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center justify-between text-[10px] text-primary-on-container/70 px-1">
          <span>Western India Hub</span>
          <span>v2.0 Master Spec</span>
        </div>
      </div>
    </aside>
  );
}
