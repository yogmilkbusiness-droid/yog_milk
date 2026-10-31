export interface DaySchedule {
  day: string; // "Monday", "Tuesday", etc.
  dayCode: "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";
  enabled: boolean;
  openTime: string; // "07:00"
  closeTime: string; // "17:00"
  dispatchDay: string; // "Tuesday Dawn", etc.
  dispatchSlot: string; // "05:00 AM - 08:00 AM"
}

export interface ScheduledException {
  id: string;
  date: string; // "YYYY-MM-DD"
  name: string;
  reason: string;
  status: "SCHEDULED" | "ACTIVE" | "PASSED";
}

export interface OrderingScheduleConfig {
  timezone: string; // "Asia/Kolkata (IST)"
  openTime: string; // "07:00" default
  closeTime: string; // "17:00" default
  applicableDays: string[];
  weeklyDays: DaySchedule[];
  specialClosures: {
    date: string; // "YYYY-MM-DD"
    reason: string;
  }[];
  scheduledExceptions: ScheduledException[];
  cutoffBufferMinutes: number; // e.g. 30
  nextDawnDispatchSlot: string; // "05:00 AM - 08:00 AM"
  lastModifiedBy?: string;
  lastModifiedAt?: string;
}

export interface GateCalculationResult {
  isOpen: boolean;
  currentTimeString: string;
  currentDayName: string;
  nextOpeningFormatted: string;
  nextClosingFormatted: string;
  activeClosureReason?: string;
  isExceptionClosure: boolean;
}

export interface ScheduleRepository {
  getConfig(): Promise<OrderingScheduleConfig>;
  updateConfig(
    updates: Partial<OrderingScheduleConfig>,
    adminId: string
  ): Promise<OrderingScheduleConfig>;
  addSpecialClosure(
    date: string,
    name: string,
    reason: string,
    adminId: string
  ): Promise<OrderingScheduleConfig>;
  removeSpecialClosure(
    id: string,
    adminId: string
  ): Promise<OrderingScheduleConfig>;
}
