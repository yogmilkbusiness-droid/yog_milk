export interface DashboardMetricsData {
  // Operational Pipeline
  ordersToday: number;
  ordersTodayDeltaPercent: number;
  awaitingActionCount: number;
  processingCount: number;
  deliveriesDueCount: number;
  deliveriesDueRoutes: number;
  deliveredCount: number;
  deliveredReturnRatio: string;
  activeRetailersCount: number;
  activeRetailersNewCount: number;

  // Financial Separation Triad (Rule 4.3 & 4.4)
  totalOrderValue: number; // Gross booked value
  orderValueDescription: string;
  avgBasketValue: number;

  paymentsCollected: number; // Settled amount
  paymentsCollectedPercent: number;
  onlineCollected: number;
  codCollected: number;

  pendingPayments: number; // Outstanding COD / Verifying debt
  codPendingOrdersCount: number;
  onlineVerifyingOrdersCount: number;
}

export const MOCK_DASHBOARD_METRICS: DashboardMetricsData = {
  // 1. Orders Today
  ordersToday: 142,
  ordersTodayDeltaPercent: 12,

  // 2. Awaiting Action
  awaitingActionCount: 14,

  // 3. Processing Orders (Preparing in Kitchen)
  processingCount: 38,

  // 4. Deliveries Due
  deliveriesDueCount: 56,
  deliveriesDueRoutes: 8,

  // 5. Delivered Orders
  deliveredCount: 48,
  deliveredReturnRatio: "100% bottles returned",

  // 6. Active Retailers
  activeRetailersCount: 312,
  activeRetailersNewCount: 9,

  // 7. Total Order Value (Gross Booked)
  totalOrderValue: 184650,
  orderValueDescription: "Non-GST Direct Vedic Dairy Dispatch Value (142 orders)",
  avgBasketValue: 1300,

  // 8. Payments Collected (Settled)
  paymentsCollected: 136210,
  paymentsCollectedPercent: 73.8,
  onlineCollected: 98400,
  codCollected: 37810,

  // 9. Pending Payments (COD Receivables + Online Verifying)
  pendingPayments: 48440,
  codPendingOrdersCount: 18,
  onlineVerifyingOrdersCount: 2,
};

