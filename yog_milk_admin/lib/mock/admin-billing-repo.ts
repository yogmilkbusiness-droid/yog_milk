import { PaymentRecord, RecordCashPaymentParams } from "../contracts/payment";
import { CommercialInvoice } from "../contracts/invoice";
import { getMockOrders, saveMockOrders } from "./admin-orders-repo";
import { getMockRetailers, saveMockRetailers } from "./admin-retailers";

export const INITIAL_MOCK_PAYMENTS: PaymentRecord[] = [
  // 0. Primary Benchmark Payment: Om Sai Dairy & Sweets (Rule 4.4 Blocked Account)
  {
    id: "PAY-2026-8841",
    orderId: "ord-8841",
    orderCode: "YM-2026-8841",
    consignmentId: "YMD-2026-8841",
    retailerId: "ret-001",
    retailerBusinessName: "Om Sai Dairy & Sweets",
    retailerOwnerName: "Ramesh Patil",
    retailerPhone: "+91 98220 12345",
    retailerArea: "Kothrud, Pune",
    amount: 2450,
    paymentMethod: "COD",
    paymentStatus: "PENDING",
    recordedAt: "Today, 05:30 AM",
    dateKey: "today",
    overdueDays: 1,
    hasPendingPaymentBlock: true,
    notes: "Driver cash collection pending for Order #YM-2026-8841. Enforces Rule 4.4 checkout block until settled.",
  },

  // 1. Sharma General Store (Rule 4.4 Blocked Account)
  {
    id: "PAY-2026-000145",
    orderId: "ord-2026-000145",
    orderCode: "YM-2026-000145",
    consignmentId: "YMD-2026-000145",
    retailerId: "ret-03",
    retailerBusinessName: "Sharma General Store",
    retailerOwnerName: "Rajesh Sharma",
    retailerPhone: "+91 98221 44102",
    retailerArea: "Gangapur Road, Nashik",
    amount: 4900,
    paymentMethod: "COD",
    paymentStatus: "PENDING",
    recordedAt: "Today, 06:20 AM",
    dateKey: "today",
    overdueDays: 1,
    hasPendingPaymentBlock: true,
    notes: "Driver collection pending upon morning consignment delivery.",
  },

  // 2. Godavari Dairy Corner (Paid Razorpay)
  {
    id: "PAY-2026-000144",
    orderId: "ord-2026-000144",
    orderCode: "YM-2026-000144",
    consignmentId: "YMD-2026-000144",
    retailerId: "ret-04",
    retailerBusinessName: "Godavari Dairy Corner",
    retailerOwnerName: "Santosh Deshmukh",
    retailerPhone: "+91 94222 89012",
    retailerArea: "College Road, Nashik",
    amount: 5880,
    paymentMethod: "ONLINE",
    paymentStatus: "PAID",
    transactionReference: "TXN-RZP-20261029-4412",
    recordedAt: "Today, 06:18 AM",
    dateKey: "today",
    notes: "Razorpay simulated checkout settlement confirmed.",
  },

  // 3. Shree Krishna Milk Centre (Paid Razorpay)
  {
    id: "PAY-2026-000142",
    orderId: "ord-2026-000142",
    orderCode: "YM-2026-000142",
    consignmentId: "YMD-2026-000142",
    retailerId: "ret-01",
    retailerBusinessName: "Shree Krishna Milk Centre",
    retailerOwnerName: "Gopal Rathi",
    retailerPhone: "+91 98220 12345",
    retailerArea: "Hadapsar, Pune",
    amount: 5500,
    paymentMethod: "ONLINE",
    paymentStatus: "PAID",
    transactionReference: "TXN-RZP-20261029-1904",
    recordedAt: "Today, 06:15 AM",
    dateKey: "today",
    notes: "Simulated online gateway settlement.",
  },

  // 4. Om Sai Dairy (Online webhook verifying)
  {
    id: "PAY-2026-000141",
    orderId: "ord-2026-000141",
    orderCode: "YM-2026-000141",
    consignmentId: "YMD-2026-000141",
    retailerId: "ret-02",
    retailerBusinessName: "Om Sai Dairy & Sweets",
    retailerOwnerName: "Mahesh Patil",
    retailerPhone: "+91 98221 23456",
    retailerArea: "Kothrud, Pune",
    amount: 3500,
    paymentMethod: "ONLINE",
    paymentStatus: "PROCESSING",
    transactionReference: "TXN-RZP-PENDING-WEBHOOK",
    recordedAt: "Today, 06:05 AM",
    dateKey: "today",
    notes: "Awaiting bank gateway callback confirmation.",
  },

  // 5. Panchavati Retail (COD Pending)
  {
    id: "PAY-2026-000140",
    orderId: "ord-2026-000140",
    orderCode: "YM-2026-000140",
    consignmentId: "YMD-2026-000140",
    retailerId: "ret-05",
    retailerBusinessName: "Panchavati Retail & Provisions",
    retailerOwnerName: "Dattatraya Shinde",
    retailerPhone: "+91 98901 32111",
    retailerArea: "Old City, Nashik",
    amount: 3200,
    paymentMethod: "COD",
    paymentStatus: "PENDING",
    recordedAt: "Today, 05:50 AM",
    dateKey: "today",
    overdueDays: 1,
    hasPendingPaymentBlock: true,
    notes: "Physical cash collection pending at dawn shutter.",
  },

  // 6. Godavari Dairy (Paid Online)
  {
    id: "PAY-2026-000139",
    orderId: "ord-2026-000139",
    orderCode: "YM-2026-000139",
    consignmentId: "YMD-2026-000139",
    retailerId: "ret-04",
    retailerBusinessName: "Godavari Dairy Corner",
    retailerOwnerName: "Santosh Deshmukh",
    retailerPhone: "+91 94222 89012",
    retailerArea: "College Road, Nashik",
    amount: 5100,
    paymentMethod: "ONLINE",
    paymentStatus: "PAID",
    transactionReference: "TXN-RZP-20261029-8801",
    recordedAt: "Today, 05:30 AM",
    dateKey: "today",
    notes: "Cleared in central bank vault.",
  },

  // 7. Panchavati Retail (COD Recorded by Admin)
  {
    id: "PAY-2026-000138",
    orderId: "ord-2026-000138",
    orderCode: "YM-2026-000138",
    consignmentId: "YMD-2026-000138",
    retailerId: "ret-05",
    retailerBusinessName: "Panchavati Retail & Provisions",
    retailerOwnerName: "Dattatraya Shinde",
    retailerPhone: "+91 98901 32111",
    retailerArea: "Old City, Nashik",
    amount: 2550,
    paymentMethod: "COD",
    paymentStatus: "PAID",
    recordedByAdminId: "admin-01",
    recordedByAdminName: "Vikram Mehta (Operations Lead)",
    receiptNumber: "VAULT-REC-2026-081",
    recordedAt: "Today, 06:25 AM",
    dateKey: "today",
    notes: "Cash handed to driver Raju B. Reconciled in vault by Admin Vikram Mehta.",
  },

  // 8. Anand Sweets (Delivery Failed / Cash Pending)
  {
    id: "PAY-2026-000136",
    orderId: "ord-2026-000136",
    orderCode: "YM-2026-000136",
    consignmentId: "YMD-2026-000136",
    retailerId: "ret-06",
    retailerBusinessName: "Anand Sweets & Milk Bar",
    retailerOwnerName: "Anand Joshi",
    retailerPhone: "+91 97630 11984",
    retailerArea: "MG Road, Pune",
    amount: 4340,
    paymentMethod: "COD",
    paymentStatus: "PENDING",
    recordedAt: "Today, 04:30 AM",
    dateKey: "today",
    overdueDays: 2,
    hasPendingPaymentBlock: true,
    notes: "Delivery drop failed due to closed shutter. Payment unresolved.",
  },

  // 9. Om Sai Dairy (Cancelled / Refunded)
  {
    id: "PAY-2026-000135",
    orderId: "ord-2026-000135",
    orderCode: "YM-2026-000135",
    consignmentId: "YMD-2026-000135",
    retailerId: "ret-02",
    retailerBusinessName: "Om Sai Dairy & Sweets",
    retailerOwnerName: "Mahesh Patil",
    retailerPhone: "+91 98221 23456",
    retailerArea: "Kothrud, Pune",
    amount: 1700,
    paymentMethod: "ONLINE",
    paymentStatus: "REFUNDED",
    transactionReference: "REF-UPI-20261028-1002",
    recordedAt: "Yesterday, 07:35 PM",
    dateKey: "yesterday",
    notes: "Refund processed to original source account after order cancellation.",
  },

  // 10. Shree Krishna Milk Centre (Yesterday Paid)
  {
    id: "PAY-2026-000134",
    orderId: "ord-2026-000134",
    orderCode: "YM-2026-000134",
    consignmentId: "YMD-2026-000134",
    retailerId: "ret-01",
    retailerBusinessName: "Shree Krishna Milk Centre",
    retailerOwnerName: "Gopal Rathi",
    retailerPhone: "+91 98220 12345",
    retailerArea: "Hadapsar, Pune",
    amount: 5100,
    paymentMethod: "ONLINE",
    paymentStatus: "PAID",
    transactionReference: "TXN-RZP-20261028-3312",
    recordedAt: "Yesterday, 05:40 AM",
    dateKey: "yesterday",
    notes: "Settled in daily morning clearing.",
  },
];

export const INITIAL_MOCK_INVOICES: CommercialInvoice[] = [
  // 0. Primary Benchmark Invoice: Om Sai Dairy & Sweets (INV-2026-1049)
  {
    invoiceNumber: "INV-2026-1049",
    invoiceDate: "Today, 05:30 AM",
    orderId: "ord-8841",
    orderCode: "YM-2026-8841",
    firmName: "YOG MILK",
    firmTagline: "From Nature to Nourish You",
    firmAddress: "Cold-Chain Hub, Trimbak Road, Nashik Rural, Maharashtra 422002",
    fssaiNumber: "11524022000189",
    retailerId: "ret-001",
    retailerBusinessName: "Om Sai Dairy & Sweets",
    retailerOwnerName: "Ramesh Patil",
    retailerAddress: "Shop No. 4, Anand Nagar, Paud Road, Kothrud, Pune 411038",
    retailerArea: "Kothrud, Pune",
    retailerPhone: "+91 98220 12345",
    retailerFssai: "FSSAI 11523038000142",
    items: [
      {
        productId: "prod-001",
        productName: "Gir Cow Full Cream Milk 1L",
        packSize: "1L Pouch",
        quantity: 24,
        crateCount: 2,
        unitPrice: 68,
        lineTotal: 1632,
      },
      {
        productId: "prod-003",
        productName: "Fresh Malai Paneer 1kg",
        packSize: "1kg Vacuum Pack",
        quantity: 2,
        crateCount: 1,
        unitPrice: 380,
        lineTotal: 760,
      },
    ],
    subtotal: 2392,
    deliveryCharge: 58,
    totalPayable: 2450,
    amountReceived: 0,
    balanceDue: 2450,
    paymentMethod: "COD",
    paymentStatus: "PENDING",
    dispatchRouteName: "Route 2 - Kothrud & Paud (Van #02)",
    dispatchSlot: "05:00 AM - 08:00 AM",
    billTitle: "Commercial Invoice / Delivery Memo",
    isGstExempt: true,
    version: "v1 Original",
    ledgerHash: "sha256:7f0c1a89b4e2d781f33c90e54b12a812",
  },
  // 1. Invoice 492: Sharma General Store (Pending COD)
  {
    invoiceNumber: "INV-2026-0492",
    invoiceDate: "Today, 06:20 AM",
    orderId: "ord-2026-000145",
    orderCode: "YM-2026-000145",
    firmName: "YOG MILK",
    firmTagline: "From Nature to Nourish You",
    firmAddress: "Cold-Chain Hub, Trimbak Road, Nashik Rural, Maharashtra 422002",
    fssaiNumber: "11524022000189",
    retailerId: "ret-03",
    retailerBusinessName: "Sharma General Store",
    retailerOwnerName: "Rajesh Sharma",
    retailerAddress: "Shop 12, Gangapur Rd, Nashik - 422005",
    retailerArea: "Gangapur Road, Nashik",
    retailerPhone: "+91 98221 44102",
    retailerFssai: "FSSAI 21522026000412",
    items: [
      {
        productId: "prod-01",
        productName: "Gir Cow A2 Milk 1L Pouch",
        packSize: "Pack of 20",
        quantity: 40,
        crateCount: 2,
        unitPrice: 85,
        lineTotal: 3400,
        specs: "A2 Gir Cow Dawn Harvest · Chilled 3.2°C",
      },
      {
        productId: "prod-03",
        productName: "Pure Vedic A2 Bilona Ghee 500ml",
        packSize: "500ml Glass Jar",
        quantity: 2,
        crateCount: 1,
        unitPrice: 750,
        lineTotal: 1500,
        specs: "Hand-churned wooden bilona",
      },
    ],
    subtotal: 4900,
    deliveryCharge: 0,
    totalPayable: 4900,
    amountReceived: 0,
    balanceDue: 4900,
    paymentMethod: "COD",
    paymentStatus: "PENDING",
    paymentSettlementNote: "Cash collection pending at doorstep. Rule 4.4 restriction active.",
    isGstExempt: true,
    billTitle: "Commercial Invoice / Delivery Memo",
    version: "v1 (Original)",
    dispatchRouteName: "Route 2: Gangapur Road & College Road",
    dispatchSlot: "Dawn 05:30 – 07:00 AM",
    ledgerHash: "SHA256: 8a4c91ef...39b1",
  },

  // 2. Invoice 491: Godavari Dairy Corner (Paid)
  {
    invoiceNumber: "INV-2026-0491",
    invoiceDate: "Today, 06:18 AM",
    orderId: "ord-2026-000144",
    orderCode: "YM-2026-000144",
    firmName: "YOG MILK",
    firmTagline: "From Nature to Nourish You",
    firmAddress: "Cold-Chain Hub, Trimbak Road, Nashik Rural, Maharashtra 422002",
    fssaiNumber: "11524022000189",
    retailerId: "ret-04",
    retailerBusinessName: "Godavari Dairy Corner",
    retailerOwnerName: "Santosh Deshmukh",
    retailerAddress: "Near Big Bazaar, College Rd, Nashik - 422005",
    retailerArea: "College Road, Nashik",
    retailerPhone: "+91 94222 89012",
    retailerFssai: "FSSAI 21522026000499",
    items: [
      {
        productId: "prod-02",
        productName: "Buffalo Full Cream Milk 1L",
        packSize: "Pack of 20",
        quantity: 60,
        crateCount: 3,
        unitPrice: 70,
        lineTotal: 4200,
        specs: "Buffalo Full Cream 6.2% FAT",
      },
      {
        productId: "prod-05",
        productName: "Fresh Soft Malai Paneer 1kg",
        packSize: "1kg Vacuum Block",
        quantity: 4,
        crateCount: 1,
        unitPrice: 420,
        lineTotal: 1680,
      },
    ],
    subtotal: 5880,
    deliveryCharge: 0,
    totalPayable: 5880,
    amountReceived: 5880,
    balanceDue: 0,
    paymentMethod: "ONLINE",
    paymentStatus: "PAID",
    paymentSettlementNote: "Settled via Razorpay UPI (TXN-RZP-20261029-4412).",
    isGstExempt: true,
    billTitle: "Commercial Invoice / Delivery Memo",
    version: "v1 (Original)",
    dispatchRouteName: "Route 2: Gangapur Road & College Road",
    dispatchSlot: "Dawn 05:30 – 07:00 AM",
    ledgerHash: "SHA256: 4e91bc77...a812",
  },

  // 3. Invoice 489: Shree Krishna Milk Centre (Paid)
  {
    invoiceNumber: "INV-2026-0489",
    invoiceDate: "Today, 06:15 AM",
    orderId: "ord-2026-000142",
    orderCode: "YM-2026-000142",
    firmName: "YOG MILK",
    firmTagline: "From Nature to Nourish You",
    firmAddress: "Cold-Chain Hub, Trimbak Road, Nashik Rural, Maharashtra 422002",
    fssaiNumber: "11524022000189",
    retailerId: "ret-01",
    retailerBusinessName: "Shree Krishna Milk Centre",
    retailerOwnerName: "Gopal Rathi",
    retailerAddress: "Shop 4, Hadapsar Gadital Market, Pune - 411028",
    retailerArea: "Hadapsar, Pune",
    retailerPhone: "+91 98220 12345",
    retailerFssai: "FSSAI 21522026000118",
    items: [
      {
        productId: "prod-01",
        productName: "Gir Cow A2 Milk 1L Pouch",
        packSize: "Pack of 20",
        quantity: 40,
        crateCount: 4,
        unitPrice: 85,
        lineTotal: 3400,
      },
      {
        productId: "prod-05",
        productName: "Fresh Soft Malai Paneer 1kg",
        packSize: "1kg Block",
        quantity: 5,
        crateCount: 1,
        unitPrice: 420,
        lineTotal: 2100,
      },
    ],
    subtotal: 5500,
    deliveryCharge: 0,
    totalPayable: 5500,
    amountReceived: 5500,
    balanceDue: 0,
    paymentMethod: "ONLINE",
    paymentStatus: "PAID",
    paymentSettlementNote: "Settled via Online Gateway (TXN-RZP-20261029-1904).",
    isGstExempt: true,
    billTitle: "Commercial Invoice / Delivery Memo",
    version: "v1 (Original)",
    dispatchRouteName: "Route 5: Hadapsar Gadital & Magarpatta (Pune)",
    dispatchSlot: "Dawn 05:30 – 07:00 AM",
    ledgerHash: "SHA256: 7f3310aa...190c",
  },

  // 4. Invoice 485: Panchavati Retail & Provisions (Paid Cash)
  {
    invoiceNumber: "INV-2026-0485",
    invoiceDate: "Today, 05:15 AM",
    orderId: "ord-2026-000138",
    orderCode: "YM-2026-000138",
    firmName: "YOG MILK",
    firmTagline: "From Nature to Nourish You",
    firmAddress: "Cold-Chain Hub, Trimbak Road, Nashik Rural, Maharashtra 422002",
    fssaiNumber: "11524022000189",
    retailerId: "ret-05",
    retailerBusinessName: "Panchavati Retail & Provisions",
    retailerOwnerName: "Dattatraya Shinde",
    retailerAddress: "Panchavati Karanja, Nashik - 422003",
    retailerArea: "Old City, Nashik",
    retailerPhone: "+91 98901 32111",
    retailerFssai: "FSSAI 21522026000302",
    items: [
      {
        productId: "prod-01",
        productName: "Gir Cow A2 Milk 1L Pouch",
        packSize: "Pack of 20",
        quantity: 30,
        crateCount: 3,
        unitPrice: 85,
        lineTotal: 2550,
      },
    ],
    subtotal: 2550,
    deliveryCharge: 0,
    totalPayable: 2550,
    amountReceived: 2550,
    balanceDue: 0,
    paymentMethod: "COD",
    paymentStatus: "PAID",
    paymentSettlementNote: "Physical cash collected by Driver Raju B. Vault Receipt: VAULT-REC-2026-081.",
    isGstExempt: true,
    billTitle: "Commercial Invoice / Delivery Memo",
    version: "v1 (Original)",
    dispatchRouteName: "Route 1: Panchavati Hub & Dindori Road",
    dispatchSlot: "Dawn 05:30 – 07:00 AM",
    ledgerHash: "SHA256: 2a9918bc...661f",
  },

  // 5. Invoice 482: Om Sai Dairy (Voided)
  {
    invoiceNumber: "INV-2026-0482",
    invoiceDate: "Yesterday, 06:10 PM",
    orderId: "ord-2026-000135",
    orderCode: "YM-2026-000135",
    firmName: "YOG MILK",
    firmTagline: "From Nature to Nourish You",
    firmAddress: "Cold-Chain Hub, Trimbak Road, Nashik Rural, Maharashtra 422002",
    fssaiNumber: "11524022000189",
    retailerId: "ret-02",
    retailerBusinessName: "Om Sai Dairy & Sweets",
    retailerOwnerName: "Mahesh Patil",
    retailerAddress: "Near Karve Statue, Kothrud, Pune - 411038",
    retailerArea: "Kothrud, Pune",
    retailerPhone: "+91 98221 23456",
    retailerFssai: "FSSAI 21522026000234",
    items: [
      {
        productId: "prod-01",
        productName: "Gir Cow A2 Milk 1L Pouch",
        packSize: "Pack of 20",
        quantity: 20,
        crateCount: 2,
        unitPrice: 85,
        lineTotal: 1700,
      },
    ],
    subtotal: 1700,
    deliveryCharge: 0,
    totalPayable: 1700,
    amountReceived: 0,
    balanceDue: 0,
    paymentMethod: "ONLINE",
    paymentStatus: "VOIDED",
    paymentSettlementNote: "Voided due to order cancellation before dawn run. Refund REF-UPI-20261028-1002.",
    isGstExempt: true,
    billTitle: "Commercial Invoice / Delivery Memo",
    version: "v1 (Cancelled Void)",
    dispatchRouteName: "Route 3: Kothrud & Deccan Gymkhana (Pune)",
    dispatchSlot: "Dawn 05:30 – 07:00 AM",
    ledgerHash: "SHA256: ee014491...99bc",
  },
];

const PAYMENTS_STORAGE_KEY = "yog_milk_admin_mock_payments_v2";
const INVOICES_STORAGE_KEY = "yog_milk_admin_mock_invoices_v2";

export function getMockPayments(): PaymentRecord[] {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(PAYMENTS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
  }
  return INITIAL_MOCK_PAYMENTS;
}

export function saveMockPayments(payments: PaymentRecord[]): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(payments));
    } catch {
      // ignore
    }
  }
}

export function getMockInvoices(): CommercialInvoice[] {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(INVOICES_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
  }
  return INITIAL_MOCK_INVOICES;
}

export function saveMockInvoices(invoices: CommercialInvoice[]): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify(invoices));
    } catch {
      // ignore
    }
  }
}

export function recordManualCashPayment(params: RecordCashPaymentParams): PaymentRecord | null {
  const payments = getMockPayments();
  const paymentIndex = payments.findIndex((p) => p.orderId === params.orderId);
  if (paymentIndex === -1) return null;

  const currentPayment = payments[paymentIndex];
  const updatedPayment: PaymentRecord = {
    ...currentPayment,
    paymentStatus: "PAID",
    paymentMethod: params.paymentMethod,
    amount: params.amountCollected,
    recordedByAdminId: params.adminId,
    recordedByAdminName: params.adminName,
    receiptNumber: params.receiptNumber || `VAULT-REC-${Date.now().toString().slice(-4)}`,
    notes: params.notes,
    hasPendingPaymentBlock: false,
    recordedAt: "Just now",
  };

  payments[paymentIndex] = updatedPayment;
  saveMockPayments(payments);

  // 1. Sync Linked Order
  const orders = getMockOrders();
  const orderIndex = orders.findIndex((o) => o.id === params.orderId);
  if (orderIndex !== -1) {
    orders[orderIndex] = {
      ...orders[orderIndex],
      paymentStatus: "PAID",
      paymentMethod: params.paymentMethod === "COD" ? "COD" : "ONLINE",
      statusHistory: [
        {
          id: `hist-pay-${Date.now()}`,
          fromStatus: "PENDING",
          toStatus: "PAID",
          statusType: "PAYMENT",
          timestamp: "Just now",
          adminId: params.adminId,
          adminName: params.adminName,
          notes: `Offline payment of ₹${params.amountCollected.toFixed(2)} recorded. Receipt: ${updatedPayment.receiptNumber}`,
        },
        ...(orders[orderIndex].statusHistory || []),
      ],
    };
    saveMockOrders(orders);
  }

  // 2. Sync Linked Invoice
  const invoices = getMockInvoices();
  const invoiceIndex = invoices.findIndex((inv) => inv.orderId === params.orderId);
  if (invoiceIndex !== -1) {
    invoices[invoiceIndex] = {
      ...invoices[invoiceIndex],
      paymentStatus: "PAID",
      amountReceived: params.amountCollected,
      balanceDue: 0,
      paymentSettlementNote: `Physical cash collection verified by ${params.adminName}. Receipt: ${updatedPayment.receiptNumber}`,
    };
    saveMockInvoices(invoices);
  }

  // 3. Reconcile Retailer (Outstanding balance & Rule 4.4 Block release)
  const retailers = getMockRetailers();
  const retIndex = retailers.findIndex((r) => r.id === currentPayment.retailerId);
  if (retIndex !== -1) {
    const retailer = retailers[retIndex];
    const newOutstanding = Math.max(0, retailer.outstandingBalance - params.amountCollected);

    // Check if retailer has any other pending payments
    const otherPending = payments.filter(
      (p) =>
        p.retailerId === currentPayment.retailerId &&
        p.orderId !== params.orderId &&
        p.paymentStatus === "PENDING"
    );

    const updatedRetailer = {
      ...retailer,
      outstandingBalance: newOutstanding,
      totalPaymentsReceived: retailer.totalPaymentsReceived + params.amountCollected,
      hasPendingPaymentBlock: otherPending.length > 0,
      lastPaymentDate: "Today",
      lastPaymentAmount: params.amountCollected,
      lastPaymentMethod: params.paymentMethod,
      timeline: [
        {
          id: `tl-pay-${Date.now()}`,
          timestamp: "Just now",
          title: `Payment Received: ₹${params.amountCollected.toFixed(2)} (${params.paymentMethod})`,
          description: `Voucher: ${updatedPayment.receiptNumber}. Verified by ${params.adminName}. ${
            otherPending.length === 0 ? "Rule 4.4 ordering restriction released." : ""
          }`,
          actor: params.adminName,
          actorRole: "Operations Lead",
          category: "PAYMENT" as const,
        },
        ...retailer.timeline,
      ],
    };

    retailers[retIndex] = updatedRetailer;
    saveMockRetailers(retailers);
  }

  return updatedPayment;
}

