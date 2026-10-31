"use client";

import { useState, useMemo, useEffect } from "react";
import {
  History,
  Search,
  Filter,
  Download,
  ShieldCheck,
  Lock,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  ChevronRight,
  Eye,
  FileText,
  UserCheck,
  CreditCard,
  ShoppingBag,
  Truck,
  Sparkles,
  CalendarClock,
  Settings,
  Fingerprint,
} from "lucide-react";
import { PageHeading } from "@/components/layout/PageHeading";
import { AuditLogEntry, AuditActionType } from "@/lib/contracts/audit";
import { getMockAuditLogs } from "@/lib/mock/admin-audit-repo";
import { cn } from "@/lib/utils";

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [isClientLoaded, setIsClientLoaded] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [actionCategory, setActionCategory] = useState<string>("ALL");

  // Selected entry for expanded details modal
  const [selectedEntry, setSelectedEntry] = useState<AuditLogEntry | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setLogs(getMockAuditLogs());
    setIsClientLoaded(true);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Filtered entries
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // Category filter
      if (actionCategory !== "ALL") {
        if (actionCategory === "PAYMENTS" && !log.action.includes("PAYMENT")) return false;
        if (actionCategory === "ORDERS" && !log.action.includes("ORDER")) return false;
        if (actionCategory === "DELIVERIES" && !log.action.includes("DELIVERY")) return false;
        if (actionCategory === "RETAILERS" && !log.action.includes("RETAILER")) return false;
        if (actionCategory === "SCHEDULE" && !log.action.includes("SCHEDULE")) return false;
        if (actionCategory === "CATALOG" && !log.action.includes("PRICE") && !log.action.includes("STOCK"))
          return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchActor = log.actor.name.toLowerCase().includes(q);
        const matchAction = log.actionLabel.toLowerCase().includes(q);
        const matchRecord = log.affectedRecord.id.toLowerCase().includes(q) || (log.affectedRecord.name?.toLowerCase().includes(q) ?? false);
        const matchReason = log.reason?.toLowerCase().includes(q) ?? false;
        const matchHash = log.tamperSealHash.toLowerCase().includes(q);
        return matchActor || matchAction || matchRecord || matchReason || matchHash;
      }

      return true;
    });
  }, [logs, actionCategory, searchQuery]);

  // Export Audit Trail
  const handleExportAuditTrail = () => {
    const lines = [
      `"YOG MILK — TAMPER-EVIDENT APPEND-ONLY OPERATIONS AUDIT LOG"`,
      `"Export Timestamp","${new Date().toISOString()}"`,
      `"Root Block Hash","sha256:7f0c1a89b4e2d781f33c90e54b12a81203de94028bfe77382109cf8832a884e1"`,
      `""`,
      `"ID","Timestamp","Actor","Role","Action","Record Type","Record ID","Previous Value","New Value","Reason","Seal Hash"`,
      ...logs.map(
        (l) =>
          `"${l.id}","${l.timestamp}","${l.actor.name}","${l.actor.role}","${l.actionLabel}","${l.affectedRecord.type}","${l.affectedRecord.id}","${l.previousValue || "N/A"}","${l.newValue}","${l.reason || "N/A"}","${l.tamperSealHash}"`
      ),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `YOG_MILK_AUDIT_LOG_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Immutable audit trail exported successfully");
  };

  const getActionBadgeColor = (action: string) => {
    if (action.includes("PAYMENT")) return "bg-emerald-100 text-emerald-800 border-emerald-200";
    if (action.includes("ORDER")) return "bg-blue-100 text-blue-800 border-blue-200";
    if (action.includes("DELIVERY")) return "bg-purple-100 text-purple-800 border-purple-200";
    if (action.includes("RETAILER")) return "bg-teal-100 text-teal-800 border-teal-200";
    if (action.includes("SCHEDULE")) return "bg-amber-100 text-amber-800 border-amber-200";
    if (action.includes("PRICE") || action.includes("STOCK")) return "bg-indigo-100 text-indigo-800 border-indigo-200";
    return "bg-slate-100 text-slate-800 border-slate-200";
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

      {/* Top Header & Security Seal Banner */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-[#051256]" />
            <span>Security Governance</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#051256] font-bold">Ledger Node #4</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#051256] tracking-tight">
            Operations Audit Log & Immutable Telemetry
          </h1>
          <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
            Append-only system record tracking administrative actions, status transitions, and financial adjustments. Modifications and deletions are strictly prohibited.
          </p>
        </div>

        {/* Tamper Seal & Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 shadow-xs text-slate-800">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Lock className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider">
                SHA-256 Signed · Tamper-Evident
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                Merkle Tree Validated · Block #892,104
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleExportAuditTrail}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#051256] text-white text-xs font-semibold hover:bg-[#051256]/90 transition-all shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export Ledger CSV</span>
          </button>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-[#051256]">
            <History className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-500">Total Append Entries</div>
            <div className="text-base font-bold text-[#051256]">{logs.length} Committed</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-500">Merkle Root Sync</div>
            <div className="text-base font-bold text-emerald-800">100% Validated</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#051256]">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-500">Latest Event</div>
            <div className="text-base font-bold text-slate-800">Just Now</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-700">
            <Fingerprint className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-500">Signature Node</div>
            <div className="text-xs font-mono font-bold text-purple-900 truncate max-w-[130px]">
              sha256:7f0c...4b12
            </div>
          </div>
        </div>
      </div>

      {/* Main Audit Table Section */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search actor, record ID (ORD-..., RET-...), action, reason..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#051256]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {(
              [
                { key: "ALL", label: "All Events" },
                { key: "PAYMENTS", label: "Payments" },
                { key: "ORDERS", label: "Orders" },
                { key: "DELIVERIES", label: "Deliveries" },
                { key: "RETAILERS", label: "Retailers" },
                { key: "SCHEDULE", label: "Schedule" },
                { key: "CATALOG", label: "Catalog & Rates" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActionCategory(tab.key)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all",
                  actionCategory === tab.key
                    ? "bg-[#051256] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Audit Table */}
        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs bg-slate-50 rounded-xl">
            No audit records found matching your filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50/60">
                  <th className="py-3 px-4">Audit ID & Timestamp</th>
                  <th className="py-3 px-4">Administrative Actor</th>
                  <th className="py-3 px-4">Action Committed</th>
                  <th className="py-3 px-4">Affected Record</th>
                  <th className="py-3 px-4">State Transition (Diff)</th>
                  <th className="py-3 px-4">Audit Reason</th>
                  <th className="py-3 px-4 text-center">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Timestamp */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-slate-900">{entry.id}</div>
                      <div className="text-[11px] text-slate-500">
                        {new Date(entry.timestamp).toLocaleString([], {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </td>

                    {/* Actor */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{entry.actor.name}</div>
                      <div className="text-[11px] text-slate-500">{entry.actor.role}</div>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4">
                      <span
                        className={cn(
                          "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                          getActionBadgeColor(entry.action)
                        )}
                      >
                        {entry.actionLabel}
                      </span>
                    </td>

                    {/* Affected Record */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-semibold text-[#051256]">
                        {entry.affectedRecord.id}
                      </div>
                      {entry.affectedRecord.name && (
                        <div className="text-[11px] text-slate-500 truncate max-w-[150px]">
                          {entry.affectedRecord.name}
                        </div>
                      )}
                    </td>

                    {/* State Diff */}
                    <td className="py-3.5 px-4 max-w-xs">
                      {entry.previousValue && (
                        <div className="text-[11px] text-rose-600 line-through truncate">
                          {entry.previousValue}
                        </div>
                      )}
                      <div className="text-[11px] font-semibold text-emerald-700 truncate">
                        {entry.newValue}
                      </div>
                    </td>

                    {/* Reason */}
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs">
                      <span className="line-clamp-2 leading-relaxed">
                        {entry.reason || "Administrative procedure"}
                      </span>
                    </td>

                    {/* Inspect Button */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedEntry(entry)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-[#051256] hover:bg-slate-100 transition-colors"
                        title="View Full Cryptographic Entry"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* AUDIT ENTRY DETAIL MODAL                                                  */}
      {/* ========================================================================= */}
      {selectedEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-400">
                    {selectedEntry.id}
                  </span>
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                      getActionBadgeColor(selectedEntry.action)
                    )}
                  >
                    {selectedEntry.actionLabel}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  Immutable Telemetry Inspection
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEntry(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Actor</span>
                  <div className="font-bold text-slate-900">{selectedEntry.actor.name}</div>
                  <div className="text-slate-500">{selectedEntry.actor.role} ({selectedEntry.actor.email})</div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Timestamp & Node</span>
                  <div className="font-mono text-slate-800">{new Date(selectedEntry.timestamp).toLocaleString()}</div>
                  <div className="text-slate-500 font-mono">IP: {selectedEntry.ipAddress || "Internal"}</div>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Affected Record
                </span>
                <div className="p-3 rounded-lg border border-slate-200 flex items-center justify-between">
                  <span className="font-mono font-bold text-[#051256]">
                    {selectedEntry.affectedRecord.id} ({selectedEntry.affectedRecord.type})
                  </span>
                  <span className="text-slate-600">{selectedEntry.affectedRecord.name}</span>
                </div>
              </div>

              {/* State Transition Diff */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  State Mutation Before & After
                </span>
                {selectedEntry.previousValue && (
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800">
                    <span className="text-[10px] font-bold uppercase block text-rose-500">Prior State</span>
                    {selectedEntry.previousValue}
                  </div>
                )}
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900">
                  <span className="text-[10px] font-bold uppercase block text-emerald-600">Committed New State</span>
                  {selectedEntry.newValue}
                </div>
              </div>

              {/* Reason */}
              {selectedEntry.reason && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Administrator Operational Note
                  </span>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 italic">
                    &ldquo;{selectedEntry.reason}&rdquo;
                  </div>
                </div>
              )}

              {/* SHA-256 Hash Seal */}
              <div className="p-3 rounded-lg bg-slate-900 text-white font-mono text-[11px] space-y-1">
                <span className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1.5">
                  <Lock className="w-3 h-3" />
                  SHA-256 Cryptographic Seal
                </span>
                <div className="break-all opacity-90">{selectedEntry.tamperSealHash}</div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedEntry(null)}
                className="px-4 py-2 rounded-xl bg-[#051256] text-white text-xs font-semibold hover:bg-[#051256]/90"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
