"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Bell,
  Search,
  Filter,
  CheckCheck,
  Send,
  Megaphone,
  AlertTriangle,
  CreditCard,
  Truck,
  ShoppingBag,
  Sparkles,
  CalendarClock,
  UserCheck,
  Eye,
  X,
  CheckCircle2,
  Clock,
  Layers,
  ChevronRight,
} from "lucide-react";
import { PageHeading } from "@/components/layout/PageHeading";
import {
  AdminNotification,
  BroadcastAnnouncementInput,
  NotificationCategory,
  NotificationPriority,
} from "@/lib/contracts/notification";
import {
  getMockNotifications,
  markMockNotificationAsRead,
  markAllMockNotificationsAsRead,
  sendMockBroadcastAnnouncement,
} from "@/lib/mock/admin-notifications-repo";
import { appendMockAuditLog } from "@/lib/mock/admin-audit-repo";
import { cn } from "@/lib/utils";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [isClientLoaded, setIsClientLoaded] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<NotificationCategory>("ALL");
  const [unreadOnly, setUnreadOnly] = useState(false);

  // Selected Notification for Detail Modal
  const [selectedNotification, setSelectedNotification] = useState<AdminNotification | null>(null);

  // Announcement Composer State
  const [composerTitle, setComposerTitle] = useState("");
  const [composerMessage, setComposerMessage] = useState("");
  const [composerAudience, setComposerAudience] = useState<
    "ALL_RETAILERS" | "ROUTE_PUNE_EAST" | "ROUTE_PUNE_WEST" | "PENDING_PAYMENT_ONLY"
  >("ALL_RETAILERS");
  const [composerPriority, setComposerPriority] = useState<NotificationPriority>("NORMAL");

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setNotifications(getMockNotifications());
    setIsClientLoaded(true);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Mark single as read
  const handleMarkAsRead = (id: string) => {
    markMockNotificationAsRead(id);
    setNotifications(getMockNotifications());
  };

  // Mark all as read
  const handleMarkAllAsRead = () => {
    markAllMockNotificationsAsRead();
    setNotifications(getMockNotifications());
    showToast("All notifications marked as read");
  };

  // Send Broadcast Announcement
  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composerTitle.trim() || !composerMessage.trim()) return;

    const created = sendMockBroadcastAnnouncement({
      title: composerTitle,
      message: composerMessage,
      targetAudience: composerAudience,
      priority: composerPriority,
      adminId: "ADM-001",
    });

    appendMockAuditLog({
      actor: { id: "ADM-001", name: "Vikram Mehta", role: "Master Ops Root", email: "sec-ops@yogmilk.in" },
      action: "BROADCAST_SENT",
      actionLabel: "Dispatched Commercial Broadcast Announcement",
      affectedRecord: { type: "SETTINGS", id: created.id, name: composerTitle },
      previousValue: null,
      newValue: `Audience: ${composerAudience} · Priority: ${composerPriority}`,
      timestamp: new Date().toISOString(),
      reason: "Commercial communication broadcast dispatched via push and in-app banner.",
    });

    setNotifications(getMockNotifications());
    setComposerTitle("");
    setComposerMessage("");
    showToast("Broadcast announcement dispatched successfully");
  };

  // Filtered notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      // Unread only toggle
      if (unreadOnly && item.isRead) return false;

      // Category filter
      if (activeCategory !== "ALL" && item.category !== activeCategory) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesMsg = item.message.toLowerCase().includes(q);
        const matchesRef = item.referenceId?.toLowerCase().includes(q);
        return matchesTitle || matchesMsg || matchesRef;
      }

      return true;
    });
  }, [notifications, activeCategory, unreadOnly, searchQuery]);

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "ORDER_NEW":
      case "ORDER_UPDATE":
        return <ShoppingBag className="w-4 h-4 text-blue-600" />;
      case "PAYMENT_RECEIVED":
        return <CreditCard className="w-4 h-4 text-emerald-600" />;
      case "PAYMENT_PENDING_COD":
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case "PAYMENT_FAILED":
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      case "DELIVERY_UPDATE":
        return <Truck className="w-4 h-4 text-purple-600" />;
      case "PRODUCT_AVAILABLE":
        return <Sparkles className="w-4 h-4 text-amber-500" />;
      case "SCHEDULE_CHANGE":
        return <CalendarClock className="w-4 h-4 text-indigo-600" />;
      case "RETAILER_APPROVAL":
        return <UserCheck className="w-4 h-4 text-teal-600" />;
      case "BROADCAST":
        return <Megaphone className="w-4 h-4 text-[#F47B20]" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  if (!isClientLoaded) {
    return (
      <div className="p-8 max-w-[1400px] mx-auto space-y-6">
        <div className="h-8 w-64 bg-slate-200 animate-pulse rounded-lg" />
        <div className="h-96 bg-slate-100 animate-pulse rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-7">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#051256] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-white/20 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Page Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <span>Operations Console</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#051256] font-bold">Communications & Telemetry</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#051256] tracking-tight">
            Notification Center & Operational Broadcasts
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-xs disabled:opacity-50"
          >
            <CheckCheck className="w-4 h-4 text-slate-500" />
            <span>Mark All Read</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DUAL PANE WORKSPACE: LEFT FEED + RIGHT ANNOUNCEMENT COMPOSER               */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        {/* LEFT COLUMN: NOTIFICATION FEED (7 Columns) */}
        <section className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
          {/* Top Filter and Search Bar */}
          <div className="space-y-3.5 border-b border-slate-100 pb-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search orders, retailers, payment slips, broadcast notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#051256]"
              />
            </div>

            {/* Category Filter Pills & Unread Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                {(
                  [
                    { key: "ALL", label: `All (${notifications.length})` },
                    { key: "ORDERS", label: "Orders" },
                    { key: "PAYMENTS", label: "Payments" },
                    { key: "DELIVERIES", label: "Deliveries" },
                    { key: "SYSTEM", label: "System" },
                    { key: "BROADCASTS", label: "Broadcasts" },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveCategory(tab.key)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all",
                      activeCategory === tab.key
                        ? "bg-[#051256] text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Unread Toggle */}
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 select-none">
                <input
                  type="checkbox"
                  checked={unreadOnly}
                  onChange={(e) => setUnreadOnly(e.target.checked)}
                  className="rounded border-slate-300 text-[#051256] focus:ring-[#051256]"
                />
                <span>Unread Only ({unreadCount})</span>
              </label>
            </div>
          </div>

          {/* Notifications List */}
          {filteredNotifications.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-xs bg-slate-50 rounded-xl">
              No notifications match your search and filter criteria.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => {
                    handleMarkAsRead(notif.id);
                    setSelectedNotification(notif);
                  }}
                  className={cn(
                    "p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 hover:shadow-xs",
                    notif.isRead
                      ? "bg-white border-slate-200 text-slate-700"
                      : "bg-blue-50/40 border-[#051256]/30 text-slate-900"
                  )}
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border",
                      notif.isRead
                        ? "bg-slate-100 border-slate-200"
                        : "bg-white border-[#051256]/20 shadow-xs"
                    )}
                  >
                    {getNotificationIcon(notif.type)}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold truncate">{notif.title}</span>
                        {!notif.isRead && (
                          <span className="w-2 h-2 rounded-full bg-[#F47B20] shrink-0" />
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-slate-400 shrink-0">
                        {new Date(notif.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {notif.message}
                    </p>

                    <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
                      {notif.referenceId && (
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-[10px] font-semibold text-slate-700">
                          {notif.referenceId}
                        </span>
                      )}
                      {notif.targetAudience && (
                        <span className="text-[10px] text-slate-400 italic">
                          Audience: {notif.targetAudience}
                        </span>
                      )}
                      <span
                        className={cn(
                          "ml-auto text-[10px] uppercase font-bold px-1.5 py-0.5 rounded",
                          notif.priority === "URGENT" && "bg-rose-100 text-rose-700",
                          notif.priority === "HIGH" && "bg-amber-100 text-amber-800",
                          notif.priority === "NORMAL" && "bg-slate-100 text-slate-600",
                          notif.priority === "LOW" && "bg-slate-100 text-slate-400"
                        )}
                      >
                        {notif.priority}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* RIGHT COLUMN: ANNOUNCEMENT COMPOSER (5 Columns) */}
        <section className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h2 className="text-base font-bold text-[#051256] flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-[#F47B20]" />
              Announcement Composer
            </h2>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-orange-100 text-[#F47B20]">
              Broadcast
            </span>
          </div>

          <form onSubmit={handleSendBroadcast} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Retailer Audience
              </label>
              <select
                value={composerAudience}
                onChange={(e) => setComposerAudience(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-[#051256]"
              >
                <option value="ALL_RETAILERS">All Active Retailers (Pune & Suburbs)</option>
                <option value="ROUTE_PUNE_EAST">Route #1 — Hadapsar, Magarpatta & Pune East</option>
                <option value="ROUTE_PUNE_WEST">Route #2 — Kothrud, Karve Nagar & Warje</option>
                <option value="PENDING_PAYMENT_ONLY">
                  Rule 4.4 Blocked Accounts (Pending Payment Due)
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Announcement Priority
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["NORMAL", "HIGH", "URGENT"] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setComposerPriority(p)}
                    className={cn(
                      "py-1.5 rounded-lg text-xs font-semibold border transition-all text-center",
                      composerPriority === p
                        ? "bg-[#051256] text-white border-[#051256]"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Announcement Headline / Title
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Dawn Logistics Update: Special Morning Run"
                value={composerTitle}
                onChange={(e) => setComposerTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#051256]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Message Body (Dispatched via In-App Notice & Push)
              </label>
              <textarea
                rows={4}
                required
                placeholder="Provide precise details regarding supply arrivals, milk availability, or schedule notifications..."
                value={composerMessage}
                onChange={(e) => setComposerMessage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#051256]"
              />
            </div>

            {/* Live Push Preview Card */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Retailer App Push Notification Preview
              </span>
              <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-xs flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-[#051256] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                  YM
                </div>
                <div className="space-y-0.5 min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {composerTitle || "Yog Milk Notice"}
                  </div>
                  <div className="text-[11px] text-slate-600 line-clamp-2">
                    {composerMessage || "Announcement preview will appear here in the retailer's app..."}
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#F47B20] text-white text-xs font-bold hover:bg-[#E06A12] transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <Send className="w-4 h-4" />
              <span>Send Broadcast Announcement</span>
            </button>
          </form>
        </section>
      </div>

      {/* ========================================================================= */}
      {/* NOTIFICATION DETAIL MODAL                                                  */}
      {/* ========================================================================= */}
      {selectedNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                  {getNotificationIcon(selectedNotification.type)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {selectedNotification.title}
                  </h3>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {new Date(selectedNotification.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedNotification(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-700 leading-relaxed text-sm bg-slate-50 p-4 rounded-xl border border-slate-100">
                {selectedNotification.message}
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-lg border border-slate-200">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">
                    Category
                  </div>
                  <div className="font-bold text-slate-800">{selectedNotification.category}</div>
                </div>

                <div className="p-3 rounded-lg border border-slate-200">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">
                    Priority
                  </div>
                  <div className="font-bold text-slate-800">{selectedNotification.priority}</div>
                </div>

                {selectedNotification.referenceId && (
                  <div className="p-3 rounded-lg border border-slate-200">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">
                      Reference ID
                    </div>
                    <div className="font-mono font-bold text-[#051256]">
                      {selectedNotification.referenceId}
                    </div>
                  </div>
                )}

                {selectedNotification.targetAudience && (
                  <div className="p-3 rounded-lg border border-slate-200">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">
                      Audience
                    </div>
                    <div className="font-medium text-slate-700 truncate">
                      {selectedNotification.targetAudience}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedNotification(null)}
                className="px-4 py-2 rounded-xl bg-[#051256] text-white text-xs font-semibold hover:bg-[#051256]/90"
              >
                Close Notification
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
