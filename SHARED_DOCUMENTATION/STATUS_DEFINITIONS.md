# YOG MILK — Platform Status Definitions & State Machines (STATUS_DEFINITIONS.md)
*Complete Specifications for Order, Payment, Delivery, and Account State Transitions*
*Role: Lead Software Architect | Baseline: Master Project Plan v2.0 (29 October 2026)*

---

## 1. Order Status Lifecycle (`order_status`)

Governs the commercial progression of an order from submission to completion.

### 1.1 State Transition Diagram
```
                     ┌───────────────┐
                     │    PLACED     │
                     └───────┬───────┘
                             │ (Admin/System Confirmation)
                             ▼
                     ┌───────────────┐
                     │   CONFIRMED   │
                     └───────┬───────┘
                             │ (Warehouse Processing Started)
                             ▼
                     ┌───────────────┐
                     │  PROCESSING   │
                     └───────┬───────┘
                             │ (Packaging Complete & Staged)
                             ▼
                     ┌────────────────────┐
                     │ READY_FOR_DELIVERY │
                     └─────────┬──────────┘
                               │ (Loaded into Delivery Vehicle)
                               ▼
                     ┌──────────────────┐
                     │ OUT_FOR_DELIVERY │
                     └─────────┬────────┘
                               │ (Successfully Handed to Retailer)
                               ▼
                     ┌───────────────┐
                     │   DELIVERED   │
                     └───────────────┘

Terminal / Exception Branches:
• From [PLACED, CONFIRMED, PROCESSING] ──► CANCELLED (By Admin or Retailer before cutoff)
• From [OUT_FOR_DELIVERY]              ──► DELIVERY_FAILED (Shop closed / Crate damaged)
```

### 1.2 Order Status Definitions Table
| Status | English Label | Hindi (हिन्दी) | Marathi (मराठी) | Allowed Next States | Permitted Actors | Badge Styling |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `PLACED` | Order Placed | ऑर्डर दर्ज हुई | ऑर्डर नोंदवली | `CONFIRMED`, `PROCESSING`, `CANCELLED` | System, Retailer | Bg: `#e0f2fe`, Text: `#0369a1` |
| `CONFIRMED` | Confirmed | ऑर्डर स्वीकृत | ऑर्डर मंजूर झाली | `PROCESSING`, `CANCELLED` | Admin | Bg: `#e0e7ff`, Text: `#3730a3` |
| `PROCESSING` | In Processing | प्रक्रिया जारी है | प्रक्रिया सुरू आहे | `READY_FOR_DELIVERY`, `CANCELLED` | Admin, Warehouse | Bg: `#fef3c7`, Text: `#b45309` |
| `READY_FOR_DELIVERY` | Ready for Dispatch | प्रेषण के लिए तैयार | वितरणासाठी तयार | `OUT_FOR_DELIVERY`, `CANCELLED` | Admin, Warehouse | Bg: `#fae8ff`, Text: `#86198f` |
| `OUT_FOR_DELIVERY` | Out for Delivery | डिलीवरी के लिए निकला | वितरणासाठी बाहेर पडले | `DELIVERED`, `DELIVERY_FAILED` | Admin, Driver | Bg: `#f3e8ff`, Text: `#7e22ce` |
| `DELIVERED` | Delivered | सफलतापूर्वक डिलीवर | यशस्वीरीत्या पोहोचवले | None (Terminal) | Admin, Driver | Bg: `#dcfce7`, Text: `#15803d` |
| `CANCELLED` | Cancelled | रद्द कर दिया गया | रद्द केले | None (Terminal) | Admin, Retailer | Bg: `#fee2e2`, Text: `#991b1b` |
| `DELIVERY_FAILED` | Delivery Failed | डिलीवरी असफल | वितरण अयशस्वी | `PROCESSING`, `CANCELLED` | Admin, Driver | Bg: `#ffdad6`, Text: `#ba1a1a` |

---

## 2. Payment Status Lifecycle (`payment_status`)

Governs financial settlement. **Completely decoupled from order and delivery statuses.**

### 2.1 State Transition Diagram
```
                     ┌───────────────┐
                     │    PENDING    │
                     └───────┬───────┘
                             │
            ┌────────────────┴────────────────┐
            │ (Online Gateway Attempt)        │ (Admin Records Cash Received)
            ▼                                 ▼
   ┌─────────────────┐               ┌─────────────────┐
   │   PROCESSING    │               │      PAID       │
   └────────┬────────┘               └────────┬────────┘
            │                                 │
     ┌──────┴──────┐                          │ (Full/Partial Refund)
     ▼             ▼                          ▼
┌─────────┐   ┌─────────┐            ┌─────────────────┐
│  PAID   │   │ FAILED  │            │    REFUNDED     │
└─────────┘   └─────────┘            └─────────────────┘
```

### 2.2 Payment Status Definitions Table
| Status | English Label | Hindi (हिन्दी) | Marathi (मराठी) | Definition | Permitted Actors | Badge Styling |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `PENDING` | Payment Pending | भुगतान लंबित | पेमेंट प्रलंबित | Awaiting cash collection or gateway payment | System (Default) | Bg: `#fee2e2`, Text: `#b91c1c` |
| `PROCESSING`| Verifying Payment| भुगतान सत्यापन जारी | पेमेंट पडताळणी सुरू | Online payment gateway session active | System | Bg: `#fef3c7`, Text: `#b45309` |
| `PAID` | Payment Received| भुगतान प्राप्त हुआ | पेमेंट यशस्वी / पूर्ण | Full payment received and verified | Admin (COD), Gateway | Bg: `#dcfce7`, Text: `#15803d` |
| `FAILED` | Payment Failed | भुगतान असफल | पेमेंट अयशस्वी | Gateway transaction declined or timed out | System, Gateway | Bg: `#fecaca`, Text: `#dc2626` |
| `REFUNDED`| Refunded | धनवापसी की गई | परतावा केला | Amount returned to retailer | Admin | Bg: `#f1f5f9`, Text: `#475569` |

---

## 3. Delivery Status Lifecycle (`delivery_status`)

Governs physical transport and logistics dispatch. Linked to `deliveries` table.

### 3.1 State Transition Diagram
```
┌──────────────────┐
│   NOT_ASSIGNED   │
└────────┬─────────┘
         │ (Admin assigns route / vehicle / driver)
         ▼
┌──────────────────┐
│     ASSIGNED     │
└────────┬─────────┘
         │ (Driver acknowledges and picks up crates at depot)
         ▼
┌──────────────────┐
│    PICKED_UP     │
└────────┬─────────┘
         │ (Vehicle departs depot on morning milk route)
         ▼
┌──────────────────┐
│ OUT_FOR_DELIVERY │
└────────┬─────────┘
         │
    ┌────┴─────────────────────────────┐
    │ (Delivered at retailer booth)    │ (Shop closed / unreachable)
    ▼                                  ▼
┌──────────────────┐          ┌──────────────────┐
│    DELIVERED     │          │ DELIVERY_FAILED  │
└──────────────────┘          └──────────────────┘
```

### 3.2 Delivery Status Definitions Table
| Status | English Label | Hindi (हिन्दी) | Marathi (मराठी) | Definition | Permitted Actors | Badge Styling |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `NOT_ASSIGNED`| Awaiting Route | रूट असाइनमेंट बाकी | रूट वाटप बाकी | Staged at warehouse; no vehicle assigned | System | Bg: `#f3f4f6`, Text: `#4b5563` |
| `ASSIGNED` | Driver Assigned | वाहन एवं चालक तय | वाहन आणि चालक नियुक्त | Driver & vehicle allocated to order batch | Admin Dispatch | Bg: `#e0e7ff`, Text: `#3730a3` |
| `PICKED_UP` | Crates Loaded | वाहन में लोड किया | वाहनात भरले | Driver has loaded crates from cold room | Admin, Driver | Bg: `#fae8ff`, Text: `#86198f` |
| `OUT_FOR_DELIVERY`| On Route | वितरण मार्ग पर | वितरणासाठी मार्गावर | Vehicle in transit on morning milk run | Admin, Driver | Bg: `#f3e8ff`, Text: `#7e22ce` |
| `DELIVERED` | Handed Over | सुपुर्द कर दिया | सुपूर्द केले | Crates safely unloaded and accepted | Admin, Driver | Bg: `#dcfce7`, Text: `#15803d` |
| `DELIVERY_FAILED`| Delivery Failed| डिलीवरी असफल | वितरण अयशस्वी | Delivery could not be completed | Admin, Driver | Bg: `#fee2e2`, Text: `#b91c1c` |

---

## 4. Retailer Account Lifecycle (`retailer_status`)

Governs verification of retailer shops before commercial ordering access.

| Status | English Label | Hindi (हिन्दी) | Marathi (मराठी) | Rights & Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| `PENDING_APPROVAL`| Pending Verification | सत्यापन लंबित | पडताळणी प्रलंबित | Can browse catalog, prices. Cannot submit orders. |
| `APPROVED` | Verified & Active | स्वीकृत एवं सक्रिय | मंजूर आणि सक्रिय | Full ordering access subject to schedule and payment restrictions. |
| `SUSPENDED` | Temporarily On Hold | अस्थायी रूप से निलंबित | तात्पुरते स्थगित | Cannot place orders. Reason displayed in app. |
| `REJECTED` | Application Rejected | आवेदन अस्वीकृत | अर्ज नाकारला | Verification failed (invalid address / duplicate shop). |
