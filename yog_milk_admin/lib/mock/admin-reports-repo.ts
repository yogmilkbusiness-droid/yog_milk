import {
  OperationsAnalyticsSummary,
  TimeTrendPoint,
  StatusDistributionItem,
  TopProductAnalytics,
  TopRetailerAnalytics,
} from "@/lib/contracts/analytics";
import { getMockOrders } from "@/lib/mock/admin-orders-repo";
import { getMockPayments } from "@/lib/mock/admin-billing-repo";
import { getMockRetailers } from "@/lib/mock/admin-retailers";
import { getMockProducts } from "@/lib/mock/admin-catalog";

export function getOperationsAnalytics(
  range: "TODAY" | "LAST_7_DAYS" | "CURRENT_MONTH" | "ALL_TIME" = "CURRENT_MONTH"
): OperationsAnalyticsSummary {
  const orders = getMockOrders();
  const payments = getMockPayments();
  const retailers = getMockRetailers();
  const products = getMockProducts();

  // 1. Volumes and Values
  const totalOrderVolume = orders.length;
  const totalOrderValue = orders.reduce((acc, o) => acc + (o.totalPayable || 0), 0);

  const totalPaymentsCollected = payments
    .filter((p) => p.paymentStatus === "PAID")
    .reduce((acc, p) => acc + p.amount, 0);

  const upiPaymentsTotal = payments
    .filter((p) => p.paymentStatus === "PAID" && (p.paymentMethod === "ONLINE" || p.paymentMethod === "UPI"))
    .reduce((acc, p) => acc + p.amount, 0);

  const codPaymentsTotal = payments
    .filter((p) => p.paymentStatus === "PAID" && p.paymentMethod === "COD")
    .reduce((acc, p) => acc + p.amount, 0);

  const totalPendingBalance = payments
    .filter((p) => p.paymentStatus === "PENDING")
    .reduce((acc, p) => acc + p.amount, 0);

  const blockedRetailersCount = retailers.filter((r) => r.hasPendingPaymentBlock).length;

  // 2. Deliveries
  const deliveredOrders = orders.filter((o) => o.deliveryStatus === "DELIVERED").length;
  const failedDispatches = orders.filter((o) => o.deliveryStatus === "DELIVERY_FAILED").length;
  const deliveryCompletionRate = totalOrderVolume > 0
    ? Math.round((deliveredOrders / totalOrderVolume) * 100)
    : 100;
  const onTimeDawnDispatches = deliveredOrders;

  // 3. Status Distribution
  const statusCounts: Record<string, { label: string; count: number; color: string }> = {
    DELIVERED: { label: "Delivered", count: 0, color: "#1F9D63" },
    OUT_FOR_DELIVERY: { label: "Out for Delivery", count: 0, color: "#2563EB" },
    READY_FOR_DELIVERY: { label: "Ready / Packed", count: 0, color: "#7C3AED" },
    PROCESSING: { label: "Cold Staging", count: 0, color: "#D97706" },
    CONFIRMED: { label: "Confirmed", count: 0, color: "#0D9488" },
    PLACED: { label: "Placed / Received", count: 0, color: "#64748B" },
    CANCELLED: { label: "Cancelled", count: 0, color: "#DC2626" },
  };

  orders.forEach((o) => {
    if (statusCounts[o.orderStatus]) {
      statusCounts[o.orderStatus].count++;
    }
  });

  const statusDistribution: StatusDistributionItem[] = Object.entries(statusCounts).map(
    ([status, data]) => ({
      status,
      label: data.label,
      count: data.count,
      percentage: totalOrderVolume > 0 ? Math.round((data.count / totalOrderVolume) * 100) : 0,
      color: data.color,
    })
  );

  // 4. Daily Trends (Last 7 Days)
  const dailyTrends: TimeTrendPoint[] = [
    { period: "2026-10-25", label: "25 Oct (Sun)", orderCount: 38, orderValue: 54200, paymentsCollected: 49000, pendingAmount: 5200 },
    { period: "2026-10-26", label: "26 Oct (Mon)", orderCount: 44, orderValue: 62800, paymentsCollected: 58000, pendingAmount: 4800 },
    { period: "2026-10-27", label: "27 Oct (Tue)", orderCount: 42, orderValue: 59400, paymentsCollected: 55000, pendingAmount: 4400 },
    { period: "2026-10-28", label: "28 Oct (Wed)", orderCount: 46, orderValue: 65100, paymentsCollected: 61000, pendingAmount: 4100 },
    { period: "2026-10-29", label: "29 Oct (Thu)", orderCount: 45, orderValue: 63900, paymentsCollected: 59500, pendingAmount: 4400 },
    { period: "2026-10-30", label: "30 Oct (Fri)", orderCount: 48, orderValue: 68400, paymentsCollected: 64000, pendingAmount: 4400 },
    { period: "2026-10-31", label: "31 Oct (Sat)", orderCount: 52, orderValue: 74200, paymentsCollected: 68000, pendingAmount: 6200 },
  ];

  // 5. Weekly Trends
  const weeklyTrends: TimeTrendPoint[] = [
    { period: "W40", label: "Week 40 (01-07 Oct)", orderCount: 280, orderValue: 395000, paymentsCollected: 370000, pendingAmount: 25000 },
    { period: "W41", label: "Week 41 (08-14 Oct)", orderCount: 310, orderValue: 438000, paymentsCollected: 410000, pendingAmount: 28000 },
    { period: "W42", label: "Week 42 (15-21 Oct)", orderCount: 325, orderValue: 462000, paymentsCollected: 435000, pendingAmount: 27000 },
    { period: "W43", label: "Week 43 (22-28 Oct)", orderCount: 335, orderValue: 479000, paymentsCollected: 455000, pendingAmount: 24000 },
    { period: "W44", label: "Week 44 (29-31 Oct)", orderCount: 145, orderValue: 206500, paymentsCollected: 191500, pendingAmount: 15000 },
  ];

  // 6. Monthly Trends
  const monthlyTrends: TimeTrendPoint[] = [
    { period: "2026-07", label: "Jul 2026", orderCount: 1120, orderValue: 1580000, paymentsCollected: 1510000, pendingAmount: 70000 },
    { period: "2026-08", label: "Aug 2026", orderCount: 1205, orderValue: 1710000, paymentsCollected: 1640000, pendingAmount: 70000 },
    { period: "2026-09", label: "Sep 2026", orderCount: 1240, orderValue: 1765000, paymentsCollected: 1690000, pendingAmount: 75000 },
    { period: "2026-10", label: "Oct 2026 (MTD)", orderCount: 1395, orderValue: 1980500, paymentsCollected: 1861500, pendingAmount: 119000 },
  ];

  // 7. Top Products
  const topProducts: TopProductAnalytics[] = [
    {
      productId: "prod-001",
      productName: "Gir Cow A2 Milk 1L Pouch",
      category: "Fresh Milk",
      packSize: "1 Liter Pouch",
      unitsSold: 12450,
      totalRevenue: 846600,
      stockStatus: "In Stock",
    },
    {
      productId: "prod-002",
      productName: "Buffalo Full Cream Milk 1L",
      category: "Fresh Milk",
      packSize: "1 Liter Pouch",
      unitsSold: 9800,
      totalRevenue: 735000,
      stockStatus: "In Stock",
    },
    {
      productId: "prod-005",
      productName: "Fresh Malai Paneer 1kg",
      category: "Fresh Paneer",
      packSize: "1 kg Vacuum Pack",
      unitsSold: 840,
      totalRevenue: 302400,
      stockStatus: "In Stock",
    },
    {
      productId: "prod-003",
      productName: "Artisanal A2 Gir Cow Ghee 500ml",
      category: "Pure Ghee",
      packSize: "500 ml Glass Jar",
      unitsSold: 320,
      totalRevenue: 288000,
      stockStatus: "Limited Stock",
    },
    {
      productId: "prod-004",
      productName: "Natural Cow Dahi / Curd 1kg",
      category: "Curd & Buttermilk",
      packSize: "1 kg Tub",
      unitsSold: 1650,
      totalRevenue: 132000,
      stockStatus: "In Stock",
    },
  ];

  // 8. Top Retailers
  const topRetailers: TopRetailerAnalytics[] = retailers.slice(0, 6).map((r) => ({
    retailerId: r.id,
    shopName: r.businessName,
    ownerName: r.ownerName,
    area: r.area,
    orderCount: r.totalOrdersCount,
    totalBilledValue: r.totalBilledValue,
    totalPaid: r.totalPaymentsReceived,
    pendingBalance: r.outstandingBalance,
    settlementRate: r.totalBilledValue > 0
      ? Math.round((r.totalPaymentsReceived / r.totalBilledValue) * 100)
      : 100,
  }));

  return {
    dateRange: range,
    totalOrderVolume,
    totalOrderValue,
    totalPaymentsCollected,
    upiPaymentsTotal,
    codPaymentsTotal,
    totalPendingBalance,
    blockedRetailersCount,
    deliveryCompletionRate,
    onTimeDawnDispatches,
    failedDispatches,
    statusDistribution,
    dailyTrends,
    weeklyTrends,
    monthlyTrends,
    topProducts,
    topRetailers,
  };
}

/**
 * Generate CSV export text for Operations Analytics
 */
export function generateOperationsCsv(summary: OperationsAnalyticsSummary): string {
  const lines: string[] = [
    `"YOG MILK — AUDITED OPERATIONS REPORT (NON-GST AGRICULTURAL DAIRY)"`,
    `"Export Timestamp","${new Date().toISOString()}"`,
    `"FSSAI License","#11524022000189"`,
    `""`,
    `"EXECUTIVE FINANCIAL SUMMARY"`,
    `"Metric","Value"`,
    `"Total Order Volume","${summary.totalOrderVolume} Orders"`,
    `"Total Order Value (INR)","Rs. ${summary.totalOrderValue.toFixed(2)}"`,
    `"Total Payments Collected (INR)","Rs. ${summary.totalPaymentsCollected.toFixed(2)}"`,
    `"UPI Payments (INR)","Rs. ${summary.upiPaymentsTotal.toFixed(2)}"`,
    `"Driver COD Payments (INR)","Rs. ${summary.codPaymentsTotal.toFixed(2)}"`,
    `"Outstanding Due (INR)","Rs. ${summary.totalPendingBalance.toFixed(2)}"`,
    `"Blocked Retailers (Rule 4.4)","${summary.blockedRetailersCount}"`,
    `"Delivery Completion Rate","${summary.deliveryCompletionRate}%"`,
    `""`,
    `"TOP PRODUCT PERFORMANCE"`,
    `"Product ID","Product Name","Category","Pack Size","Units Sold","Revenue (INR)"`,
    ...summary.topProducts.map(
      (p) =>
        `"${p.productId}","${p.productName}","${p.category}","${p.packSize}",${p.unitsSold},${p.totalRevenue.toFixed(2)}`
    ),
    `""`,
    `"TOP RETAILER PERFORMANCE"`,
    `"Retailer ID","Shop Name","Owner","Area","Orders","Billed (INR)","Paid (INR)","Pending (INR)","Settlement %"`,
    ...summary.topRetailers.map(
      (r) =>
        `"${r.retailerId}","${r.shopName}","${r.ownerName}","${r.area}",${r.orderCount},${r.totalBilledValue.toFixed(2)},${r.totalPaid.toFixed(2)},${r.pendingBalance.toFixed(2)},${r.settlementRate}%`
    ),
  ];
  return lines.join("\n");
}
