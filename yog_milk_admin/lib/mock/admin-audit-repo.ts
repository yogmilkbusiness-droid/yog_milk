import { AuditLogEntry, AuditActor } from "@/lib/contracts/audit";

const SYSTEM_ACTORS: Record<string, AuditActor> = {
  root: {
    id: "ADM-001",
    name: "Vikram Mehta",
    role: "Master Ops Root",
    email: "sec-ops@yogmilk.in",
  },
  accounts: {
    id: "ADM-002",
    name: "Sunita Deshmukh",
    role: "Chief Accounts Officer",
    email: "accounts@yogmilk.in",
  },
  dispatch: {
    id: "ADM-003",
    name: "Anand Kulkarni",
    role: "Dispatch Coordinator",
    email: "dispatch@yogmilk.in",
  },
  warehouse: {
    id: "ADM-004",
    name: "Mahesh Patil",
    role: "Cold-Room Supervisor",
    email: "warehouse@yogmilk.in",
  },
};

let auditLogsStore: AuditLogEntry[] = [
  {
    id: "AUD-892104",
    actor: SYSTEM_ACTORS.accounts,
    action: "PAYMENT_RECORDED",
    actionLabel: "Recorded COD Vault Cash Settlement",
    affectedRecord: { type: "PAYMENT", id: "PAY-2026-004", name: "Shree Krishna Milk Centre" },
    previousValue: "Status: PENDING · Outstanding: ₹3,600.00",
    newValue: "Status: PAID · Vault Slip: VAULT-REC-9941 · Rule 4.4 Block Released",
    timestamp: "2026-10-31T14:45:00Z",
    reason: "Cash received from Van #04 driver and physically counted in Pune Central safe.",
    ipAddress: "192.168.1.104",
    tamperSealHash: "sha256:7f0c1a89b4e2d781f33c90e54b12a81203de94028bfe77382109cf8832a884e1",
  },
  {
    id: "AUD-892103",
    actor: SYSTEM_ACTORS.dispatch,
    action: "DELIVERY_STATUS_CHANGED",
    actionLabel: "Progressed Delivery Status",
    affectedRecord: { type: "DELIVERY", id: "DEL-2026-003", name: "Van #02 · Route Kothrud" },
    previousValue: "Status: PICKED_UP",
    newValue: "Status: OUT_FOR_DELIVERY · Temperature: 3.8°C",
    timestamp: "2026-10-31T05:20:00Z",
    reason: "Driver Ramesh Shinde departed chilling dock with morning milk crates.",
    ipAddress: "192.168.1.112",
    tamperSealHash: "sha256:4b19c8f30e718d0982bbfe3a7c615e47890f14562cdd339e802a45671190bcda",
  },
  {
    id: "AUD-892102",
    actor: SYSTEM_ACTORS.root,
    action: "SCHEDULE_UPDATED",
    actionLabel: "Configured Operational Gate Time",
    affectedRecord: { type: "SCHEDULE", id: "SCHED-DEFAULT", name: "Daily Recurring Schedule" },
    previousValue: "Closing Time: 16:30 IST · Cutoff: 45 min",
    newValue: "Closing Time: 17:00 IST · Cutoff: 30 min",
    timestamp: "2026-10-30T17:10:00Z",
    reason: "Extended ordering window for kirana retailers requesting late-afternoon orders.",
    ipAddress: "192.168.1.101",
    tamperSealHash: "sha256:88301fa7924c5bb201e74fa906e534017f8a92bbd210549c71609e530b1c201a",
  },
  {
    id: "AUD-892101",
    actor: SYSTEM_ACTORS.root,
    action: "RETAILER_APPROVED",
    actionLabel: "Approved Retailer Account",
    affectedRecord: { type: "RETAILER", id: "RET-8841", name: "Om Sai Dairy & Sweets" },
    previousValue: "Verification: PENDING_APPROVAL",
    newValue: "Verification: APPROVED · Assigned Route: Route #2 (Pune West)",
    timestamp: "2026-10-30T15:00:00Z",
    reason: "Physical FSSAI certificate and trade license verified with municipal records.",
    ipAddress: "192.168.1.101",
    tamperSealHash: "sha256:12e9b870fa447610c4908a8e3271bc88319f071a629b015e982c76d1e438f902",
  },
  {
    id: "AUD-892100",
    actor: SYSTEM_ACTORS.warehouse,
    action: "PRICE_UPDATED",
    actionLabel: "Updated Wholesale B2B Rate",
    affectedRecord: { type: "PRODUCT", id: "PROD-COW-1L", name: "Gir Cow A2 Milk 1L Pouch" },
    previousValue: "Price: ₹66.00 / Liter",
    newValue: "Price: ₹68.00 / Liter (Historical order snapshots protected)",
    timestamp: "2026-10-29T18:00:00Z",
    reason: "Adjusted for wholesale organic fodder procurement costs approved by management.",
    ipAddress: "192.168.1.118",
    tamperSealHash: "sha256:3a7b9821ef90c88312015fa764b8109d43ec0192bb87265a910ec338871092fe",
  },
  {
    id: "AUD-892099",
    actor: SYSTEM_ACTORS.root,
    action: "BROADCAST_SENT",
    actionLabel: "Dispatched System Announcement",
    affectedRecord: { type: "SETTINGS", id: "BC-DIWALI", name: "Diwali Dawn Dispatch Timings" },
    previousValue: "Draft status",
    newValue: "Broadcasted to 28 active retailers via push & in-app modal",
    timestamp: "2026-10-29T10:00:00Z",
    reason: "Holiday operational protocol notification.",
    ipAddress: "192.168.1.101",
    tamperSealHash: "sha256:9128f01a742bc50912e78fa33418bc9910fa72890d23812bb801947e44a901f4",
  },
  {
    id: "AUD-892098",
    actor: SYSTEM_ACTORS.dispatch,
    action: "ORDER_CONFIRMED",
    actionLabel: "Accepted Commercial Order",
    affectedRecord: { type: "ORDER", id: "ORD-2026-1040", name: "Mauli Milk Dairy" },
    previousValue: "Status: PLACED",
    newValue: "Status: CONFIRMED · Staging Cold Room: Rack 4B",
    timestamp: "2026-10-29T08:15:00Z",
    reason: "Milk intake quota validated against dawn pasteurizer batch run.",
    ipAddress: "192.168.1.112",
    tamperSealHash: "sha256:601ef871b0293847a98213f0982bb71629831a478201fa88921e3381a980bc71",
  },
];

export function getMockAuditLogs(): AuditLogEntry[] {
  return [...auditLogsStore];
}

export function appendMockAuditLog(
  entry: Omit<AuditLogEntry, "id" | "tamperSealHash">
): AuditLogEntry {
  const newId = `AUD-${(892105 + auditLogsStore.length).toString()}`;
  const mockHash = `sha256:${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`;

  const created: AuditLogEntry = {
    ...entry,
    id: newId,
    tamperSealHash: mockHash,
  };

  auditLogsStore = [created, ...auditLogsStore];
  return created;
}

