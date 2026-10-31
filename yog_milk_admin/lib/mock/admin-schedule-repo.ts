import {
  OrderingScheduleConfig,
  GateCalculationResult,
  DaySchedule,
  ScheduledException,
} from "@/lib/contracts/schedule";

const DEFAULT_WEEKLY_DAYS: DaySchedule[] = [
  {
    day: "Monday",
    dayCode: "MON",
    enabled: true,
    openTime: "07:00",
    closeTime: "17:00",
    dispatchDay: "Tuesday Dawn",
    dispatchSlot: "05:00 AM - 08:00 AM",
  },
  {
    day: "Tuesday",
    dayCode: "TUE",
    enabled: true,
    openTime: "07:00",
    closeTime: "17:00",
    dispatchDay: "Wednesday Dawn",
    dispatchSlot: "05:00 AM - 08:00 AM",
  },
  {
    day: "Wednesday",
    dayCode: "WED",
    enabled: true,
    openTime: "07:00",
    closeTime: "17:00",
    dispatchDay: "Thursday Dawn",
    dispatchSlot: "05:00 AM - 08:00 AM",
  },
  {
    day: "Thursday",
    dayCode: "THU",
    enabled: true,
    openTime: "07:00",
    closeTime: "17:00",
    dispatchDay: "Friday Dawn",
    dispatchSlot: "05:00 AM - 08:00 AM",
  },
  {
    day: "Friday",
    dayCode: "FRI",
    enabled: true,
    openTime: "07:00",
    closeTime: "17:00",
    dispatchDay: "Saturday Dawn",
    dispatchSlot: "05:00 AM - 08:00 AM",
  },
  {
    day: "Saturday",
    dayCode: "SAT",
    enabled: true,
    openTime: "07:00",
    closeTime: "17:00",
    dispatchDay: "Sunday Dawn",
    dispatchSlot: "05:00 AM - 08:00 AM",
  },
  {
    day: "Sunday",
    dayCode: "SUN",
    enabled: true,
    openTime: "07:00",
    closeTime: "17:00",
    dispatchDay: "Monday Dawn",
    dispatchSlot: "05:00 AM - 08:00 AM",
  },
];

const DEFAULT_EXCEPTIONS: ScheduledException[] = [
  {
    id: "EXC-2026-1101",
    date: "2026-11-01",
    name: "Diwali Hub Sanitation & Chilling Vat Servicing",
    reason: "Annual cold-chain deep sanitization and milk tank inspection at Pune Central Hub.",
    status: "SCHEDULED",
  },
  {
    id: "EXC-2026-1115",
    date: "2026-11-15",
    name: "Guru Nanak Jayanti Cold Fleet Overhaul",
    reason: "Scheduled fleet telemetry check and refrigerated van maintenance.",
    status: "SCHEDULED",
  },
];

let currentConfig: OrderingScheduleConfig = {
  timezone: "Asia/Kolkata (IST)",
  openTime: "07:00",
  closeTime: "17:00",
  applicableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  weeklyDays: DEFAULT_WEEKLY_DAYS,
  specialClosures: DEFAULT_EXCEPTIONS.map((e) => ({ date: e.date, reason: e.reason })),
  scheduledExceptions: DEFAULT_EXCEPTIONS,
  cutoffBufferMinutes: 30,
  nextDawnDispatchSlot: "05:00 AM - 08:00 AM",
  lastModifiedBy: "Vikram Mehta (Master Ops Root)",
  lastModifiedAt: "2026-10-31T14:30:00Z",
};

export function getMockScheduleConfig(): OrderingScheduleConfig {
  return { ...currentConfig };
}

export function updateMockScheduleConfig(
  updates: Partial<OrderingScheduleConfig>,
  adminName: string = "Vikram Mehta"
): OrderingScheduleConfig {
  currentConfig = {
    ...currentConfig,
    ...updates,
    lastModifiedBy: adminName,
    lastModifiedAt: new Date().toISOString(),
  };
  return { ...currentConfig };
}

export function addMockScheduledException(
  date: string,
  name: string,
  reason: string,
  adminName: string = "Vikram Mehta"
): OrderingScheduleConfig {
  const newException: ScheduledException = {
    id: `EXC-${Date.now().toString().slice(-6)}`,
    date,
    name,
    reason,
    status: "SCHEDULED",
  };
  currentConfig.scheduledExceptions = [newException, ...currentConfig.scheduledExceptions];
  currentConfig.specialClosures = currentConfig.scheduledExceptions.map((e) => ({
    date: e.date,
    reason: e.reason,
  }));
  currentConfig.lastModifiedBy = adminName;
  currentConfig.lastModifiedAt = new Date().toISOString();
  return { ...currentConfig };
}

export function removeMockScheduledException(
  id: string,
  adminName: string = "Vikram Mehta"
): OrderingScheduleConfig {
  currentConfig.scheduledExceptions = currentConfig.scheduledExceptions.filter((e) => e.id !== id);
  currentConfig.specialClosures = currentConfig.scheduledExceptions.map((e) => ({
    date: e.date,
    reason: e.reason,
  }));
  currentConfig.lastModifiedBy = adminName;
  currentConfig.lastModifiedAt = new Date().toISOString();
  return { ...currentConfig };
}

/**
 * Pure calculation of Gate status (Open/Closed) based solely on configured schedule.
 * Does NOT permit manual master toggles per Master Plan Rule 4.1.
 * Supports virtual clock simulation (pass Date or simulated time string).
 */
export function calculateGateStatus(
  config: OrderingScheduleConfig = currentConfig,
  virtualDate?: Date
): GateCalculationResult {
  const now = virtualDate || new Date();

  // Format current date in YYYY-MM-DD
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const todayDateStr = `${year}-${month}-${day}`;

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const currentDayName = dayNames[now.getDay()];

  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTimeMinutes = currentHour * 60 + currentMinute;
  const currentTimeString = `${String(currentHour).padStart(2, "0")}:${String(currentMinute).padStart(2, "0")}`;

  // 1. Check for scheduled exception closure today
  const activeException = config.scheduledExceptions?.find((e) => e.date === todayDateStr);
  if (activeException) {
    return {
      isOpen: false,
      currentTimeString,
      currentDayName,
      nextOpeningFormatted: "Tomorrow at 07:00 AM IST",
      nextClosingFormatted: "Closed for Scheduled Exception",
      activeClosureReason: `Closed today: ${activeException.name} (${activeException.reason})`,
      isExceptionClosure: true,
    };
  }

  // 2. Check Day of Week schedule
  const daySchedule = config.weeklyDays?.find((d) => d.day === currentDayName);
  if (!daySchedule || !daySchedule.enabled) {
    return {
      isOpen: false,
      currentTimeString,
      currentDayName,
      nextOpeningFormatted: "Next enabled weekday at 07:00 AM IST",
      nextClosingFormatted: "Closed on inactive schedule day",
      activeClosureReason: `Ordering is closed on ${currentDayName} per weekly schedule.`,
      isExceptionClosure: false,
    };
  }

  // 3. Check Daily Opening/Closing Window
  const [openH, openM] = (daySchedule.openTime || config.openTime || "07:00").split(":").map(Number);
  const [closeH, closeM] = (daySchedule.closeTime || config.closeTime || "17:00").split(":").map(Number);

  const openTimeMinutes = openH * 60 + openM;
  const closeTimeMinutes = closeH * 60 + closeM;

  const isOpen = currentTimeMinutes >= openTimeMinutes && currentTimeMinutes < closeTimeMinutes;

  const formatAmPm = (h: number, m: number) => {
    const period = h >= 12 ? "PM" : "AM";
    const displayH = h % 12 === 0 ? 12 : h % 12;
    return `${displayH}:${String(m).padStart(2, "0")} ${period}`;
  };

  const nextOpeningFormatted = isOpen
    ? `Tomorrow at ${formatAmPm(openH, openM)} IST`
    : currentTimeMinutes < openTimeMinutes
    ? `Today at ${formatAmPm(openH, openM)} IST`
    : `Tomorrow at ${formatAmPm(openH, openM)} IST`;

  const nextClosingFormatted = isOpen
    ? `Today at ${formatAmPm(closeH, closeM)} IST`
    : `Opens ${nextOpeningFormatted}`;

  return {
    isOpen,
    currentTimeString,
    currentDayName,
    nextOpeningFormatted,
    nextClosingFormatted,
    activeClosureReason: isOpen
      ? undefined
      : `The ordering window is closed (${formatAmPm(openH, openM)} – ${formatAmPm(closeH, closeM)}). Next opening: ${nextOpeningFormatted}`,
    isExceptionClosure: false,
  };
}

