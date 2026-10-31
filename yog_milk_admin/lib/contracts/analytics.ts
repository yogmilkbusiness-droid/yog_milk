export interface TimeTrendPoint {
  period: string; // e.g. "2026-10-25" or "Week 42" or "Oct 2026"
  label: string;
  orderCount: number;
  orderValue: number; // in INR
  paymentsCollected: number; // in INR
  pendingAmount: number; // in INR
}

export interface StatusDistributionItem {
  status: string;
  label: string;
  count: number;
  percentage: number;
  color: string;
}

export interface TopProductAnalytics {
  productId: string;
  productName: string;
  category: string;
  packSize: string;
  unitsSold: number;
  totalRevenue: number;
  stockStatus: string;
}

export interface TopRetailerAnalytics {
  retailerId: string;
  shopName: string;
  ownerName: string;
  area: string;
  orderCount: number;
  totalBilledValue: number;
  totalPaid: number;
  pendingBalance: number;
  settlementRate: number; // e.g. 98%
}

export interface OperationsAnalyticsSummary {
  dateRange: "TODAY" | "LAST_7_DAYS" | "CURRENT_MONTH" | "ALL_TIME";
  totalOrderVolume: number;
  totalOrderValue: number;
  totalPaymentsCollected: number;
  upiPaymentsTotal: number;
  codPaymentsTotal: number;
  totalPendingBalance: number;
  blockedRetailersCount: number;
  deliveryCompletionRate: number; // percentage
  onTimeDawnDispatches: number;
  failedDispatches: number;
  statusDistribution: StatusDistributionItem[];
  dailyTrends: TimeTrendPoint[];
  weeklyTrends: TimeTrendPoint[];
  monthlyTrends: TimeTrendPoint[];
  topProducts: TopProductAnalytics[];
  topRetailers: TopRetailerAnalytics[];
}

