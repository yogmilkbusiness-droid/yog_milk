import {
  Order,
  OrderStatus,
  DeliveryStatus,
  PaymentStatus,
  OrderStatusHistoryItem,
} from "../contracts/order";
import { DeliveryRoute, DeliveryConsignment } from "../contracts/delivery";
import { syncRetailerOrderUpdate } from "./admin-retailers";

export const INITIAL_MOCK_ROUTES: DeliveryRoute[] = [
  {
    id: "ROUTE-04-NASHIK-EAST",
    routeName: "Route 4: Nashik East & Indira Nagar",
    driverName: "Suresh Kulkarni",
    driverPhone: "+91 98223 77102",
    vehicleNumber: "MH 15 EG 4402",
    totalDrops: 38,
    completedDrops: 24,
    totalCrates: 42,
    dispatchTime: "05:15 AM",
    vanTemperature: "3.4°C",
    status: "DISPATCHED",
  },
  {
    id: "ROUTE-02-GANGAPUR",
    routeName: "Route 2: Gangapur Road & College Road",
    driverName: "Manoj Deshmukh",
    driverPhone: "+91 98224 81092",
    vehicleNumber: "MH 15 CV 8109",
    totalDrops: 42,
    completedDrops: 30,
    totalCrates: 48,
    dispatchTime: "05:25 AM",
    vanTemperature: "3.7°C",
    status: "DISPATCHED",
  },
  {
    id: "ROUTE-01-PANCHAVATI",
    routeName: "Route 1: Panchavati Hub & Dindori Road",
    driverName: "Raju Bhalerao",
    driverPhone: "+91 94222 10921",
    vehicleNumber: "MH 15 BD 2011",
    totalDrops: 38,
    completedDrops: 28,
    totalCrates: 36,
    dispatchTime: "05:00 AM",
    vanTemperature: "3.6°C",
    status: "DISPATCHED",
  },
  {
    id: "ROUTE-03-KOTHRUD",
    routeName: "Route 3: Kothrud & Deccan Gymkhana (Pune)",
    driverName: "Santosh Ghadge",
    driverPhone: "+91 98221 23456",
    vehicleNumber: "MH 12 QX 4821",
    totalDrops: 26,
    completedDrops: 18,
    totalCrates: 32,
    dispatchTime: "04:45 AM",
    vanTemperature: "3.8°C",
    status: "DISPATCHED",
  },
  {
    id: "ROUTE-05-HADAPSAR",
    routeName: "Route 5: Hadapsar Gadital & Magarpatta (Pune)",
    driverName: "Kishore Pawar",
    driverPhone: "+91 98220 12345",
    vehicleNumber: "MH 12 TY 9912",
    totalDrops: 22,
    completedDrops: 15,
    totalCrates: 28,
    dispatchTime: "05:10 AM",
    vanTemperature: "3.9°C",
    status: "DISPATCHED",
  },
];

export const INITIAL_MOCK_ORDERS: Order[] = [
  // 0. Primary Benchmark Order YM-2026-8841 (Om Sai Dairy & Sweets - Rule 4.4 Block Scenario)
  {
    id: "ord-8841",
    orderCode: "YM-2026-8841",
    consignmentId: "YMD-2026-8841",
    retailerId: "ret-001",
    retailerBusinessName: "Om Sai Dairy & Sweets",
    retailerOwnerName: "Ramesh Patil",
    retailerPhone: "+91 98220 12345",
    retailerArea: "Kothrud, Pune",
    retailerFssai: "FSSAI 11523038000142",
    orderDate: "Today, 05:30 AM",
    orderTime: "05:30 AM",
    dateKey: "today",
    orderStatus: "PROCESSING",
    paymentStatus: "PENDING",
    deliveryStatus: "ASSIGNED",
    paymentMethod: "COD",
    crateCount: 3,
    scheduledSlot: "Dawn 05:00 – 07:00 AM",
    items: [
      {
        productId: "prod-001",
        productName: "Gir Cow Full Cream Milk 1L",
        packSize: "1L Pouch",
        quantity: 24,
        crateCount: 2,
        unitPrice: 68,
        lineTotal: 1632,
        fatPercentage: 4.5,
        snfPercentage: 8.5,
        batchCode: "#SAT-20261031-GIR",
        specs: "A2 Gir Cow Farm Direct · Chilled 3.4°C",
      },
      {
        productId: "prod-003",
        productName: "Fresh Malai Paneer 1kg",
        packSize: "1kg Vacuum Pack",
        quantity: 2,
        crateCount: 1,
        unitPrice: 380,
        lineTotal: 760,
        specs: "Zero Preservative Vacuum Fresh Pack",
      },
    ],
    subtotal: 2392,
    deliveryCharge: 58,
    totalPayable: 2450,
    deliveryAddress: "Shop No. 4, Anand Nagar, Paud Road, Kothrud, Pune 411038",
    deliveryRouteId: "ROUTE-02-KOTHRUD",
    deliveryRouteName: "Route 2: Kothrud & Paud (Van #02)",
    deliveryDriverName: "Santosh Jadhav",
    deliveryDriverPhone: "+91 98222 10941",
    deliveryVehicleNumber: "MH 12 QX 4812",
    notes: "Insulated drop crate outside store shutter.",
    invoiceNumber: "INV-2026-1049",
    statusHistory: [
      {
        id: "sh-8841-01",
        toStatus: "PLACED",
        statusType: "ORDER",
        timestamp: "Today, 05:30 AM",
        adminId: "SYSTEM",
        adminName: "Retailer App (Ramesh Patil)",
        reason: "Commercial order placed via retailer application",
      },
      {
        id: "sh-8841-02",
        fromStatus: "PLACED",
        toStatus: "PROCESSING",
        statusType: "ORDER",
        timestamp: "Today, 05:35 AM",
        adminId: "ADM-004",
        adminName: "Mahesh Patil (Cold-Room Supervisor)",
        reason: "Staged in Cold Room #2 for Van #02 allocation",
      },
    ],
  },
  // 1. Order 145: PLACED, COD, NOT_ASSIGNED (Needs preparation)
  {
    id: "ord-2026-000145",
    orderCode: "YM-2026-000145",
    consignmentId: "YMD-2026-000145",
    retailerId: "ret-03",
    retailerBusinessName: "Sharma General Store",
    retailerOwnerName: "Rajesh Sharma",
    retailerPhone: "+91 98221 44102",
    retailerArea: "Gangapur Road, Nashik",
    retailerFssai: "FSSAI 21522026000412",
    orderDate: "Today, 06:20 AM",
    orderTime: "06:20 AM",
    dateKey: "today",
    orderStatus: "PLACED",
    paymentStatus: "PENDING",
    deliveryStatus: "NOT_ASSIGNED",
    paymentMethod: "COD",
    crateCount: 3,
    scheduledSlot: "Dawn 05:30 – 07:00 AM",
    items: [
      {
        productId: "prod-01",
        productName: "Gir Cow A2 Milk 1L Pouch",
        packSize: "Pack of 20",
        quantity: 40,
        crateCount: 2,
        unitPrice: 85,
        lineTotal: 3400,
        fatPercentage: 4.8,
        snfPercentage: 8.8,
        batchCode: "#GIR-20261029-A2",
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
    deliveryAddress: "Shop 12, Gangapur Rd, Nashik - 422005",
    invoiceNumber: "INV-2026-0492",
    notes: "COD balance pending collection. Retain returnable glass crates.",
    statusHistory: [
      {
        id: "hist-145-1",
        toStatus: "PLACED",
        statusType: "ORDER",
        timestamp: "Today, 06:20 AM",
        adminId: "system",
        adminName: "Retailer App Mobile Client",
        notes: "Order placed by Rajesh Sharma via Quick Add Usual.",
      },
    ],
  },

  // 2. Order 144: CONFIRMED, ONLINE PAID, NOT_ASSIGNED
  {
    id: "ord-2026-000144",
    orderCode: "YM-2026-000144",
    consignmentId: "YMD-2026-000144",
    retailerId: "ret-04",
    retailerBusinessName: "Godavari Dairy Corner",
    retailerOwnerName: "Santosh Deshmukh",
    retailerPhone: "+91 94222 89012",
    retailerArea: "College Road, Nashik",
    retailerFssai: "FSSAI 21522026000499",
    orderDate: "Today, 06:18 AM",
    orderTime: "06:18 AM",
    dateKey: "today",
    orderStatus: "CONFIRMED",
    paymentStatus: "PAID",
    deliveryStatus: "NOT_ASSIGNED",
    paymentMethod: "ONLINE",
    crateCount: 4,
    scheduledSlot: "Dawn 05:30 – 07:00 AM",
    items: [
      {
        productId: "prod-02",
        productName: "Buffalo Full Cream Milk 1L",
        packSize: "Pack of 20",
        quantity: 60,
        crateCount: 3,
        unitPrice: 70,
        lineTotal: 4200,
        fatPercentage: 6.2,
        snfPercentage: 9.1,
        batchCode: "#BUF-1029-01",
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
    deliveryAddress: "Near Big Bazaar, College Rd, Nashik - 422005",
    invoiceNumber: "INV-2026-0491",
    notes: "Razorpay payment verified. Route assignment pending dispatch controller.",
    statusHistory: [
      {
        id: "hist-144-1",
        toStatus: "PLACED",
        statusType: "ORDER",
        timestamp: "Today, 06:15 AM",
        adminId: "system",
        adminName: "Retailer App Client",
      },
      {
        id: "hist-144-2",
        fromStatus: "PLACED",
        toStatus: "CONFIRMED",
        statusType: "ORDER",
        timestamp: "Today, 06:18 AM",
        adminId: "admin-01",
        adminName: "Vikram Mehta (Operations Lead)",
        notes: "Automated verification after online payment settlement.",
      },
    ],
  },

  // 3. Order 142: PROCESSING, ONLINE PAID, ASSIGNED (Route 4)
  {
    id: "ord-2026-000142",
    orderCode: "YM-2026-000142",
    consignmentId: "YMD-2026-000142",
    retailerId: "ret-01",
    retailerBusinessName: "Shree Krishna Milk Centre",
    retailerOwnerName: "Gopal Rathi",
    retailerPhone: "+91 98220 12345",
    retailerArea: "Hadapsar, Pune",
    retailerFssai: "FSSAI 21522026000118",
    orderDate: "Today, 06:15 AM",
    orderTime: "06:15 AM",
    dateKey: "today",
    orderStatus: "PROCESSING",
    paymentStatus: "PAID",
    deliveryStatus: "ASSIGNED",
    paymentMethod: "ONLINE",
    crateCount: 5,
    scheduledSlot: "Dawn 05:30 – 07:00 AM",
    coldBoxTemp: "3.4°C",
    deliveryRouteId: "ROUTE-05-HADAPSAR",
    deliveryRouteName: "Route 5: Hadapsar Gadital & Magarpatta (Pune)",
    deliveryDriverName: "Kishore Pawar",
    deliveryDriverPhone: "+91 98220 12345",
    deliveryVehicleNumber: "MH 12 TY 9912",
    items: [
      {
        productId: "prod-01",
        productName: "Gir Cow A2 Milk 1L Pouch",
        packSize: "Pack of 20",
        quantity: 40,
        crateCount: 4,
        unitPrice: 85,
        lineTotal: 3400,
        fatPercentage: 4.8,
        snfPercentage: 8.8,
      },
      {
        productId: "prod-05",
        productName: "Fresh Soft Malai Paneer 1kg",
        packSize: "1kg Vacuum Block",
        quantity: 5,
        crateCount: 1,
        unitPrice: 420,
        lineTotal: 2100,
      },
    ],
    subtotal: 5500,
    deliveryCharge: 0,
    totalPayable: 5500,
    deliveryAddress: "Shop 4, Hadapsar Gadital Market, Pune - 411028",
    invoiceNumber: "INV-2026-0489",
    notes: "Leave with morning attendant before 07:30 AM.",
    statusHistory: [
      {
        id: "hist-142-1",
        toStatus: "PLACED",
        statusType: "ORDER",
        timestamp: "Today, 06:00 AM",
        adminId: "system",
        adminName: "Retailer App Client",
      },
      {
        id: "hist-142-2",
        fromStatus: "PLACED",
        toStatus: "CONFIRMED",
        statusType: "ORDER",
        timestamp: "Today, 06:05 AM",
        adminId: "admin-01",
        adminName: "Vikram Mehta (Operations Lead)",
      },
      {
        id: "hist-142-3",
        fromStatus: "CONFIRMED",
        toStatus: "PROCESSING",
        statusType: "ORDER",
        timestamp: "Today, 06:15 AM",
        adminId: "admin-01",
        adminName: "Vikram Mehta (Operations Lead)",
        notes: "Bottling and packing line allocation complete.",
      },
      {
        id: "hist-142-4",
        fromStatus: "NOT_ASSIGNED",
        toStatus: "ASSIGNED",
        statusType: "DELIVERY",
        timestamp: "Today, 06:16 AM",
        adminId: "admin-01",
        adminName: "Vikram Mehta (Operations Lead)",
        notes: "Assigned to Van MH 12 TY 9912 (Kishore Pawar).",
      },
    ],
  },

  // 4. Order 141: READY_FOR_DELIVERY, ONLINE PROCESSING, PICKED_UP
  {
    id: "ord-2026-000141",
    orderCode: "YM-2026-000141",
    consignmentId: "YMD-2026-000141",
    retailerId: "ret-02",
    retailerBusinessName: "Om Sai Dairy & Sweets",
    retailerOwnerName: "Mahesh Patil",
    retailerPhone: "+91 98221 23456",
    retailerArea: "Kothrud, Pune",
    retailerFssai: "FSSAI 21522026000234",
    orderDate: "Today, 06:05 AM",
    orderTime: "06:05 AM",
    dateKey: "today",
    orderStatus: "READY_FOR_DELIVERY",
    paymentStatus: "PROCESSING",
    deliveryStatus: "PICKED_UP",
    paymentMethod: "ONLINE",
    crateCount: 5,
    scheduledSlot: "Dawn 05:30 – 07:00 AM",
    coldBoxTemp: "3.8°C",
    deliveryRouteId: "ROUTE-03-KOTHRUD",
    deliveryRouteName: "Route 3: Kothrud & Deccan Gymkhana (Pune)",
    deliveryDriverName: "Santosh Ghadge",
    deliveryDriverPhone: "+91 98221 23456",
    deliveryVehicleNumber: "MH 12 QX 4821",
    items: [
      {
        productId: "prod-02",
        productName: "Buffalo Full Cream Milk 1L",
        packSize: "Pack of 20",
        quantity: 50,
        crateCount: 5,
        unitPrice: 70,
        lineTotal: 3500,
        fatPercentage: 6.0,
      },
    ],
    subtotal: 3500,
    deliveryCharge: 0,
    totalPayable: 3500,
    deliveryAddress: "Near Karve Statue, Kothrud, Pune - 411038",
    invoiceNumber: "INV-2026-0488",
    notes: "Insulated crates loaded into Van #3.",
    statusHistory: [
      {
        id: "hist-141-1",
        toStatus: "PLACED",
        statusType: "ORDER",
        timestamp: "Today, 05:50 AM",
        adminId: "system",
        adminName: "Retailer App Client",
      },
      {
        id: "hist-141-2",
        fromStatus: "PLACED",
        toStatus: "CONFIRMED",
        statusType: "ORDER",
        timestamp: "Today, 05:55 AM",
        adminId: "admin-01",
        adminName: "Vikram Mehta (Operations Lead)",
      },
      {
        id: "hist-141-3",
        fromStatus: "CONFIRMED",
        toStatus: "PROCESSING",
        statusType: "ORDER",
        timestamp: "Today, 06:00 AM",
        adminId: "admin-01",
        adminName: "Vikram Mehta (Operations Lead)",
      },
      {
        id: "hist-141-4",
        fromStatus: "PROCESSING",
        toStatus: "READY_FOR_DELIVERY",
        statusType: "ORDER",
        timestamp: "Today, 06:05 AM",
        adminId: "admin-01",
        adminName: "Vikram Mehta (Operations Lead)",
        notes: "Insulated crates sealed and staging complete.",
      },
      {
        id: "hist-141-5",
        fromStatus: "ASSIGNED",
        toStatus: "PICKED_UP",
        statusType: "DELIVERY",
        timestamp: "Today, 06:08 AM",
        adminId: "admin-01",
        adminName: "Santosh Ghadge (Van Driver)",
        notes: "Driver picked up crates from Cold Vault 2.",
      },
    ],
  },

  // 5. Order 140: CONFIRMED, COD PENDING, ASSIGNED (Route 1)
  {
    id: "ord-2026-000140",
    orderCode: "YM-2026-000140",
    consignmentId: "YMD-2026-000140",
    retailerId: "ret-05",
    retailerBusinessName: "Panchavati Retail & Provisions",
    retailerOwnerName: "Dattatraya Shinde",
    retailerPhone: "+91 98901 32111",
    retailerArea: "Old City, Nashik",
    retailerFssai: "FSSAI 21522026000302",
    orderDate: "Today, 05:50 AM",
    orderTime: "05:50 AM",
    dateKey: "today",
    orderStatus: "CONFIRMED",
    paymentStatus: "PENDING",
    deliveryStatus: "ASSIGNED",
    paymentMethod: "COD",
    crateCount: 3,
    scheduledSlot: "Dawn 05:30 – 07:00 AM",
    coldBoxTemp: "3.6°C",
    deliveryRouteId: "ROUTE-01-PANCHAVATI",
    deliveryRouteName: "Route 1: Panchavati Hub & Dindori Road",
    deliveryDriverName: "Raju Bhalerao",
    deliveryDriverPhone: "+91 94222 10921",
    deliveryVehicleNumber: "MH 15 BD 2011",
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
      {
        productId: "prod-03",
        productName: "Pure Vedic A2 Bilona Ghee 500ml",
        packSize: "500ml Jar",
        quantity: 2,
        crateCount: 1,
        unitPrice: 750,
        lineTotal: 1500,
      },
    ],
    subtotal: 3200,
    deliveryCharge: 0,
    totalPayable: 3200,
    deliveryAddress: "Panchavati Karanja, Nashik - 422003",
    invoiceNumber: "INV-2026-0487",
    notes: "COD pending verification. Outstanding balance flagged under Rule 4.4.",
    statusHistory: [
      {
        id: "hist-140-1",
        toStatus: "PLACED",
        statusType: "ORDER",
        timestamp: "Today, 05:40 AM",
        adminId: "system",
        adminName: "Retailer App Client",
      },
      {
        id: "hist-140-2",
        fromStatus: "PLACED",
        toStatus: "CONFIRMED",
        statusType: "ORDER",
        timestamp: "Today, 05:50 AM",
        adminId: "admin-01",
        adminName: "Vikram Mehta (Operations Lead)",
      },
      {
        id: "hist-140-3",
        fromStatus: "NOT_ASSIGNED",
        toStatus: "ASSIGNED",
        statusType: "DELIVERY",
        timestamp: "Today, 05:52 AM",
        adminId: "admin-01",
        adminName: "Vikram Mehta (Operations Lead)",
        notes: "Allocated to Driver Raju Bhalerao.",
      },
    ],
  },

  // 6. Order 139: OUT_FOR_DELIVERY, ONLINE PAID, OUT_FOR_DELIVERY
  {
    id: "ord-2026-000139",
    orderCode: "YM-2026-000139",
    consignmentId: "YMD-2026-000139",
    retailerId: "ret-04",
    retailerBusinessName: "Godavari Dairy Corner",
    retailerOwnerName: "Santosh Deshmukh",
    retailerPhone: "+91 94222 89012",
    retailerArea: "College Road, Nashik",
    retailerFssai: "FSSAI 21522026000499",
    orderDate: "Today, 05:30 AM",
    orderTime: "05:30 AM",
    dateKey: "today",
    orderStatus: "OUT_FOR_DELIVERY",
    paymentStatus: "PAID",
    deliveryStatus: "OUT_FOR_DELIVERY",
    paymentMethod: "ONLINE",
    crateCount: 8,
    scheduledSlot: "Dawn 05:30 – 07:00 AM",
    coldBoxTemp: "3.7°C",
    deliveryRouteId: "ROUTE-02-GANGAPUR",
    deliveryRouteName: "Route 2: Gangapur Road & College Road",
    deliveryDriverName: "Manoj Deshmukh",
    deliveryDriverPhone: "+91 98224 81092",
    deliveryVehicleNumber: "MH 15 CV 8109",
    items: [
      {
        productId: "prod-02",
        productName: "Buffalo Full Cream Milk 1L",
        packSize: "Pack of 20",
        quantity: 60,
        crateCount: 6,
        unitPrice: 70,
        lineTotal: 4200,
      },
      {
        productId: "prod-04",
        productName: "Traditional Clay Pot Dahi 400g",
        packSize: "Pack of 20",
        quantity: 20,
        crateCount: 2,
        unitPrice: 45,
        lineTotal: 900,
      },
    ],
    subtotal: 5100,
    deliveryCharge: 0,
    totalPayable: 5100,
    deliveryAddress: "Near Big Bazaar, College Rd, Nashik - 422005",
    invoiceNumber: "INV-2026-0486",
    notes: "Van in transit. Estimated doorstep drop at 06:45 AM.",
    statusHistory: [
      {
        id: "hist-139-1",
        toStatus: "PLACED",
        statusType: "ORDER",
        timestamp: "Today, 05:15 AM",
        adminId: "system",
        adminName: "Retailer App Client",
      },
      {
        id: "hist-139-2",
        fromStatus: "PLACED",
        toStatus: "CONFIRMED",
        statusType: "ORDER",
        timestamp: "Today, 05:20 AM",
        adminId: "admin-01",
        adminName: "Vikram Mehta (Operations Lead)",
      },
      {
        id: "hist-139-3",
        fromStatus: "CONFIRMED",
        toStatus: "PROCESSING",
        statusType: "ORDER",
        timestamp: "Today, 05:25 AM",
        adminId: "admin-01",
        adminName: "Vikram Mehta (Operations Lead)",
      },
      {
        id: "hist-139-4",
        fromStatus: "PROCESSING",
        toStatus: "READY_FOR_DELIVERY",
        statusType: "ORDER",
        timestamp: "Today, 05:30 AM",
        adminId: "admin-01",
        adminName: "Vikram Mehta (Operations Lead)",
      },
      {
        id: "hist-139-5",
        fromStatus: "READY_FOR_DELIVERY",
        toStatus: "OUT_FOR_DELIVERY",
        statusType: "ORDER",
        timestamp: "Today, 05:35 AM",
        adminId: "admin-01",
        adminName: "Manoj Deshmukh (Driver)",
        notes: "Van departed Nashik central distribution hub.",
      },
      {
        id: "hist-139-6",
        fromStatus: "PICKED_UP",
        toStatus: "OUT_FOR_DELIVERY",
        statusType: "DELIVERY",
        timestamp: "Today, 05:35 AM",
        adminId: "admin-01",
        adminName: "Manoj Deshmukh (Driver)",
      },
    ],
  },

  // 7. Order 138: DELIVERED, COD PAID (Admin recorded), DELIVERED
  {
    id: "ord-2026-000138",
    orderCode: "YM-2026-000138",
    consignmentId: "YMD-2026-000138",
    retailerId: "ret-05",
    retailerBusinessName: "Panchavati Retail & Provisions",
    retailerOwnerName: "Dattatraya Shinde",
    retailerPhone: "+91 98901 32111",
    retailerArea: "Old City, Nashik",
    retailerFssai: "FSSAI 21522026000302",
    orderDate: "Today, 05:15 AM",
    orderTime: "05:15 AM",
    dateKey: "today",
    orderStatus: "DELIVERED",
    paymentStatus: "PAID",
    deliveryStatus: "DELIVERED",
    paymentMethod: "COD",
    crateCount: 3,
    scheduledSlot: "Dawn 05:30 – 07:00 AM",
    deliveredAt: "Today, 06:22 AM",
    deliveryRouteId: "ROUTE-01-PANCHAVATI",
    deliveryRouteName: "Route 1: Panchavati Hub & Dindori Road",
    deliveryDriverName: "Raju Bhalerao",
    deliveryDriverPhone: "+91 94222 10921",
    deliveryVehicleNumber: "MH 15 BD 2011",
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
    deliveryAddress: "Panchavati Karanja, Nashik - 422003",
    invoiceNumber: "INV-2026-0485",
    notes: "Cash handed to driver Raju Bhalerao. Admin verified deposit.",
    statusHistory: [
      {
        id: "hist-138-1",
        toStatus: "PLACED",
        statusType: "ORDER",
        timestamp: "Today, 05:00 AM",
        adminId: "system",
        adminName: "Retailer App Client",
      },
      {
        id: "hist-138-2",
        fromStatus: "READY_FOR_DELIVERY",
        toStatus: "OUT_FOR_DELIVERY",
        statusType: "ORDER",
        timestamp: "Today, 05:30 AM",
        adminId: "admin-01",
        adminName: "Raju Bhalerao (Driver)",
      },
      {
        id: "hist-138-3",
        fromStatus: "OUT_FOR_DELIVERY",
        toStatus: "DELIVERED",
        statusType: "ORDER",
        timestamp: "Today, 06:22 AM",
        adminId: "admin-01",
        adminName: "Raju Bhalerao (Driver)",
        notes: "Delivered to shop assistant. 3 empty glass crates exchanged.",
      },
      {
        id: "hist-138-4",
        fromStatus: "PENDING",
        toStatus: "PAID",
        statusType: "PAYMENT",
        timestamp: "Today, 06:25 AM",
        adminId: "admin-01",
        adminName: "Vikram Mehta (Operations Lead)",
        notes: "Cash of ₹2,550 collected by driver and reconciled in depot vault.",
      },
    ],
  },

  // 8. Order 136: DELIVERY_FAILED, COD PENDING, DELIVERY_FAILED (Customer shutter down)
  {
    id: "ord-2026-000136",
    orderCode: "YM-2026-000136",
    consignmentId: "YMD-2026-000136",
    retailerId: "ret-06",
    retailerBusinessName: "Anand Sweets & Milk Bar",
    retailerOwnerName: "Anand Joshi",
    retailerPhone: "+91 97630 11984",
    retailerArea: "MG Road, Pune",
    retailerFssai: "FSSAI 21522026000543",
    orderDate: "Today, 04:30 AM",
    orderTime: "04:30 AM",
    dateKey: "today",
    orderStatus: "DELIVERY_FAILED",
    paymentStatus: "PENDING",
    deliveryStatus: "DELIVERY_FAILED",
    paymentMethod: "COD",
    crateCount: 6,
    scheduledSlot: "Dawn 05:30 – 07:00 AM",
    coldBoxTemp: "3.9°C",
    deliveryRouteId: "ROUTE-03-KOTHRUD",
    deliveryRouteName: "Route 3: Kothrud & Deccan Gymkhana (Pune)",
    deliveryDriverName: "Santosh Ghadge",
    deliveryDriverPhone: "+91 98221 23456",
    deliveryVehicleNumber: "MH 12 QX 4821",
    deliveryFailureReason: "Customer outlet closed / shutter down at dawn",
    deliveryFollowUpAction: "Return crates to Central Chiller B (Zero spoilage)",
    deliveryNotes:
      "Driver Santosh G. waited 15 mins (06:40-06:55 AM). Phone unanswered. Crates returned intact at 3.9°C.",
    items: [
      {
        productId: "prod-02",
        productName: "Buffalo Full Cream Milk 1L",
        packSize: "Pack of 20",
        quantity: 50,
        crateCount: 5,
        unitPrice: 70,
        lineTotal: 3500,
      },
      {
        productId: "prod-05",
        productName: "Fresh Soft Malai Paneer 1kg",
        packSize: "1kg Block",
        quantity: 2,
        crateCount: 1,
        unitPrice: 420,
        lineTotal: 840,
      },
    ],
    subtotal: 4340,
    deliveryCharge: 0,
    totalPayable: 4340,
    deliveryAddress: "MG Road Camp, Pune - 411001",
    invoiceNumber: "INV-2026-0483",
    notes: "Delivery attempt failed at dawn. Crate safely in Central Chiller B.",
    statusHistory: [
      {
        id: "hist-136-1",
        toStatus: "PLACED",
        statusType: "ORDER",
        timestamp: "Today, 04:30 AM",
        adminId: "system",
        adminName: "Retailer App Client",
      },
      {
        id: "hist-136-2",
        fromStatus: "READY_FOR_DELIVERY",
        toStatus: "OUT_FOR_DELIVERY",
        statusType: "ORDER",
        timestamp: "Today, 05:20 AM",
        adminId: "admin-01",
        adminName: "Santosh Ghadge (Driver)",
      },
      {
        id: "hist-136-3",
        fromStatus: "OUT_FOR_DELIVERY",
        toStatus: "DELIVERY_FAILED",
        statusType: "DELIVERY",
        timestamp: "Today, 06:55 AM",
        adminId: "admin-01",
        adminName: "Vikram Mehta (Operations Lead)",
        reason: "Customer outlet closed / shutter down at dawn",
        notes: "Store shutter closed. Cold box temperature monitored at 3.9°C.",
      },
    ],
  },

  // 9. Order 135: CANCELLED, ONLINE REFUNDED, NOT_ASSIGNED
  {
    id: "ord-2026-000135",
    orderCode: "YM-2026-000135",
    consignmentId: "YMD-2026-000135",
    retailerId: "ret-02",
    retailerBusinessName: "Om Sai Dairy & Sweets",
    retailerOwnerName: "Mahesh Patil",
    retailerPhone: "+91 98221 23456",
    retailerArea: "Kothrud, Pune",
    retailerFssai: "FSSAI 21522026000234",
    orderDate: "Yesterday, 06:10 PM",
    orderTime: "06:10 PM",
    dateKey: "yesterday",
    orderStatus: "CANCELLED",
    paymentStatus: "REFUNDED",
    deliveryStatus: "NOT_ASSIGNED",
    paymentMethod: "ONLINE",
    crateCount: 2,
    scheduledSlot: "Dawn 05:30 – 07:00 AM",
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
    deliveryAddress: "Near Karve Statue, Kothrud, Pune - 411038",
    invoiceNumber: "INV-2026-0482",
    notes: "Order cancelled by retailer due to festival store closure. Refund initiated.",
    statusHistory: [
      {
        id: "hist-135-1",
        toStatus: "PLACED",
        statusType: "ORDER",
        timestamp: "Yesterday, 06:10 PM",
        adminId: "system",
        adminName: "Retailer App Client",
      },
      {
        id: "hist-135-2",
        fromStatus: "PLACED",
        toStatus: "CANCELLED",
        statusType: "ORDER",
        timestamp: "Yesterday, 07:30 PM",
        adminId: "admin-01",
        adminName: "Vikram Mehta (Operations Lead)",
        reason: "Customer requested cancellation before dawn bottling schedule.",
      },
      {
        id: "hist-135-3",
        fromStatus: "PAID",
        toStatus: "REFUNDED",
        statusType: "PAYMENT",
        timestamp: "Yesterday, 07:35 PM",
        adminId: "admin-01",
        adminName: "Vikram Mehta (Operations Lead)",
        notes: "Online refund processed to original UPI source.",
      },
    ],
  },

  // 10. Order 134: DELIVERED, ONLINE PAID, DELIVERED (Yesterday)
  {
    id: "ord-2026-000134",
    orderCode: "YM-2026-000134",
    consignmentId: "YMD-2026-000134",
    retailerId: "ret-01",
    retailerBusinessName: "Shree Krishna Milk Centre",
    retailerOwnerName: "Gopal Rathi",
    retailerPhone: "+91 98220 12345",
    retailerArea: "Hadapsar, Pune",
    retailerFssai: "FSSAI 21522026000118",
    orderDate: "Yesterday, 05:40 AM",
    orderTime: "05:40 AM",
    dateKey: "yesterday",
    orderStatus: "DELIVERED",
    paymentStatus: "PAID",
    deliveryStatus: "DELIVERED",
    paymentMethod: "ONLINE",
    crateCount: 6,
    scheduledSlot: "Dawn 05:30 – 07:00 AM",
    deliveredAt: "Yesterday, 06:35 AM",
    deliveryRouteId: "ROUTE-05-HADAPSAR",
    deliveryRouteName: "Route 5: Hadapsar Gadital & Magarpatta (Pune)",
    deliveryDriverName: "Kishore Pawar",
    deliveryDriverPhone: "+91 98220 12345",
    deliveryVehicleNumber: "MH 12 TY 9912",
    items: [
      {
        productId: "prod-01",
        productName: "Gir Cow A2 Milk 1L Pouch",
        packSize: "Pack of 20",
        quantity: 60,
        crateCount: 6,
        unitPrice: 85,
        lineTotal: 5100,
      },
    ],
    subtotal: 5100,
    deliveryCharge: 0,
    totalPayable: 5100,
    deliveryAddress: "Shop 4, Hadapsar Gadital Market, Pune - 411028",
    invoiceNumber: "INV-2026-0481",
    statusHistory: [
      {
        id: "hist-134-1",
        toStatus: "DELIVERED",
        statusType: "ORDER",
        timestamp: "Yesterday, 06:35 AM",
        adminId: "admin-01",
        adminName: "Kishore Pawar (Driver)",
        notes: "Completed morning run drop.",
      },
    ],
  },
];

const ORDERS_STORAGE_KEY = "yog_milk_admin_mock_orders_v2";

export function getMockOrders(): Order[] {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
  }
  return INITIAL_MOCK_ORDERS;
}

export function saveMockOrders(orders: Order[]): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch {
      // ignore
    }
  }
}

export function getMockOrderById(id: string): Order | null {
  const orders = getMockOrders();
  return orders.find((o) => o.id === id || o.orderCode === id) || null;
}

export function getMockDeliveryRoutes(): DeliveryRoute[] {
  return INITIAL_MOCK_ROUTES;
}

export function getMockConsignments(routeId?: string): DeliveryConsignment[] {
  const orders = getMockOrders();
  const consignments: DeliveryConsignment[] = orders
    .filter((o) => o.orderStatus !== "CANCELLED")
    .map((o) => {
      const itemsSummary = o.items.map((i) => `${i.productName} x${i.quantity}`).join(", ");
      return {
        id: o.consignmentId || `YMD-${o.orderCode.slice(3)}`,
        orderId: o.id,
        orderCode: o.orderCode,
        retailerId: o.retailerId,
        retailerName: o.retailerBusinessName,
        retailerPhone: o.retailerPhone,
        deliveryAddress: o.deliveryAddress,
        area: o.retailerArea,
        routeId: o.deliveryRouteId || "ROUTE-UNASSIGNED",
        routeName: o.deliveryRouteName || "Unassigned Route",
        driverName: o.deliveryDriverName || "Not Assigned",
        driverPhone: o.deliveryDriverPhone || "",
        vehicleNumber: o.deliveryVehicleNumber || "Pending Van",
        cratesCount: o.crateCount || o.items.reduce((acc, it) => acc + (it.crateCount || 1), 0),
        itemsSummary,
        orderTotal: o.totalPayable,
        paymentMethod: o.paymentMethod,
        deliveryStatus: o.deliveryStatus,
        scheduledSlot: o.scheduledSlot || "Dawn 05:30 – 07:00 AM",
        deliveredAt: o.deliveredAt,
        coldBoxTemp: o.coldBoxTemp || "3.8°C",
        failureReason: o.deliveryFailureReason,
        followUpAction: o.deliveryFollowUpAction,
        dispatchNotes: o.deliveryNotes,
      };
    });

  if (routeId && routeId !== "all") {
    return consignments.filter((c) => c.routeId === routeId);
  }
  return consignments;
}

export function updateMockOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  adminName: string,
  reason?: string
): Order | null {
  const orders = getMockOrders();
  const index = orders.findIndex((o) => o.id === orderId);
  if (index === -1) return null;

  const prev = orders[index];
  const historyEvent: OrderStatusHistoryItem = {
    id: `hist-${Date.now()}`,
    fromStatus: prev.orderStatus,
    toStatus: newStatus,
    statusType: "ORDER",
    timestamp: "Just now",
    adminId: "admin-session",
    adminName: adminName || "Vikram Mehta (Operations Lead)",
    reason: reason,
  };

  let newDeliveryStatus = prev.deliveryStatus;
  let deliveredAt = prev.deliveredAt;

  if (newStatus === "DELIVERED") {
    newDeliveryStatus = "DELIVERED";
    deliveredAt = "Today, " + new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  } else if (newStatus === "DELIVERY_FAILED") {
    newDeliveryStatus = "DELIVERY_FAILED";
  }

  const updated: Order = {
    ...prev,
    orderStatus: newStatus,
    deliveryStatus: newDeliveryStatus,
    deliveredAt: deliveredAt,
    statusHistory: [historyEvent, ...(prev.statusHistory || [])],
  };

  orders[index] = updated;
  saveMockOrders(orders);

  // Sync with Retailer record
  syncRetailerOrderUpdate(
    updated.retailerId,
    updated.orderCode,
    newStatus,
    newDeliveryStatus,
    adminName,
    reason
  );

  return updated;
}

export function updateMockDeliveryStatus(
  orderId: string,
  newDeliveryStatus: DeliveryStatus,
  adminName: string,
  payload?: {
    failureReason?: string;
    followUpAction?: string;
    notes?: string;
  }
): Order | null {
  const orders = getMockOrders();
  const index = orders.findIndex((o) => o.id === orderId || o.consignmentId === orderId);
  if (index === -1) return null;

  const prev = orders[index];
  const historyEvent: OrderStatusHistoryItem = {
    id: `hist-del-${Date.now()}`,
    fromStatus: prev.deliveryStatus,
    toStatus: newDeliveryStatus,
    statusType: "DELIVERY",
    timestamp: "Just now",
    adminId: "admin-session",
    adminName: adminName || "Vikram Mehta (Operations Lead)",
    reason: payload?.failureReason,
    notes: payload?.notes,
  };

  let newOrderStatus = prev.orderStatus;
  let deliveredAt = prev.deliveredAt;

  if (newDeliveryStatus === "DELIVERED") {
    newOrderStatus = "DELIVERED";
    deliveredAt = "Today, " + new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  } else if (newDeliveryStatus === "DELIVERY_FAILED") {
    newOrderStatus = "DELIVERY_FAILED";
  } else if (newDeliveryStatus === "OUT_FOR_DELIVERY") {
    newOrderStatus = "OUT_FOR_DELIVERY";
  }

  const updated: Order = {
    ...prev,
    deliveryStatus: newDeliveryStatus,
    orderStatus: newOrderStatus,
    deliveredAt: deliveredAt,
    deliveryFailureReason: payload?.failureReason || prev.deliveryFailureReason,
    deliveryFollowUpAction: payload?.followUpAction || prev.deliveryFollowUpAction,
    deliveryNotes: payload?.notes || prev.deliveryNotes,
    statusHistory: [historyEvent, ...(prev.statusHistory || [])],
  };

  orders[index] = updated;
  saveMockOrders(orders);

  // Sync with Retailer record
  syncRetailerOrderUpdate(
    updated.retailerId,
    updated.orderCode,
    newOrderStatus,
    newDeliveryStatus,
    adminName,
    payload?.failureReason || payload?.notes
  );

  return updated;
}

export function assignMockOrderRoute(
  orderId: string,
  routeId: string,
  driverName: string,
  vehicleNumber: string,
  adminName: string
): Order | null {
  const orders = getMockOrders();
  const index = orders.findIndex((o) => o.id === orderId);
  if (index === -1) return null;

  const prev = orders[index];
  const routes = getMockDeliveryRoutes();
  const route = routes.find((r) => r.id === routeId);

  const historyEvent: OrderStatusHistoryItem = {
    id: `hist-assign-${Date.now()}`,
    fromStatus: prev.deliveryStatus,
    toStatus: "ASSIGNED",
    statusType: "DELIVERY",
    timestamp: "Just now",
    adminId: "admin-session",
    adminName: adminName || "Vikram Mehta (Operations Lead)",
    notes: `Assigned to ${route?.routeName || routeId} · Van ${vehicleNumber} (${driverName})`,
  };

  const updated: Order = {
    ...prev,
    deliveryStatus: "ASSIGNED",
    deliveryRouteId: routeId,
    deliveryRouteName: route?.routeName || routeId,
    deliveryDriverName: driverName,
    deliveryVehicleNumber: vehicleNumber,
    deliveryDriverPhone: route?.driverPhone || "",
    statusHistory: [historyEvent, ...(prev.statusHistory || [])],
  };

  orders[index] = updated;
  saveMockOrders(orders);
  return updated;
}

export function cancelMockOrder(
  orderId: string,
  adminName: string,
  reason: string
): Order | null {
  return updateMockOrderStatus(orderId, "CANCELLED", adminName, reason);
}
