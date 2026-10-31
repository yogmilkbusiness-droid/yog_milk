"use client";

import { useState, useMemo, useEffect } from "react";
import {
  CalendarClock,
  Clock,
  ShieldCheck,
  AlertCircle,
  Plus,
  Trash2,
  CheckCircle2,
  HelpCircle,
  Calendar,
  Sparkles,
  Info,
  Layers,
  ArrowRight,
  History,
  X,
  RotateCcw,
} from "lucide-react";
import { PageHeading } from "@/components/layout/PageHeading";
import {
  OrderingScheduleConfig,
  DaySchedule,
  ScheduledException,
  GateCalculationResult,
} from "@/lib/contracts/schedule";
import {
  getMockScheduleConfig,
  updateMockScheduleConfig,
  addMockScheduledException,
  removeMockScheduledException,
  calculateGateStatus,
} from "@/lib/mock/admin-schedule-repo";
import { appendMockAuditLog } from "@/lib/mock/admin-audit-repo";
import { cn } from "@/lib/utils";

export default function OrderingSchedulePage() {
  const [config, setConfig] = useState<OrderingScheduleConfig>(getMockScheduleConfig());
  const [isClientLoaded, setIsClientLoaded] = useState(false);

  // Virtual Clock Simulator for testing Open/Closed states
  const [simulationMode, setSimulationMode] = useState<"LIVE" | "MORNING_OPEN" | "NIGHT_CLOSED" | "EXCEPTION_CLOSED">("LIVE");

  // New Exception Modal
  const [isExceptionModalOpen, setIsExceptionModalOpen] = useState(false);
  const [newExcDate, setNewExcDate] = useState("");
  const [newExcName, setNewExcName] = useState("");
  const [newExcReason, setNewExcReason] = useState("");

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setConfig(getMockScheduleConfig());
    setIsClientLoaded(true);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Compute simulated date based on simulation mode
  const simulatedDate = useMemo(() => {
    const d = new Date();
    if (simulationMode === "MORNING_OPEN") {
      d.setHours(10, 30, 0, 0); // 10:30 AM (Inside 07:00 - 17:00)
    } else if (simulationMode === "NIGHT_CLOSED") {
      d.setHours(20, 15, 0, 0); // 08:15 PM (Outside 07:00 - 17:00)
    } else if (simulationMode === "EXCEPTION_CLOSED") {
      // Force match first exception
      if (config.scheduledExceptions && config.scheduledExceptions.length > 0) {
        const [y, m, dt] = config.scheduledExceptions[0].date.split("-").map(Number);
        d.setFullYear(y, m - 1, dt);
        d.setHours(11, 0, 0, 0);
      }
    }
    return d;
  }, [simulationMode, config.scheduledExceptions]);

  // Dynamic Gate calculation
  const gateStatus: GateCalculationResult = useMemo(() => {
    return calculateGateStatus(config, simulatedDate);
  }, [config, simulatedDate]);

  // Handle Day Schedule Toggle
  const toggleDayEnabled = (dayName: string) => {
    const updatedWeekly = config.weeklyDays.map((d) =>
      d.day === dayName ? { ...d, enabled: !d.enabled } : d
    );
    const updated = updateMockScheduleConfig({ weeklyDays: updatedWeekly });
    setConfig(updated);

    appendMockAuditLog({
      actor: { id: "ADM-001", name: "Vikram Mehta", role: "Master Ops Root", email: "sec-ops@yogmilk.in" },
      action: "SCHEDULE_UPDATED",
      actionLabel: `Toggled ${dayName} Operating State`,
      affectedRecord: { type: "SCHEDULE", id: "SCHED-WEEKLY", name: dayName },
      previousValue: `Enabled: ${config.weeklyDays.find((d) => d.day === dayName)?.enabled}`,
      newValue: `Enabled: ${!config.weeklyDays.find((d) => d.day === dayName)?.enabled}`,
      timestamp: new Date().toISOString(),
      reason: "Adjusted recurring weekly ordering schedule.",
    });

    showToast(`Updated operating status for ${dayName}`);
  };

  // Handle Time Change for a Day
  const handleTimeChange = (dayName: string, field: "openTime" | "closeTime", val: string) => {
    const updatedWeekly = config.weeklyDays.map((d) =>
      d.day === dayName ? { ...d, [field]: val } : d
    );
    const updated = updateMockScheduleConfig({ weeklyDays: updatedWeekly });
    setConfig(updated);
  };

  // Add Exception Closure
  const handleAddException = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExcDate || !newExcName) return;

    const updated = addMockScheduledException(newExcDate, newExcName, newExcReason);
    setConfig(updated);

    appendMockAuditLog({
      actor: { id: "ADM-001", name: "Vikram Mehta", role: "Master Ops Root", email: "sec-ops@yogmilk.in" },
      action: "SCHEDULE_UPDATED",
      actionLabel: "Added Scheduled Exception Closure",
      affectedRecord: { type: "SCHEDULE", id: `EXC-${newExcDate}`, name: newExcName },
      previousValue: null,
      newValue: `Date: ${newExcDate} · Reason: ${newExcReason}`,
      timestamp: new Date().toISOString(),
      reason: `Scheduled hub closure for: ${newExcName}`,
    });

    setIsExceptionModalOpen(false);
    setNewExcDate("");
    setNewExcName("");
    setNewExcReason("");
    showToast("Scheduled exception closure added successfully");
  };

  // Remove Exception Closure
  const handleRemoveException = (id: string, name: string) => {
    const updated = removeMockScheduledException(id);
    setConfig(updated);

    appendMockAuditLog({
      actor: { id: "ADM-001", name: "Vikram Mehta", role: "Master Ops Root", email: "sec-ops@yogmilk.in" },
      action: "SCHEDULE_UPDATED",
      actionLabel: "Removed Exception Closure",
      affectedRecord: { type: "SCHEDULE", id, name },
      previousValue: `Exception: ${name}`,
      newValue: "Removed / Reopened for ordering",
      timestamp: new Date().toISOString(),
      reason: "Holiday closure cancelled or rescheduled.",
    });

    showToast(`Removed scheduled exception: ${name}`);
  };

  if (!isClientLoaded) {
    return (
      <div className="p-8 max-w-[1400px] mx-auto space-y-6">
        <div className="h-8 w-64 bg-slate-200 animate-pulse rounded-lg" />
        <div className="h-44 bg-slate-100 animate-pulse rounded-2xl" />
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
      <PageHeading
        title="Ordering Schedule & Operational Gate"
        description="Automated recurring ordering window configuration and calendar exception management."
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Ordering Schedule" },
        ]}
      />

      {/* ========================================================================= */}
      {/* 1. DYNAMIC OPERATIONAL GATE STATUS BANNER (Item 1 & Master Plan Rule 4.1) */}
      {/* ========================================================================= */}
      <div
        className={cn(
          "rounded-2xl p-6 border shadow-sm transition-all relative overflow-hidden",
          gateStatus.isOpen
            ? "bg-[#E3F6EC] border-[#1F9D63]/30 text-[#0E4A2D]"
            : "bg-[#FFF4DB] border-[#E8A317]/40 text-[#7A4F00]"
        )}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-xs",
                  gateStatus.isOpen
                    ? "bg-[#1F9D63] text-white"
                    : "bg-[#E8A317] text-white"
                )}
              >
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                {gateStatus.isOpen ? "GATE IS CURRENTLY OPEN" : "GATE IS CURRENTLY CLOSED"}
              </span>
              <span className="text-xs font-medium opacity-80">
                Timezone: {config.timezone} · Active Day: {gateStatus.currentDayName}
              </span>
            </div>

            <h2 className="text-2xl font-serif font-bold tracking-tight text-slate-900">
              {gateStatus.isOpen
                ? `Commercial Bulk Ordering Active — Closes ${gateStatus.nextClosingFormatted}`
                : `Ordering Window Closed — Next Opening: ${gateStatus.nextOpeningFormatted}`}
            </h2>

            <p className="text-xs max-w-2xl text-slate-700 leading-relaxed">
              {gateStatus.isOpen
                ? "Retailers can browse current dairy stock, configure bulk pouch orders, and submit carts for next dawn dispatch."
                : gateStatus.activeClosureReason ||
                  "All checkout and cart submission paths in the retailer application are automatically blocked until the schedule reopens."}
            </p>
          </div>

          {/* Virtual Clock & Test Simulator Widget */}
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-black/10 shrink-0 space-y-2.5">
            <div className="flex items-center justify-between gap-3 text-xs font-bold text-slate-800">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#051256]" />
                Virtual Clock Test Simulator
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 font-mono">
                {gateStatus.currentTimeString} IST
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Simulate daytime/nighttime to verify live retailer gate behavior:
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => setSimulationMode("LIVE")}
                className={cn(
                  "px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all text-left",
                  simulationMode === "LIVE"
                    ? "bg-[#051256] text-white font-semibold"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                )}
              >
                Live Device Clock
              </button>
              <button
                type="button"
                onClick={() => setSimulationMode("MORNING_OPEN")}
                className={cn(
                  "px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all text-left",
                  simulationMode === "MORNING_OPEN"
                    ? "bg-[#1F9D63] text-white font-semibold"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                )}
              >
                10:30 AM (Open)
              </button>
              <button
                type="button"
                onClick={() => setSimulationMode("NIGHT_CLOSED")}
                className={cn(
                  "px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all text-left",
                  simulationMode === "NIGHT_CLOSED"
                    ? "bg-[#E8A317] text-white font-semibold"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                )}
              >
                08:15 PM (Closed)
              </button>
              <button
                type="button"
                onClick={() => setSimulationMode("EXCEPTION_CLOSED")}
                className={cn(
                  "px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all text-left",
                  simulationMode === "EXCEPTION_CLOSED"
                    ? "bg-rose-700 text-white font-semibold"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                )}
              >
                Holiday Exception
              </button>
            </div>
          </div>
        </div>

        {/* Strict Rule 4.1 Governance Badge */}
        <div className="mt-4 pt-3.5 border-t border-black/10 flex items-center gap-2 text-xs text-slate-600">
          <ShieldCheck className="w-4 h-4 text-[#051256] shrink-0" />
          <span>
            <strong>Master Switch Prohibited (Rule 4.1):</strong> There is no manual ON/OFF master toggle. The gate is calculated purely from configured schedule windows and exception dates.
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. WEEKLY ORDERING SCHEDULE & DISPATCH PAIRING TABLE                       */}
      {/* ========================================================================= */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#051256]" />
              Weekly Ordering Schedule & Next-Dawn Dispatch Pairing
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure daily ordering windows and linked dawn delivery van dispatch runs.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <span>Cutoff Buffer:</span>
            <strong className="text-slate-900 font-bold">{config.cutoffBufferMinutes} mins</strong>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50/60">
                <th className="py-3 px-4">Weekday</th>
                <th className="py-3 px-4">Ordering Gate</th>
                <th className="py-3 px-4">Opening Time</th>
                <th className="py-3 px-4">Closing Time</th>
                <th className="py-3 px-4">Linked Delivery Dispatch</th>
                <th className="py-3 px-4">Target Slot</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {config.weeklyDays.map((day) => {
                const isToday = day.day === gateStatus.currentDayName;
                return (
                  <tr
                    key={day.dayCode}
                    className={cn(
                      "hover:bg-slate-50/70 transition-colors",
                      isToday && "bg-blue-50/40"
                    )}
                  >
                    <td className="py-3.5 px-4 font-semibold text-slate-900 flex items-center gap-2">
                      <span>{day.day}</span>
                      {isToday && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#051256] text-white">
                          Today
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => toggleDayEnabled(day.day)}
                        className={cn(
                          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                          day.enabled ? "bg-[#1F9D63]" : "bg-slate-300"
                        )}
                      >
                        <span
                          className={cn(
                            "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
                            day.enabled ? "translate-x-4" : "translate-x-0"
                          )}
                        />
                      </button>
                    </td>
                    <td className="py-3.5 px-4">
                      <input
                        type="time"
                        value={day.openTime}
                        disabled={!day.enabled}
                        onChange={(e) => handleTimeChange(day.day, "openTime", e.target.value)}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-xs font-mono disabled:opacity-50"
                      />
                    </td>
                    <td className="py-3.5 px-4">
                      <input
                        type="time"
                        value={day.closeTime}
                        disabled={!day.enabled}
                        onChange={(e) => handleTimeChange(day.day, "closeTime", e.target.value)}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-xs font-mono disabled:opacity-50"
                      />
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      <span className="flex items-center gap-1.5">
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                        {day.dispatchDay}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      {day.dispatchSlot}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded text-[11px] font-semibold",
                          day.enabled
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                        )}
                      >
                        {day.enabled ? "Scheduled Active" : "Day Off / Closed"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. SCHEDULED HOLIDAY & EXCEPTION CLOSURES                                  */}
      {/* ========================================================================= */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CalendarClock className="w-4 h-4 text-[#051256]" />
              Scheduled Exception Closures & Chilling Hub Holidays
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Specific dates where the ordering window is completely closed for sanitization, maintenance, or regional festivals.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsExceptionModalOpen(true)}
            className="px-4 py-2 bg-[#051256] text-white rounded-xl text-xs font-semibold hover:bg-[#051256]/90 transition-all flex items-center gap-2 shadow-xs shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Scheduled Closure</span>
          </button>
        </div>

        {config.scheduledExceptions.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs bg-slate-50 rounded-xl">
            No holiday exceptions currently scheduled. Daily recurring windows apply.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {config.scheduledExceptions.map((exc) => (
              <div
                key={exc.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xs transition-all flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#E8A317]/15 text-[#7A4F00] border border-[#E8A317]/30">
                        {exc.date}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        {exc.status}
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-slate-900">{exc.name}</h3>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{exc.reason}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveException(exc.id, exc.name)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Remove exception"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Ordering Window: Closed All Day</span>
                  <span className="text-emerald-700 font-medium">Auto-notifies Retailers</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 4. MODAL: ADD EXCEPTION CLOSURE                                            */}
      {/* ========================================================================= */}
      {isExceptionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CalendarClock className="w-4 h-4 text-[#051256]" />
                Schedule Holiday or Hub Closure
              </h3>
              <button
                type="button"
                onClick={() => setIsExceptionModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddException} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Closure Date
                </label>
                <input
                  type="date"
                  required
                  value={newExcDate}
                  onChange={(e) => setNewExcDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#051256]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Closure Title / Occasion
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Diwali Sanitization & Cold-Chain Maintenance"
                  value={newExcName}
                  onChange={(e) => setNewExcName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#051256]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Operational Reason (Visible to Retailers)
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Annual chilling vat calibration. Deliveries resume normal schedule next dawn."
                  value={newExcReason}
                  onChange={(e) => setNewExcReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#051256]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsExceptionModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#051256] text-white text-xs font-semibold hover:bg-[#051256]/90"
                >
                  Confirm & Save Exception
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
