"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  AlertTriangle,
  IndianRupee,
  Clock,
  Truck,
  CheckCheck,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { MOCK_ADMIN_NOTIFICATIONS, AdminNotification } from "@/lib/mock/admin-notifications";
import { cn } from "@/lib/utils";

export function NotificationPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AdminNotification[]>(
    MOCK_ADMIN_NOTIFICATIONS
  );
  const [activeTab, setActiveTab] = useState<"alerts" | "system">("alerts");
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markOneAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Trigger Bell */}
      <button
        type="button"
        aria-label="Operational Notifications"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-dairy-dark hover:bg-dairy-surface-low transition-colors border border-transparent hover:border-dairy-subtle focus:outline-none"
      >
        <Bell className="h-5 w-5 text-muted-foreground" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 h-4 min-w-4 px-1 rounded-full bg-secondary text-white text-[10px] font-bold flex items-center justify-center font-mono shadow-sm animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Popover Drawer */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-dairy-subtle z-50 overflow-hidden animate-in fade-in-50 zoom-in-95">
          {/* Header */}
          <div className="p-4 border-b border-dairy-subtle bg-dairy-surface-low flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-secondary" />
                <h3 className="font-serif font-bold text-sm text-dairy-dark">
                  Operational Alerts
                </h3>
                {unreadCount > 0 && (
                  <span className="text-[10px] bg-secondary/10 text-secondary font-bold px-2 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Dispatch triage, payment holds &amp; cutoff warnings
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-[11px] text-primary hover:text-secondary font-semibold flex items-center gap-1 transition-colors"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Mark all read
              </button>
            )}
          </div>

          {/* Tab Selector */}
          <div className="flex border-b border-dairy-subtle bg-white text-xs font-semibold px-4 pt-2 gap-4">
            <button
              type="button"
              onClick={() => setActiveTab("alerts")}
              className={cn(
                "pb-2 border-b-2 transition-colors",
                activeTab === "alerts"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-dairy-dark"
              )}
            >
              Dispatch &amp; Triage ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("system")}
              className={cn(
                "pb-2 border-b-2 transition-colors",
                activeTab === "system"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-dairy-dark"
              )}
            >
              Cold Chain &amp; Facility
            </button>
          </div>

          {/* List Content */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-dairy-subtle/80">
            {activeTab === "alerts" ? (
              notifications.map((notif) => {
                let badgeColor = "bg-dairy-surface-low text-muted-foreground border-dairy-subtle";
                let IconComponent = Clock;

                if (notif.severity === "urgent") {
                  badgeColor = "bg-rose-50 text-rose-700 border-rose-200";
                  IconComponent = AlertTriangle;
                } else if (notif.severity === "warning") {
                  badgeColor = "bg-amber-50 text-amber-800 border-amber-200";
                  IconComponent = IndianRupee;
                } else if (notif.severity === "info") {
                  badgeColor = "bg-blue-50 text-blue-700 border-blue-200";
                  IconComponent = Truck;
                }

                return (
                  <div
                    key={notif.id}
                    className={cn(
                      "p-3.5 hover:bg-dairy-surface-low/60 transition-colors text-xs",
                      !notif.read && "bg-secondary/5"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1",
                            badgeColor
                          )}
                        >
                          <IconComponent className="h-3 w-3" />
                          {notif.title}
                        </span>
                        {!notif.read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {notif.timestamp}
                      </span>
                    </div>

                    <p className="font-semibold text-dairy-dark mt-1">
                      {notif.entity}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                      {notif.description}
                    </p>

                    <div className="mt-2 flex items-center justify-between pt-1 border-t border-dairy-subtle/50">
                      <Link
                        href={notif.actionHref}
                        onClick={() => {
                          markOneAsRead(notif.id);
                          setIsOpen(false);
                        }}
                        className="text-[11px] font-bold text-secondary hover:text-secondary-container hover:underline flex items-center gap-0.5"
                      >
                        {notif.actionText}
                      </Link>
                      {!notif.read && (
                        <button
                          type="button"
                          onClick={() => markOneAsRead(notif.id)}
                          className="text-[10px] text-muted-foreground hover:text-dairy-dark"
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-6 text-center text-xs text-muted-foreground space-y-2">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCheck className="h-5 w-5" />
                </div>
                <p className="font-semibold text-dairy-dark">
                  Cold-Chain Telemetry Nominal
                </p>
                <p className="text-[11px]">
                  All 4 cold-room silos (Nashik, Hadapsar, Kothrud, Satara) reading within 3.8°C – 4.2°C target range.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 bg-dairy-surface-low border-t border-dairy-subtle text-center">
            <Link
              href="/notifications"
              onClick={() => setIsOpen(false)}
              className="text-xs font-bold text-primary hover:text-secondary flex items-center justify-center gap-1"
            >
              <span>View All Operational Broadcasts</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

