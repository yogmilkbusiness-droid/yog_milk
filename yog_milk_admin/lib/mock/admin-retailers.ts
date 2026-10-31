import { Retailer, RetailerApprovalStatus } from "../contracts/retailer";

export const INITIAL_MOCK_RETAILERS: Retailer[] = [
  {
    id: "ret-03",
    accountCode: "YM-CUST-8839",
    businessName: "Sharma General Store",
    ownerName: "Rajesh Sharma",
    phone: "+91 98221 44102",
    email: "rajesh.sharma@gmail.com",
    city: "Nashik",
    area: "College Road / Gangapur",
    deliveryAddress: "Shop #4, College Road, Nashik East - 422005",
    boothNumber: "BOOTH-NK-04",
    status: "BLOCKED",
    statusNote: "Auto-blocked under Rule 4.4 due to unpaid COD order YM-2026-000140 (₹3,200.00)",
    hasPendingPaymentBlock: true,
    outstandingBalance: 3200,
    totalOrdersCount: 14,
    totalBilledValue: 32480,
    totalPaymentsReceived: 29280,
    deliveredOrdersCount: 13,
    registeredAt: "12 Feb 2025",
    verifiedAt: "14 Feb 2025",
    verifiedBy: "Priya Deshmukh (Super Admin)",
    assignedRouteId: "ROUTE-04-NASHIK-EAST",
    assignedRouteName: "Route 4 - Nashik East (Van #04)",
    deliverySlot: "Dawn Slot (05:30 – 07:00 AM)",
    dailyMilkDemandLiters: 40,
    fssaiNumber: "FSSAI Lic. #21526034000189",
    gstExemptNotice: "Agricultural primary dairy produce (GST Exempt under Notification 2/2017)",
    lastOrderCode: "YM-2026-000140",
    lastOrderDate: "Today, 05:50 AM",
    lastOrderAmount: 3200,
    lastPaymentDate: "Yesterday, 08:15 AM",
    lastPaymentAmount: 2290,
    lastPaymentMethod: "COD (Cash)",
    frequentProducts: [
      {
        productId: "prod-01",
        name: "Gir Cow A2 Milk 1L Pouch",
        packSize: "1L Pouch",
        category: "Milk Pouches",
        avgDailyUnits: 20,
        highlightTag: "6.0% Fat Gir Cow Milk",
      },
      {
        productId: "prod-05",
        name: "Fresh Dahi 400g Tub",
        packSize: "400g Tub",
        category: "Fresh Curd",
        avgDailyUnits: 12,
        highlightTag: "Clay Set · Slow Ferment",
      },
      {
        productId: "prod-04",
        name: "Pure Bilona Ghee 1L Glass Jar",
        packSize: "1L Jar",
        category: "Ghee Jars",
        avgDailyUnits: 2,
        highlightTag: "A2 Churned Batch",
      },
      {
        productId: "prod-03",
        name: "Fresh Malai Paneer 1kg Vacuum Pack",
        packSize: "1kg Block",
        category: "Artisanal Paneer",
        avgDailyUnits: 3,
        highlightTag: "Zero Preservative",
      },
    ],
    documents: [
      {
        id: "doc-01",
        title: "FSSAI Registration Certificate",
        documentType: "FSSAI_LICENSE",
        fileNumber: "FSSAI-21526034000189",
        status: "VERIFIED",
        verifiedAt: "14 Feb 2025",
      },
      {
        id: "doc-02",
        title: "Shop & Establishment Act Gumasta License",
        documentType: "SHOP_ESTABLISHMENT",
        fileNumber: "GUMASTA-NK-4410",
        status: "VERIFIED",
        verifiedAt: "14 Feb 2025",
      },
      {
        id: "doc-03",
        title: "Storefront & Refrigerator Photo",
        documentType: "STOREFRONT_PHOTO",
        status: "VERIFIED",
        verifiedAt: "14 Feb 2025",
      },
    ],
    timeline: [
      {
        id: "tl-01",
        timestamp: "Today, 05:52 AM",
        title: "Rule 4.4 Checkout Block Enacted",
        description: "Retailer attempted cart submission; auto-blocked because COD order YM-2026-000140 (₹3,200) is pending settlement.",
        actor: "System Rule Engine",
        actorRole: "Automated Policy",
        category: "SECURITY",
      },
      {
        id: "tl-02",
        timestamp: "Today, 05:50 AM",
        title: "Bulk Order YM-2026-000140 Placed",
        description: "Placed order for 20L Gir Cow Milk + 2 jars Bilona Ghee totaling ₹3,200.00 via Cash on Delivery.",
        actor: "Rajesh Sharma",
        actorRole: "Retailer App",
        category: "ORDER",
      },
      {
        id: "tl-03",
        timestamp: "Yesterday, 08:15 AM",
        title: "Manual COD Payment Recorded",
        description: "Snehal Kulkarni verified and recorded physical cash collection of ₹2,290.00 for order YM-2026-000118.",
        actor: "Snehal Kulkarni",
        actorRole: "Accounts Executive",
        category: "PAYMENT",
      },
      {
        id: "tl-04",
        timestamp: "Yesterday, 06:10 AM",
        title: "Order YM-2026-000118 Delivered",
        description: "Delivery completed by driver Suresh K. on Route 4. 2 crates returned in good condition.",
        actor: "Suresh K.",
        actorRole: "Delivery Sahayak",
        category: "DELIVERY",
      },
    ],
  },
  {
    id: "ret-01",
    accountCode: "YM-CUST-1042",
    businessName: "Shree Krishna Milk Centre",
    ownerName: "Ramesh Jadhav",
    phone: "+91 98220 12345",
    email: "ramesh.jadhav@gmail.com",
    city: "Pune",
    area: "Hadapsar",
    deliveryAddress: "Shop 4, Hadapsar Gadital Market, Pune - 411028",
    boothNumber: "BOOTH-PN-11",
    status: "APPROVED",
    hasPendingPaymentBlock: false,
    outstandingBalance: 0,
    totalOrdersCount: 42,
    totalBilledValue: 124500,
    totalPaymentsReceived: 124500,
    deliveredOrdersCount: 41,
    registeredAt: "10 Jan 2025",
    verifiedAt: "11 Jan 2025",
    verifiedBy: "Vikram Mehta (Ops Lead)",
    assignedRouteId: "ROUTE-01-HADAPSAR",
    assignedRouteName: "Route 1 - Hadapsar / Karve (Van #01)",
    deliverySlot: "Dawn Slot (05:00 – 06:30 AM)",
    dailyMilkDemandLiters: 60,
    fssaiNumber: "FSSAI Lic. #11522026000412",
    gstExemptNotice: "Agricultural primary dairy produce (GST Exempt under Notification 2/2017)",
    lastOrderCode: "YM-2026-000142",
    lastOrderDate: "Today, 06:15 AM",
    lastOrderAmount: 5500,
    lastPaymentDate: "Today, 06:16 AM",
    lastPaymentAmount: 5500,
    lastPaymentMethod: "Razorpay (UPI)",
    frequentProducts: [
      {
        productId: "prod-01",
        name: "Gir Cow A2 Milk 1L Pouch",
        packSize: "1L Pouch",
        category: "Milk Pouches",
        avgDailyUnits: 40,
        highlightTag: "Primary Fast-Mover",
      },
      {
        productId: "prod-03",
        name: "Fresh Malai Paneer 1kg Vacuum Pack",
        packSize: "1kg Block",
        category: "Artisanal Paneer",
        avgDailyUnits: 5,
        highlightTag: "Daily Counter Special",
      },
    ],
    documents: [
      {
        id: "doc-11",
        title: "FSSAI Registration Certificate",
        documentType: "FSSAI_LICENSE",
        fileNumber: "FSSAI-11522026000412",
        status: "VERIFIED",
        verifiedAt: "11 Jan 2025",
      },
    ],
    timeline: [
      {
        id: "tl-11",
        timestamp: "Today, 06:16 AM",
        title: "Online Payment Confirmed",
        description: "₹5,500 settled via Razorpay instant UPI webhook for order YM-2026-000142.",
        actor: "Payment Gateway Engine",
        actorRole: "Automated Webhook",
        category: "PAYMENT",
      },
      {
        id: "tl-12",
        timestamp: "Today, 06:15 AM",
        title: "Bulk Order YM-2026-000142 Placed",
        description: "Placed order for 40L Gir Cow Milk + 5kg Paneer totaling ₹5,500.00.",
        actor: "Ramesh Jadhav",
        actorRole: "Retailer App",
        category: "ORDER",
      },
    ],
  },
  {
    id: "ret-001",
    accountCode: "YM-CUST-8841",
    businessName: "Om Sai Dairy & Sweets",
    ownerName: "Ramesh Patil",
    phone: "+91 98220 12345",
    email: "omsai.dairy@gmail.com",
    city: "Pune",
    area: "Kothrud",
    deliveryAddress: "Shop No. 4, Anand Nagar, Paud Road, Kothrud, Pune - 411038",
    boothNumber: "BOOTH-PN-04",
    status: "APPROVED",
    statusNote: "Auto-held under Rule 4.4 due to pending COD order YM-2026-8841 (₹2,450.00)",
    hasPendingPaymentBlock: true,
    outstandingBalance: 2450,
    totalOrdersCount: 42,
    totalBilledValue: 112450,
    totalPaymentsReceived: 110000,
    deliveredOrdersCount: 41,
    registeredAt: "15 Jan 2025",
    verifiedAt: "16 Jan 2025",
    verifiedBy: "Priya Deshmukh (Super Admin)",
    assignedRouteId: "ROUTE-02-KOTHRUD",
    assignedRouteName: "Route 2 - Kothrud & Paud (Van #02)",
    deliverySlot: "Dawn Slot (05:00 – 07:00 AM)",
    dailyMilkDemandLiters: 50,
    fssaiNumber: "FSSAI Lic. #11523038000142",
    gstExemptNotice: "Agricultural primary dairy produce (GST Exempt under Notification 2/2017)",
    lastOrderCode: "YM-2026-8841",
    lastOrderDate: "Today, 05:30 AM",
    lastOrderAmount: 2450,
    lastPaymentDate: "Yesterday, 07:00 AM",
    lastPaymentAmount: 3168,
    lastPaymentMethod: "COD (Cash)",
    frequentProducts: [
      {
        productId: "prod-001",
        name: "Gir Cow Full Cream Milk 1L",
        packSize: "1L Pouch",
        category: "Fresh Milk",
        avgDailyUnits: 30,
        highlightTag: "Satara Direct A2",
      },
      {
        productId: "prod-003",
        name: "Fresh Malai Paneer 1kg",
        packSize: "1kg Vacuum Pack",
        category: "Fresh Paneer",
        avgDailyUnits: 4,
        highlightTag: "Daily Counter Special",
      },
    ],
    documents: [
      {
        id: "doc-01",
        title: "FSSAI Food Safety License",
        documentType: "FSSAI_LICENSE",
        fileNumber: "FSSAI-11523038000142",
        status: "VERIFIED",
        verifiedAt: "16 Jan 2025",
      },
      {
        id: "doc-02",
        title: "Shop Establishment Act Certificate",
        documentType: "SHOP_ESTABLISHMENT",
        fileNumber: "PUNE-MH-10941",
        status: "VERIFIED",
        verifiedAt: "16 Jan 2025",
      },
    ],
    timeline: [
      {
        id: "tl-01",
        timestamp: "Today, 05:35 AM",
        title: "Rule 4.4 Checkout Block Enacted",
        description: "Retailer attempted cart submission; auto-held because COD order YM-2026-8841 (₹2,450.00) is pending hub vault reconciliation.",
        actor: "System Rule Engine",
        actorRole: "Automated Policy",
        category: "SECURITY",
      },
      {
        id: "tl-02",
        timestamp: "Today, 05:30 AM",
        title: "Order YM-2026-8841 Placed (COD)",
        description: "Placed order for 24L Gir Cow Milk + 2kg Fresh Paneer totaling ₹2,450.00 via Cash on Delivery.",
        actor: "Ramesh Patil",
        actorRole: "Retailer App",
        category: "ORDER",
      },
    ],
  },
  {
    id: "ret-04",
    accountCode: "YM-CUST-7731",
    businessName: "Godavari Dairy Corner",
    ownerName: "Sunil Deshmukh",
    phone: "+91 94222 89012",
    email: "sunil.godavari@gmail.com",
    city: "Nashik",
    area: "College Road",
    deliveryAddress: "Near Big Bazaar, College Rd, Nashik - 422005",
    boothNumber: "BOOTH-NK-07",
    status: "APPROVED",
    hasPendingPaymentBlock: false,
    outstandingBalance: 0,
    totalOrdersCount: 28,
    totalBilledValue: 78900,
    totalPaymentsReceived: 78900,
    deliveredOrdersCount: 27,
    registeredAt: "01 Mar 2025",
    verifiedAt: "02 Mar 2025",
    verifiedBy: "Vikram Mehta (Ops Lead)",
    assignedRouteId: "ROUTE-03-NASHIK-COLLEGE",
    assignedRouteName: "Route 3 - College Road (Van #03)",
    deliverySlot: "Dawn Slot (05:30 – 07:00 AM)",
    dailyMilkDemandLiters: 60,
    fssaiNumber: "FSSAI Lic. #11526011000344",
    gstExemptNotice: "Agricultural primary dairy produce (GST Exempt under Notification 2/2017)",
    lastOrderCode: "YM-2026-000139",
    lastOrderDate: "Today, 05:30 AM",
    lastOrderAmount: 5100,
    lastPaymentDate: "Today, 05:31 AM",
    lastPaymentAmount: 5100,
    lastPaymentMethod: "Razorpay (UPI)",
    frequentProducts: [
      {
        productId: "prod-02",
        name: "Buffalo Full Cream Milk 1L",
        packSize: "1L Pouch",
        category: "Milk Pouches",
        avgDailyUnits: 60,
        highlightTag: "Buff Milk Wholesale",
      },
    ],
    documents: [],
    timeline: [],
  },
  {
    id: "ret-05",
    accountCode: "YM-CUST-4301",
    businessName: "Panchavati Retail & Provisions",
    ownerName: "Kailash Gupta",
    phone: "+91 98901 32111",
    email: "kailash.gupta@panchavati.com",
    city: "Nashik",
    area: "Old City",
    deliveryAddress: "Panchavati Karanja, Nashik - 422003",
    boothNumber: "BOOTH-NK-02",
    status: "APPROVED",
    hasPendingPaymentBlock: false,
    outstandingBalance: 0,
    totalOrdersCount: 19,
    totalBilledValue: 45600,
    totalPaymentsReceived: 45600,
    deliveredOrdersCount: 19,
    registeredAt: "10 Mar 2025",
    verifiedAt: "11 Mar 2025",
    verifiedBy: "Vikram Mehta (Ops Lead)",
    assignedRouteId: "ROUTE-04-NASHIK-EAST",
    assignedRouteName: "Route 4 - Nashik East (Van #04)",
    deliverySlot: "Dawn Slot (05:00 – 06:30 AM)",
    dailyMilkDemandLiters: 30,
    fssaiNumber: "FSSAI Lic. #11526044000112",
    gstExemptNotice: "Agricultural primary dairy produce (GST Exempt under Notification 2/2017)",
    lastOrderCode: "YM-2026-000138",
    lastOrderDate: "Today, 05:15 AM",
    lastOrderAmount: 2550,
    lastPaymentDate: "Today, 07:30 AM",
    lastPaymentAmount: 2550,
    lastPaymentMethod: "COD (Cash Handover)",
    frequentProducts: [],
    documents: [],
    timeline: [],
  },
  {
    id: "ret-06",
    accountCode: "YM-CUST-5912",
    businessName: "Anand Sweets & Milk Bar",
    ownerName: "Anand Patil",
    phone: "+91 97630 11984",
    email: "anand.sweets@patil.in",
    city: "Pune",
    area: "MG Road Camp",
    deliveryAddress: "MG Road Camp, Pune - 411001",
    boothNumber: "BOOTH-PN-18",
    status: "APPROVED",
    hasPendingPaymentBlock: false,
    outstandingBalance: 0,
    totalOrdersCount: 45,
    totalBilledValue: 142000,
    totalPaymentsReceived: 142000,
    deliveredOrdersCount: 45,
    registeredAt: "05 Jan 2025",
    verifiedAt: "06 Jan 2025",
    verifiedBy: "Priya Deshmukh (Super Admin)",
    assignedRouteId: "ROUTE-05-CAMP",
    assignedRouteName: "Route 5 - Camp & Cantonment (Van #05)",
    deliverySlot: "Dawn Slot (04:30 – 06:00 AM)",
    dailyMilkDemandLiters: 100,
    fssaiNumber: "FSSAI Lic. #11522001000891",
    gstExemptNotice: "Agricultural primary dairy produce (GST Exempt under Notification 2/2017)",
    lastOrderCode: "YM-2026-000137",
    lastOrderDate: "Today, 04:45 AM",
    lastOrderAmount: 11200,
    lastPaymentDate: "Today, 04:46 AM",
    lastPaymentAmount: 11200,
    lastPaymentMethod: "Razorpay (Corporate UPI)",
    frequentProducts: [],
    documents: [],
    timeline: [],
  },
  {
    id: "ret-07",
    accountCode: "YM-CUST-9901",
    businessName: "Mauli Kirana & Dairy",
    ownerName: "Tanaji Shinde",
    phone: "+91 98225 66778",
    email: "tanaji.shinde@maulidairy.in",
    city: "Pune",
    area: "Hadapsar",
    deliveryAddress: "Near Saswad Road Octroi Post, Hadapsar, Pune - 411028",
    status: "WAITING_APPROVAL",
    statusNote: "New retailer applicant awaiting KYC & route capacity review",
    hasPendingPaymentBlock: false,
    outstandingBalance: 0,
    totalOrdersCount: 0,
    totalBilledValue: 0,
    totalPaymentsReceived: 0,
    deliveredOrdersCount: 0,
    registeredAt: "Yesterday, 04:20 PM",
    assignedRouteId: "ROUTE-01-HADAPSAR",
    assignedRouteName: "Route 1 - Hadapsar (Van #01)",
    deliverySlot: "Dawn Slot (05:30 – 07:00 AM)",
    dailyMilkDemandLiters: 40,
    fssaiNumber: "FSSAI Lic. #21526019000114",
    gstExemptNotice: "Agricultural primary dairy produce (GST Exempt under Notification 2/2017)",
    frequentProducts: [],
    documents: [
      {
        id: "doc-71",
        title: "FSSAI Food Business License Copy",
        documentType: "FSSAI_LICENSE",
        fileNumber: "21526019000114",
        status: "PENDING_REVIEW",
      },
      {
        id: "doc-72",
        title: "Aadhaar Card of Tanaji Shinde",
        documentType: "IDENTITY_PROOF",
        status: "PENDING_REVIEW",
      },
      {
        id: "doc-73",
        title: "Shop Frontage & Refrigerated Milk Cooler",
        documentType: "STOREFRONT_PHOTO",
        status: "PENDING_REVIEW",
      },
    ],
    timeline: [
      {
        id: "tl-71",
        timestamp: "Yesterday, 04:20 PM",
        title: "Retailer Registration Submitted",
        description: "Tanaji Shinde submitted business onboarding details and uploaded 3 verification documents.",
        actor: "Tanaji Shinde",
        actorRole: "Applicant Retailer",
        category: "ONBOARDING",
      },
    ],
  },
  {
    id: "ret-08",
    accountCode: "YM-CUST-6510",
    businessName: "Vasant Dairy & Provisions",
    ownerName: "Vasant Patil",
    phone: "+91 98233 77112",
    email: "vasant.patil@vasantdairy.com",
    city: "Nashik",
    area: "Nashik East",
    deliveryAddress: "Near Dwarka Circle, Nashik East - 422011",
    boothNumber: "BOOTH-NK-09",
    status: "BLOCKED",
    statusNote: "Payment blocked (Rule 4.4): Unpaid invoice INV-2026-0391 (₹1,680 COD pending)",
    hasPendingPaymentBlock: true,
    outstandingBalance: 1680,
    totalOrdersCount: 22,
    totalBilledValue: 48900,
    totalPaymentsReceived: 47220,
    deliveredOrdersCount: 21,
    registeredAt: "20 Jan 2025",
    verifiedAt: "21 Jan 2025",
    verifiedBy: "Vikram Mehta (Ops Lead)",
    assignedRouteId: "ROUTE-04-NASHIK-EAST",
    assignedRouteName: "Route 4 - Nashik East (Van #04)",
    deliverySlot: "Dawn Slot (05:30 – 07:00 AM)",
    dailyMilkDemandLiters: 25,
    fssaiNumber: "FSSAI Lic. #11526019000889",
    gstExemptNotice: "Agricultural primary dairy produce (GST Exempt under Notification 2/2017)",
    lastOrderCode: "YM-2026-000108",
    lastOrderDate: "27 Oct 2026",
    lastOrderAmount: 1680,
    lastPaymentDate: "25 Oct 2026",
    lastPaymentAmount: 2100,
    lastPaymentMethod: "COD (Cash)",
    frequentProducts: [],
    documents: [],
    timeline: [],
  },
  {
    id: "ret-09",
    accountCode: "YM-CUST-3312",
    businessName: "Bhairavnath Milk Centre",
    ownerName: "Sanjay More",
    phone: "+91 98500 11223",
    email: "sanjay.more@bhairavnath.in",
    city: "Pune",
    area: "Satara Road",
    deliveryAddress: "Padmavati Corner, Satara Road, Pune - 411009",
    boothNumber: "BOOTH-PN-21",
    status: "SUSPENDED",
    statusNote: "Temporarily suspended upon retailer request for renovation (Resuming 15 Nov)",
    hasPendingPaymentBlock: false,
    outstandingBalance: 0,
    totalOrdersCount: 19,
    totalBilledValue: 38400,
    totalPaymentsReceived: 38400,
    deliveredOrdersCount: 19,
    registeredAt: "18 Jan 2025",
    verifiedAt: "19 Jan 2025",
    verifiedBy: "Priya Deshmukh (Super Admin)",
    assignedRouteId: "ROUTE-02-KOTHRUD",
    assignedRouteName: "Route 2 - Pune South / Satara Rd",
    deliverySlot: "Dawn Slot (05:00 – 06:30 AM)",
    dailyMilkDemandLiters: 35,
    fssaiNumber: "FSSAI Lic. #11522019000552",
    gstExemptNotice: "Agricultural primary dairy produce (GST Exempt under Notification 2/2017)",
    lastOrderCode: "YM-2026-000092",
    lastOrderDate: "22 Oct 2026",
    lastOrderAmount: 2450,
    lastPaymentDate: "22 Oct 2026",
    lastPaymentAmount: 2450,
    lastPaymentMethod: "Razorpay (UPI)",
    frequentProducts: [],
    documents: [],
    timeline: [],
  },
  {
    id: "ret-10",
    accountCode: "YM-CUST-9902",
    businessName: "Sai Krupa Daily Needs",
    ownerName: "Dilip Kadam",
    phone: "+91 98811 44332",
    email: "dilip.kadam@saikrupa.in",
    city: "Pune",
    area: "Kothrud",
    deliveryAddress: "Near Ideal Colony Ground, Kothrud, Pune - 411038",
    status: "WAITING_APPROVAL",
    statusNote: "Pending route logistics slot allocation",
    hasPendingPaymentBlock: false,
    outstandingBalance: 0,
    totalOrdersCount: 0,
    totalBilledValue: 0,
    totalPaymentsReceived: 0,
    deliveredOrdersCount: 0,
    registeredAt: "Today, 07:10 AM",
    assignedRouteId: "ROUTE-02-KOTHRUD",
    assignedRouteName: "Route 2 - Kothrud (Van #02)",
    deliverySlot: "Dawn Slot (05:30 – 07:00 AM)",
    dailyMilkDemandLiters: 50,
    fssaiNumber: "FSSAI Lic. #21526019000998",
    gstExemptNotice: "Agricultural primary dairy produce (GST Exempt under Notification 2/2017)",
    frequentProducts: [],
    documents: [],
    timeline: [],
  },
];

// In-memory / localStorage storage helpers
const STORAGE_KEY = "yog_milk_mock_retailers_v2";

export function getMockRetailers(): Retailer[] {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
  }
  return INITIAL_MOCK_RETAILERS;
}

export function saveMockRetailers(retailers: Retailer[]) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(retailers));
    } catch {
      // ignore
    }
  }
}

export function getMockRetailerById(id: string): Retailer | null {
  const all = getMockRetailers();
  return (
    all.find(
      (r) =>
        r.id === id ||
        r.accountCode === id ||
        (id === "ret-02" && r.id === "ret-001") ||
        (id === "ret-001" && r.id === "ret-02")
    ) || null
  );
}

export function mutateRetailerStatus(
  id: string,
  newStatus: RetailerApprovalStatus,
  adminName: string,
  adminRole: string,
  reason?: string
): Retailer | null {
  const all = getMockRetailers();
  const index = all.findIndex((r) => r.id === id);
  if (index === -1) return null;

  const target = all[index];
  const updated: Retailer = {
    ...target,
    status: newStatus,
    statusNote: reason || target.statusNote,
    verifiedAt: newStatus === "APPROVED" ? "Today" : target.verifiedAt,
    verifiedBy: newStatus === "APPROVED" ? `${adminName} (${adminRole})` : target.verifiedBy,
    hasPendingPaymentBlock: newStatus === "BLOCKED" ? true : target.hasPendingPaymentBlock,
    timeline: [
      {
        id: `tl-${Date.now()}`,
        timestamp: "Just now",
        title: `Account Status Changed to ${newStatus}`,
        description: reason || `Status updated by ${adminName} (${adminRole})`,
        actor: adminName,
        actorRole: adminRole,
        category: "SECURITY",
      },
      ...target.timeline,
    ],
  };

  all[index] = updated;
  saveMockRetailers(all);
  return updated;
}

export function mutateRetailerInfo(
  id: string,
  updates: Partial<Pick<Retailer, "businessName" | "ownerName" | "phone" | "email" | "deliveryAddress" | "assignedRouteId" | "assignedRouteName" | "deliverySlot">>,
  adminName: string,
  adminRole: string
): Retailer | null {
  const all = getMockRetailers();
  const index = all.findIndex((r) => r.id === id);
  if (index === -1) return null;

  const target = all[index];
  const updated: Retailer = {
    ...target,
    ...updates,
    timeline: [
      {
        id: `tl-${Date.now()}`,
        timestamp: "Just now",
        title: "Permitted Account Information Edited",
        description: `Profile fields updated by ${adminName} (${adminRole})`,
        actor: adminName,
        actorRole: adminRole,
        category: "ONBOARDING",
      },
      ...target.timeline,
    ],
  };

  all[index] = updated;
  saveMockRetailers(all);
  return updated;
}

export function syncRetailerOrderUpdate(
  retailerId: string,
  orderCode: string,
  newOrderStatus: string,
  newDeliveryStatus: string,
  adminName: string,
  note?: string
): void {
  const all = getMockRetailers();
  const index = all.findIndex((r) => r.id === retailerId);
  if (index === -1) return;

  const target = all[index];
  let deliveredInc = 0;
  if (newOrderStatus === "DELIVERED" || newDeliveryStatus === "DELIVERED") {
    deliveredInc = 1;
  }

  const newEvent = {
    id: `tl-ord-${Date.now()}`,
    timestamp: "Just now",
    title:
      newOrderStatus === "DELIVERED"
        ? `Order Delivered (${orderCode})`
        : newOrderStatus === "CANCELLED"
        ? `Order Cancelled (${orderCode})`
        : newDeliveryStatus === "DELIVERY_FAILED"
        ? `Dawn Delivery Exception (${orderCode})`
        : `Order Status: ${newOrderStatus} (${orderCode})`,
    description: note || `Updated by ${adminName}`,
    actor: adminName,
    actorRole: "Operations Lead",
    category: (newDeliveryStatus === "DELIVERY_FAILED" ? "DELIVERY" : "ORDER") as any,
  };

  const updated: Retailer = {
    ...target,
    deliveredOrdersCount: target.deliveredOrdersCount + deliveredInc,
    timeline: [newEvent, ...target.timeline],
  };

  all[index] = updated;
  saveMockRetailers(all);
}

