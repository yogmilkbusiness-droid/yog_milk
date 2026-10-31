"use client";

import * as React from "react";
import { PageHeading } from "@/components/layout/PageHeading";
import { MetricCard } from "@/components/ui/metric-card";
import { FilterBar } from "@/components/ui/filter-bar";
import { SearchInput } from "@/components/ui/search-input";
import { DataTable, Column } from "@/components/features/tables/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { SimpleChart, DataPoint } from "@/components/ui/simple-chart";
import { Timeline, TimelineStep } from "@/components/ui/timeline";
import { NotificationItem } from "@/components/ui/notification-item";
import { ErrorAlert } from "@/components/ui/error-alert";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerClose,
} from "@/components/ui/drawer";
import {
  Milk,
  Truck,
  IndianRupee,
  Users,
  Store,
  Layers,
  Sparkles,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface SampleOrder {
  id: string;
  orderCode: string;
  retailerName: string;
  items: string;
  amount: number;
  orderStatus: "PROCESSING" | "DELIVERED" | "OUT_FOR_DELIVERY";
  paymentStatus: "PENDING" | "PAID";
}

const sampleOrders: SampleOrder[] = [
  {
    id: "1",
    orderCode: "YM-2026-8841",
    retailerName: "Om Sai Dairy & Sweets",
    items: "Cow Milk 1L (24 pkts)",
    amount: 1632,
    orderStatus: "PROCESSING",
    paymentStatus: "PENDING",
  },
  {
    id: "2",
    orderCode: "YM-2026-8842",
    retailerName: "Shree Krishna Milk Centre",
    items: "Buffalo Milk 1L (36 pkts)",
    amount: 2880,
    orderStatus: "OUT_FOR_DELIVERY",
    paymentStatus: "PAID",
  },
  {
    id: "3",
    orderCode: "YM-2026-8843",
    retailerName: "Gajanan Dairy Booth #12",
    items: "Paneer 1kg (10 pkts), Taak (50 pkts)",
    amount: 4800,
    orderStatus: "DELIVERED",
    paymentStatus: "PAID",
  },
];

const chartData: DataPoint[] = [
  { label: "Mon", value: 1200, secondaryValue: 1100 },
  { label: "Tue", value: 1350, secondaryValue: 1250 },
  { label: "Wed", value: 1280, secondaryValue: 1200 },
  { label: "Thu", value: 1420, secondaryValue: 1380 },
  { label: "Fri", value: 1510, secondaryValue: 1490 },
  { label: "Sat", value: 1680, secondaryValue: 1600 },
  { label: "Sun", value: 1750, secondaryValue: 1710 },
];

const timelineSteps: TimelineStep[] = [
  {
    title: "Order Placed & Validated",
    description: "Retailer checked out 24 crates before 17:00 gate closure.",
    timestamp: "04:30 PM",
    status: "completed",
  },
  {
    title: "Warehouse Milk Chilling & Crating",
    description: "Batch tested: FAT 4.5%, SNF 8.5%. Loaded into crates.",
    timestamp: "09:00 PM",
    status: "completed",
  },
  {
    title: "Route 1 Logistics Dispatch",
    description: "Vehicle MH 12 QX 4821 currently en route to Kothrud.",
    timestamp: "05:15 AM",
    status: "current",
  },
  {
    title: "Delivery Confirmation & Proof of Handover",
    description: "Physical signature & crate count verification at booth.",
    status: "upcoming",
  },
];

export default function ComponentsShowcasePage() {
  const [activeTab, setActiveTab] = React.useState("all");
  const [searchValue, setSearchValue] = React.useState("");
  const [switchChecked, setSwitchChecked] = React.useState(true);
  const [checkboxChecked, setCheckboxChecked] = React.useState(false);

  const columns: Column<SampleOrder>[] = [
    {
      key: "orderCode",
      header: "Order Code",
      render: (item) => (
        <span className="font-serif font-bold text-primary">
          #{item.orderCode}
        </span>
      ),
    },
    {
      key: "retailerName",
      header: "Retailer / Booth",
      render: (item) => (
        <div className="flex items-center gap-2">
          <Store className="h-3.5 w-3.5 text-muted-foreground" />
          <span>{item.retailerName}</span>
        </div>
      ),
    },
    { key: "items", header: "Items & Crates" },
    {
      key: "amount",
      header: "Total Payable",
      align: "right",
      render: (item) => (
        <span className="font-mono font-bold">{formatCurrency(item.amount)}</span>
      ),
    },
    {
      key: "orderStatus",
      header: "Order Status",
      render: (item) => (
        <Badge
          variant={
            item.orderStatus === "PROCESSING"
              ? "processing"
              : item.orderStatus === "OUT_FOR_DELIVERY"
              ? "outForDelivery"
              : "delivered"
          }
          showDot
        >
          {item.orderStatus}
        </Badge>
      ),
    },
    {
      key: "paymentStatus",
      header: "Payment Status",
      render: (item) => (
        <Badge
          variant={item.paymentStatus === "PAID" ? "paid" : "pending"}
          showDot
        >
          {item.paymentStatus}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeading
        title="Admin Component Library Showcase"
        description="Comprehensive visual and functional audit of reusable Admin UI components matching Stitch design benchmarks."
        badge={
          <Badge variant="confirmed" showDot>
            Components Ready
          </Badge>
        }
        breadcrumbs={[
          { label: "Admin", href: "/" },
          { label: "Component Showcase" },
        ]}
      />

      {/* 1. Metric Cards */}
      <section className="space-y-4">
        <h2 className="font-serif text-lg font-bold text-primary flex items-center gap-2">
          <Layers className="h-4 w-4 text-secondary" />
          1. Metric Cards with Trends &amp; Subtitles
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Daily Milk"
            value="1,420 L"
            subtitle="118 Crates Dispatched"
            icon={<Milk className="h-4 w-4" />}
            trend={{ value: 8.4, label: "vs yesterday" }}
          />
          <MetricCard
            title="Commercial Revenue"
            value={formatCurrency(84600)}
            subtitle="Non-GST Farm Billing"
            variant="secondary"
            icon={<IndianRupee className="h-4 w-4" />}
            trend={{ value: 12.1, label: "this week" }}
          />
          <MetricCard
            title="Pending COD Debt"
            value={formatCurrency(18400)}
            subtitle="14 Orders Uncollected"
            variant="warning"
            icon={<Truck className="h-4 w-4" />}
            trend={{ value: -4.2, label: "vs last week" }}
          />
          <MetricCard
            title="Retailer Booths"
            value="68 Booths"
            subtitle="Western India Network"
            icon={<Users className="h-4 w-4" />}
            trend={{ value: 5.0, label: "new verified" }}
          />
        </div>
      </section>

      {/* 2. Interactive FilterBar and DataTable */}
      <section className="space-y-4">
        <h2 className="font-serif text-lg font-bold text-primary flex items-center gap-2">
          <Layers className="h-4 w-4 text-secondary" />
          2. Data Table with Status Tabs &amp; Search
        </h2>
        <FilterBar
          tabs={[
            { id: "all", label: "All Orders", count: 3 },
            { id: "processing", label: "Processing", count: 1 },
            { id: "out", label: "Out for Delivery", count: 1 },
            { id: "delivered", label: "Delivered", count: 1 },
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          searchSlot={
            <SearchInput
              value={searchValue}
              onChange={setSearchValue}
              placeholder="Filter by retailer or code..."
            />
          }
          actionsSlot={
            <Button size="sm" variant="outline">
              Export CSV
            </Button>
          }
        />
        <DataTable
          data={sampleOrders}
          columns={columns}
          keyExtractor={(item) => item.id}
        />
      </section>

      {/* 3. Form Controls & Modals */}
      <section className="space-y-4">
        <h2 className="font-serif text-lg font-bold text-primary flex items-center gap-2">
          <Layers className="h-4 w-4 text-secondary" />
          3. Form Controls, Dialogs &amp; Slide-over Drawer
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Fields Card */}
          <Card>
            <CardHeader>
              <CardTitle>Standard High-Density Inputs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label required>Retailer Firm Name</Label>
                <Input placeholder="e.g. Om Sai Dairy & Sweets" />
              </div>
              <div className="space-y-1">
                <Label required>Delivery Route Assignment</Label>
                <Select defaultValue="route-1">
                  <option value="route-1">Route 1: Kothrud – Karve Nagar</option>
                  <option value="route-2">Route 2: Hadapsar – Magarpatta</option>
                  <option value="route-3">Route 3: Wakad – Hinjewadi</option>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Operational Dispatch Notes</Label>
                <Textarea placeholder="Special handling notes, ice pack requirements..." />
              </div>
              <div className="pt-2 border-t border-dairy-subtle space-y-3">
                <Switch
                  checked={switchChecked}
                  onCheckedChange={setSwitchChecked}
                  label="Automated Ordering Gate Active"
                  description="Enforces 07:00 to 17:00 IST ordering window"
                />
                <Checkbox
                  checked={checkboxChecked}
                  onCheckedChange={setCheckboxChecked}
                  label="Verify cash receipt with physical collection voucher"
                />
              </div>
            </CardContent>
          </Card>

          {/* Dialog & Drawer Triggers Card */}
          <Card>
            <CardHeader>
              <CardTitle>Modals &amp; Slide-over Drawers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-muted-foreground">
                Accessible Radix UI centered dialogs for verification and slide-over drawers for dispatch triage:
              </p>
              <div className="flex flex-wrap gap-3">
                {/* Dialog Trigger */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Open Verification Modal</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Approve Retailer Application</DialogTitle>
                      <DialogDescription>
                        Confirm FSSAI credentials and booth address for Om Sai Dairy &amp; Sweets.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-2 text-xs space-y-2">
                      <p><strong>Owner:</strong> Ramesh Patil</p>
                      <p><strong>Location:</strong> Kothrud, Pune</p>
                      <p><strong>Expected Daily Milk:</strong> 25 Crates (300 Liters)</p>
                    </div>
                    <DialogFooter>
                      <Button variant="outline">Cancel</Button>
                      <Button>Approve Retailer</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Drawer Trigger */}
                <Drawer>
                  <DrawerTrigger asChild>
                    <Button>
                      <Truck className="h-4 w-4 mr-1.5" />
                      Open Route Drawer
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent width="max-w-md" aria-label="Route Assignment Drawer">
                    <div className="space-y-4 text-xs">
                      <p className="text-muted-foreground">
                        Assign selected orders to Morning Milk Dispatch Route 1.
                      </p>
                      <div className="p-3 bg-dairy-surface-low rounded-lg space-y-1">
                        <p className="font-bold text-primary">Driver: Santosh Jadhav</p>
                        <p className="text-muted-foreground">Vehicle: MH 12 QX 4821</p>
                        <p className="text-muted-foreground">Capacity: 120 Crates (Current: 84 Crates)</p>
                      </div>
                      <DrawerClose asChild>
                        <Button className="w-full mt-4">Confirm Route Assignment</Button>
                      </DrawerClose>
                    </div>
                  </DrawerContent>
                </Drawer>
              </div>

              {/* Inline Alert Banner */}
              <div className="pt-4 border-t border-dairy-subtle">
                <ErrorAlert
                  title="Payment Restriction Active"
                  message="Retailer Om Sai Dairy has an unresolved balance of ₹2,450.00 from Order #YM-2026-8841. New order submission is blocked."
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 4. Data Visualizations & Timeline */}
      <section className="space-y-4">
        <h2 className="font-serif text-lg font-bold text-primary flex items-center gap-2">
          <Layers className="h-4 w-4 text-secondary" />
          4. Charts &amp; Order Lifecycle Timeline
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Daily Milk Dispatch Volume (Liters)</CardTitle>
                <Badge variant="confirmed">Weekly Trend</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <SimpleChart data={chartData} type="bar" height={220} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Lifecycle Progression Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <Timeline steps={timelineSteps} />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 5. Notification Flyout Items */}
      <section className="space-y-4">
        <h2 className="font-serif text-lg font-bold text-primary flex items-center gap-2">
          <Layers className="h-4 w-4 text-secondary" />
          5. Operational Notifications
        </h2>
        <div className="space-y-2 max-w-2xl">
          <NotificationItem
            title="Cash on Delivery Payment Handover Ready"
            message="Driver Santosh Jadhav has collected ₹12,400 cash on Route 1. Ready for cashier ledger reconciliation."
            timestamp="12 mins ago"
            severity="warning"
            read={false}
          />
          <NotificationItem
            title="Operational Gate Closure Notice"
            message="Automated ordering window will close at 17:00 IST today. 54 retailer booths confirmed."
            timestamp="1 hour ago"
            severity="info"
            read={true}
          />
        </div>
      </section>
    </div>
  );
}

