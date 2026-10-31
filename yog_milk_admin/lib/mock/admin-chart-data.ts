export interface HourlyIntakeData {
  time: string;
  dawnDispatch: number;
  afternoonIntake: number;
  highlight?: boolean;
}

export const MOCK_HOURLY_CURVE: HourlyIntakeData[] = [
  { time: "03:00", dawnDispatch: 12, afternoonIntake: 0 },
  { time: "04:00", dawnDispatch: 78, afternoonIntake: 0 },
  { time: "05:00", dawnDispatch: 112, afternoonIntake: 0 },
  { time: "06:00", dawnDispatch: 134, afternoonIntake: 0, highlight: true },
  { time: "07:00", dawnDispatch: 86, afternoonIntake: 0 },
  { time: "08:00", dawnDispatch: 44, afternoonIntake: 0 },
  { time: "10:00", dawnDispatch: 0, afternoonIntake: 22 },
  { time: "12:00", dawnDispatch: 0, afternoonIntake: 30 },
  { time: "14:00", dawnDispatch: 0, afternoonIntake: 62 },
  { time: "16:00", dawnDispatch: 0, afternoonIntake: 71 },
];

export interface StatusDistributionSegment {
  name: string;
  count: number;
  percentage: number;
  color: string;
  badgeVariant: "placed" | "processing" | "outForDelivery" | "delivered";
}

export const MOCK_STATUS_DISTRIBUTION: StatusDistributionSegment[] = [
  {
    name: "Placed",
    count: 14,
    percentage: 10,
    color: "#f59e0b",
    badgeVariant: "placed",
  },
  {
    name: "Preparing",
    count: 38,
    percentage: 27,
    color: "#4f599c",
    badgeVariant: "processing",
  },
  {
    name: "Out for Delivery",
    count: 56,
    percentage: 39,
    color: "#151d4d",
    badgeVariant: "outForDelivery",
  },
  {
    name: "Delivered",
    count: 34,
    percentage: 24,
    color: "#1f9d63",
    badgeVariant: "delivered",
  },
];

