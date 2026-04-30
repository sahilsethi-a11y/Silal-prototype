// Comprehensive mock data for Silal Made in Emirates Marketplace MVP

export type OrderStatus = "pending" | "confirmed" | "processing" | "packed" | "dispatched" | "in_transit" | "delivered" | "cancelled" | "returned";
export type KYCStatus = "pending" | "in_review" | "approved" | "rejected" | "docs_requested";
export type PayoutStatus = "scheduled" | "processing" | "paid" | "failed" | "on_hold";

// ─── Orders ──────────────────────────────────────────────────────────────────

export interface MockOrder {
  id: string;
  orderNumber: string;
  buyerName: string;
  buyerEmail: string;
  supplierName: string;
  supplierId: string;
  items: { name: string; qty: number; unitPrice: number; sku: string }[];
  totalAmount: number;
  currency: "AED";
  status: OrderStatus;
  type: "B2C" | "B2B";
  createdAt: string;
  updatedAt: string;
  deliveryAddress: string;
  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery?: string;
  slaDeadline?: string;
  notes?: string;
}

export const MOCK_ORDERS: MockOrder[] = [
  {
    id: "ord-001",
    orderNumber: "SL-2026-10041",
    buyerName: "Mohammed Al Rashid",
    buyerEmail: "m.alrashid@example.com",
    supplierName: "Al Ain Farms LLC",
    supplierId: "sup-001",
    items: [{ name: "Premium Medjool Dates (1kg)", qty: 5, unitPrice: 85, sku: "DAT-MJD-1KG" }],
    totalAmount: 425,
    currency: "AED",
    status: "in_transit",
    type: "B2C",
    createdAt: "2026-04-28T09:14:00Z",
    updatedAt: "2026-04-29T14:22:00Z",
    deliveryAddress: "Villa 14, Al Khawaneej, Dubai, UAE",
    trackingNumber: "3PL-AE-887342",
    carrier: "Aramex UAE",
    estimatedDelivery: "2026-04-30",
    slaDeadline: "2026-05-01",
  },
  {
    id: "ord-002",
    orderNumber: "SL-2026-10042",
    buyerName: "Sara Johnson",
    buyerEmail: "s.johnson@globalimports.com",
    supplierName: "Emirates Textiles Factory",
    supplierId: "sup-002",
    items: [
      { name: "Premium Cotton Fabric (50m bolt)", qty: 20, unitPrice: 320, sku: "TEX-COT-50M" },
      { name: "Linen Blend Fabric (25m bolt)", qty: 10, unitPrice: 280, sku: "TEX-LIN-25M" },
    ],
    totalAmount: 9200,
    currency: "AED",
    status: "processing",
    type: "B2B",
    createdAt: "2026-04-27T11:30:00Z",
    updatedAt: "2026-04-29T08:00:00Z",
    deliveryAddress: "Warehouse Zone 5, Jebel Ali Free Zone, Dubai",
    trackingNumber: undefined,
    carrier: "DHL Express",
    estimatedDelivery: "2026-05-03",
    slaDeadline: "2026-05-05",
  },
  {
    id: "ord-003",
    orderNumber: "SL-2026-10043",
    buyerName: "Ahmed Al Mansoori",
    buyerEmail: "ahmed@mansoorigroup.ae",
    supplierName: "UAE Fresh Produce Co.",
    supplierId: "sup-003",
    items: [
      { name: "Organic Tomatoes (5kg box)", qty: 50, unitPrice: 28, sku: "VEG-TOM-5KG" },
      { name: "Cucumber (10kg box)", qty: 30, unitPrice: 22, sku: "VEG-CUC-10KG" },
    ],
    totalAmount: 2060,
    currency: "AED",
    status: "delivered",
    type: "B2B",
    createdAt: "2026-04-24T07:00:00Z",
    updatedAt: "2026-04-26T16:45:00Z",
    deliveryAddress: "Al Aweer Central Market, Dubai",
    trackingNumber: "3PL-AE-884211",
    carrier: "Quill Logistics",
    estimatedDelivery: "2026-04-26",
    slaDeadline: "2026-04-27",
  },
  {
    id: "ord-004",
    orderNumber: "SL-2026-10044",
    buyerName: "Fatima Al Zaabi",
    buyerEmail: "f.alzaabi@example.com",
    supplierName: "Abu Dhabi Gaming Hub",
    supplierId: "sup-004",
    items: [{ name: "Desert Runner VR Headset", qty: 1, unitPrice: 1299, sku: "GAM-VR-DR01" }],
    totalAmount: 1299,
    currency: "AED",
    status: "confirmed",
    type: "B2C",
    createdAt: "2026-04-29T20:15:00Z",
    updatedAt: "2026-04-29T20:16:00Z",
    deliveryAddress: "Apt 802, Marina Tower, Abu Dhabi",
    trackingNumber: undefined,
    carrier: "Fetchr",
    estimatedDelivery: "2026-05-02",
    slaDeadline: "2026-05-03",
  },
  {
    id: "ord-005",
    orderNumber: "SL-2026-10045",
    buyerName: "Rajesh Kumar",
    buyerEmail: "r.kumar@techcorp.ae",
    supplierName: "Emirates Electronics Industries",
    supplierId: "sup-005",
    items: [{ name: "Industrial Control Panels", qty: 3, unitPrice: 4500, sku: "ELC-ICP-STD" }],
    totalAmount: 13500,
    currency: "AED",
    status: "pending",
    type: "B2B",
    createdAt: "2026-04-30T06:30:00Z",
    updatedAt: "2026-04-30T06:30:00Z",
    deliveryAddress: "KIZAD Industrial Area, Abu Dhabi",
    estimatedDelivery: "2026-05-07",
    slaDeadline: "2026-05-10",
  },
  {
    id: "ord-006",
    orderNumber: "SL-2026-10046",
    buyerName: "Nour Al Khalidi",
    buyerEmail: "n.khalidi@example.ae",
    supplierName: "Al Ain Farms LLC",
    supplierId: "sup-001",
    items: [{ name: "Organic Honey (500g)", qty: 3, unitPrice: 95, sku: "HON-ORG-500G" }],
    totalAmount: 285,
    currency: "AED",
    status: "packed",
    type: "B2C",
    createdAt: "2026-04-28T15:00:00Z",
    updatedAt: "2026-04-29T11:00:00Z",
    deliveryAddress: "Mussafah, Abu Dhabi",
    carrier: "Aramex UAE",
    estimatedDelivery: "2026-04-30",
    slaDeadline: "2026-05-01",
  },
  {
    id: "ord-007",
    orderNumber: "SL-2026-10047",
    buyerName: "David Chen",
    buyerEmail: "d.chen@cnimports.com",
    supplierName: "UAE Fresh Produce Co.",
    supplierId: "sup-003",
    items: [{ name: "Dates Gift Box (Premium)", qty: 100, unitPrice: 150, sku: "DAT-GFT-PRE" }],
    totalAmount: 15000,
    currency: "AED",
    status: "cancelled",
    type: "B2B",
    createdAt: "2026-04-20T10:00:00Z",
    updatedAt: "2026-04-21T09:00:00Z",
    deliveryAddress: "Cargo Terminal 2, DWC",
    notes: "Buyer cancelled due to change in requirements",
  },
];

// ─── Vendors / Suppliers ──────────────────────────────────────────────────────

export interface MockVendor {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  emirate: "Abu Dhabi" | "Dubai" | "Sharjah" | "Ajman" | "RAK" | "Fujairah" | "UAQ";
  category: string;
  registrationDate: string;
  kycStatus: KYCStatus;
  riskScore: number; // 1-10 (lower is better)
  documents: {
    tradeLicense: boolean;
    emiratesId: boolean;
    bankLetter: boolean;
    originCertificate: boolean;
    exportLicense: boolean;
    halalCertificate?: boolean;
  };
  totalRevenue: number;
  activeProducts: number;
  pendingOrders: number;
  rating: number;
  notes?: string;
}

export const MOCK_VENDORS: MockVendor[] = [
  {
    id: "sup-001",
    name: "Al Ain Farms LLC",
    contactName: "Khalid Al Mazrouei",
    email: "khalid@alainfarms.ae",
    phone: "+971 3 765 4321",
    emirate: "Abu Dhabi",
    category: "Fresh Produce & Agriculture",
    registrationDate: "2026-03-15",
    kycStatus: "approved",
    riskScore: 2,
    documents: { tradeLicense: true, emiratesId: true, bankLetter: true, originCertificate: true, exportLicense: true, halalCertificate: true },
    totalRevenue: 284500,
    activeProducts: 38,
    pendingOrders: 14,
    rating: 4.8,
  },
  {
    id: "sup-002",
    name: "Emirates Textiles Factory",
    contactName: "Hassan Al Dhaheri",
    email: "hassan@emiratestextiles.ae",
    phone: "+971 2 888 7654",
    emirate: "Sharjah",
    category: "Textiles & Apparel",
    registrationDate: "2026-03-28",
    kycStatus: "in_review",
    riskScore: 4,
    documents: { tradeLicense: true, emiratesId: true, bankLetter: false, originCertificate: true, exportLicense: false },
    totalRevenue: 0,
    activeProducts: 0,
    pendingOrders: 0,
    rating: 0,
    notes: "Bank letter requested on Apr 25 — awaiting response",
  },
  {
    id: "sup-003",
    name: "UAE Fresh Produce Co.",
    contactName: "Mariam Al Falasi",
    email: "mariam@uaefreshproduce.ae",
    phone: "+971 4 555 3210",
    emirate: "Dubai",
    category: "Fresh Produce & Agriculture",
    registrationDate: "2026-02-10",
    kycStatus: "approved",
    riskScore: 1,
    documents: { tradeLicense: true, emiratesId: true, bankLetter: true, originCertificate: true, exportLicense: true, halalCertificate: true },
    totalRevenue: 621800,
    activeProducts: 62,
    pendingOrders: 28,
    rating: 4.9,
  },
  {
    id: "sup-004",
    name: "Abu Dhabi Gaming Hub",
    contactName: "Omar Saleh",
    email: "omar@adgaminghub.ae",
    phone: "+971 2 444 5678",
    emirate: "Abu Dhabi",
    category: "Gaming & Entertainment",
    registrationDate: "2026-04-01",
    kycStatus: "docs_requested",
    riskScore: 6,
    documents: { tradeLicense: true, emiratesId: false, bankLetter: false, originCertificate: false, exportLicense: false },
    totalRevenue: 0,
    activeProducts: 3,
    pendingOrders: 1,
    rating: 0,
    notes: "Emirates ID and bank letter missing. Reminded twice.",
  },
  {
    id: "sup-005",
    name: "Emirates Electronics Industries",
    contactName: "Saeed Al Nuaimi",
    email: "saeed@emirateselectronics.ae",
    phone: "+971 2 777 8899",
    emirate: "Abu Dhabi",
    category: "Electronics & Manufacturing",
    registrationDate: "2026-01-20",
    kycStatus: "approved",
    riskScore: 2,
    documents: { tradeLicense: true, emiratesId: true, bankLetter: true, originCertificate: true, exportLicense: true },
    totalRevenue: 1450000,
    activeProducts: 24,
    pendingOrders: 6,
    rating: 4.7,
  },
  {
    id: "sup-006",
    name: "Al Qudra Dairy Products",
    contactName: "Fatima Bin Dhaher",
    email: "fatima@alqudradairy.ae",
    phone: "+971 3 612 4400",
    emirate: "Abu Dhabi",
    category: "Dairy & Food Processing",
    registrationDate: "2026-04-10",
    kycStatus: "pending",
    riskScore: 5,
    documents: { tradeLicense: false, emiratesId: false, bankLetter: false, originCertificate: false, exportLicense: false },
    totalRevenue: 0,
    activeProducts: 0,
    pendingOrders: 0,
    rating: 0,
    notes: "Just registered — KYC documents not yet submitted",
  },
  {
    id: "sup-007",
    name: "Sharjah Polymer Industries",
    contactName: "Ali Al Suwaidi",
    email: "ali@sharjahpolymers.ae",
    phone: "+971 6 522 3344",
    emirate: "Sharjah",
    category: "Plastics & Polymers",
    registrationDate: "2026-03-05",
    kycStatus: "rejected",
    riskScore: 9,
    documents: { tradeLicense: true, emiratesId: true, bankLetter: true, originCertificate: false, exportLicense: true },
    totalRevenue: 0,
    activeProducts: 0,
    pendingOrders: 0,
    rating: 0,
    notes: "Rejected: Submitted counterfeit origin certificate. Flagged by AI moderation.",
  },
];

// ─── Payouts ──────────────────────────────────────────────────────────────────

export interface MockPayout {
  id: string;
  supplierId: string;
  supplierName: string;
  period: string;
  grossRevenue: number;
  platformCommission: number;
  commissionRate: number;
  vatOnCommission: number;
  netPayout: number;
  currency: "AED";
  status: PayoutStatus;
  scheduledDate: string;
  paidDate?: string;
  bankAccount: string;
  ordersCount: number;
  reference?: string;
}

export const MOCK_PAYOUTS: MockPayout[] = [
  {
    id: "pay-001",
    supplierId: "sup-001",
    supplierName: "Al Ain Farms LLC",
    period: "April 1–15, 2026",
    grossRevenue: 142250,
    platformCommission: 14225,
    commissionRate: 10,
    vatOnCommission: 711.25,
    netPayout: 127313.75,
    currency: "AED",
    status: "paid",
    scheduledDate: "2026-04-20",
    paidDate: "2026-04-20",
    bankAccount: "••••7841 (ADCB)",
    ordersCount: 87,
    reference: "TLR-PAY-20260420-001",
  },
  {
    id: "pay-002",
    supplierId: "sup-003",
    supplierName: "UAE Fresh Produce Co.",
    period: "April 1–15, 2026",
    grossRevenue: 310900,
    platformCommission: 31090,
    commissionRate: 10,
    vatOnCommission: 1554.5,
    netPayout: 278255.5,
    currency: "AED",
    status: "paid",
    scheduledDate: "2026-04-20",
    paidDate: "2026-04-20",
    bankAccount: "••••2210 (Emirates NBD)",
    ordersCount: 162,
    reference: "TLR-PAY-20260420-002",
  },
  {
    id: "pay-003",
    supplierId: "sup-005",
    supplierName: "Emirates Electronics Industries",
    period: "April 1–15, 2026",
    grossRevenue: 725000,
    platformCommission: 72500,
    commissionRate: 10,
    vatOnCommission: 3625,
    netPayout: 648875,
    currency: "AED",
    status: "paid",
    scheduledDate: "2026-04-20",
    paidDate: "2026-04-20",
    bankAccount: "••••9033 (FAB)",
    ordersCount: 23,
    reference: "TLR-PAY-20260420-003",
  },
  {
    id: "pay-004",
    supplierId: "sup-001",
    supplierName: "Al Ain Farms LLC",
    period: "April 16–30, 2026",
    grossRevenue: 142250,
    platformCommission: 14225,
    commissionRate: 10,
    vatOnCommission: 711.25,
    netPayout: 127313.75,
    currency: "AED",
    status: "scheduled",
    scheduledDate: "2026-05-05",
    bankAccount: "••••7841 (ADCB)",
    ordersCount: 91,
  },
  {
    id: "pay-005",
    supplierId: "sup-003",
    supplierName: "UAE Fresh Produce Co.",
    period: "April 16–30, 2026",
    grossRevenue: 310900,
    platformCommission: 31090,
    commissionRate: 10,
    vatOnCommission: 1554.5,
    netPayout: 278255.5,
    currency: "AED",
    status: "scheduled",
    scheduledDate: "2026-05-05",
    bankAccount: "••••2210 (Emirates NBD)",
    ordersCount: 178,
  },
  {
    id: "pay-006",
    supplierId: "sup-005",
    supplierName: "Emirates Electronics Industries",
    period: "April 16–30, 2026",
    grossRevenue: 725000,
    platformCommission: 72500,
    commissionRate: 10,
    vatOnCommission: 3625,
    netPayout: 648875,
    currency: "AED",
    status: "processing",
    scheduledDate: "2026-05-05",
    bankAccount: "••••9033 (FAB)",
    ordersCount: 31,
  },
  {
    id: "pay-007",
    supplierId: "sup-004",
    supplierName: "Abu Dhabi Gaming Hub",
    period: "April 16–30, 2026",
    grossRevenue: 1299,
    platformCommission: 129.9,
    commissionRate: 10,
    vatOnCommission: 6.5,
    netPayout: 1162.6,
    currency: "AED",
    status: "on_hold",
    scheduledDate: "2026-05-05",
    bankAccount: "Not verified",
    ordersCount: 1,
    reference: undefined,
  },
];

// ─── Analytics ────────────────────────────────────────────────────────────────

export interface MonthlyRevenue {
  month: string;
  b2c: number;
  b2b: number;
  total: number;
}

export const MONTHLY_REVENUE: MonthlyRevenue[] = [
  { month: "Nov", b2c: 124000, b2b: 380000, total: 504000 },
  { month: "Dec", b2c: 198000, b2b: 520000, total: 718000 },
  { month: "Jan", b2c: 165000, b2b: 440000, total: 605000 },
  { month: "Feb", b2c: 187000, b2b: 510000, total: 697000 },
  { month: "Mar", b2c: 224000, b2b: 621000, total: 845000 },
  { month: "Apr", b2c: 268000, b2b: 742000, total: 1010000 },
];

export interface CategoryBreakdown {
  category: string;
  revenue: number;
  orders: number;
  growth: number;
  color: string;
}

export const CATEGORY_BREAKDOWN: CategoryBreakdown[] = [
  { category: "Fresh Produce & Agriculture", revenue: 906300, orders: 3840, growth: 22.4, color: "#75a843" },
  { category: "Electronics & Manufacturing", revenue: 1450000, orders: 284, growth: 18.1, color: "#174f2a" },
  { category: "Textiles & Apparel", revenue: 412000, orders: 1240, growth: 14.6, color: "#c79a2b" },
  { category: "Dairy & Food Processing", revenue: 238500, orders: 920, growth: 31.2, color: "#3b82f6" },
  { category: "Gaming & Entertainment", revenue: 84000, orders: 580, growth: 45.8, color: "#8b5cf6" },
  { category: "Plastics & Polymers", revenue: 198000, orders: 130, growth: 8.3, color: "#ef4444" },
];

// ─── Logistics / Shipments ────────────────────────────────────────────────────

export interface MockShipment {
  id: string;
  orderId: string;
  orderNumber: string;
  carrier: string;
  trackingNumber: string;
  origin: string;
  destination: string;
  status: "booked" | "picked_up" | "in_transit" | "out_for_delivery" | "delivered" | "exception" | "returned";
  slaHours: number;
  elapsedHours: number;
  estimatedDelivery: string;
  lastEvent: string;
  lastEventTime: string;
  weight: string;
  supplierName: string;
  buyerName: string;
  type: "B2C" | "B2B";
}

export const MOCK_SHIPMENTS: MockShipment[] = [
  {
    id: "shp-001",
    orderId: "ord-001",
    orderNumber: "SL-2026-10041",
    carrier: "Aramex UAE",
    trackingNumber: "3PL-AE-887342",
    origin: "Al Ain Farm Warehouse",
    destination: "Al Khawaneej, Dubai",
    status: "in_transit",
    slaHours: 48,
    elapsedHours: 31,
    estimatedDelivery: "2026-04-30",
    lastEvent: "Departed Dubai hub — out for local delivery zone assignment",
    lastEventTime: "2026-04-29T14:22:00Z",
    weight: "5.2 kg",
    supplierName: "Al Ain Farms LLC",
    buyerName: "Mohammed Al Rashid",
    type: "B2C",
  },
  {
    id: "shp-002",
    orderId: "ord-006",
    orderNumber: "SL-2026-10046",
    carrier: "Aramex UAE",
    trackingNumber: "3PL-AE-887411",
    origin: "Al Ain Farm Warehouse",
    destination: "Mussafah, Abu Dhabi",
    status: "out_for_delivery",
    slaHours: 48,
    elapsedHours: 42,
    estimatedDelivery: "2026-04-30",
    lastEvent: "Out for delivery — driver assigned",
    lastEventTime: "2026-04-30T07:15:00Z",
    weight: "1.8 kg",
    supplierName: "Al Ain Farms LLC",
    buyerName: "Nour Al Khalidi",
    type: "B2C",
  },
  {
    id: "shp-003",
    orderId: "ord-003",
    orderNumber: "SL-2026-10043",
    carrier: "Quill Logistics",
    trackingNumber: "3PL-AE-884211",
    origin: "UAE Fresh Produce, Dubai",
    destination: "Al Aweer Central Market",
    status: "delivered",
    slaHours: 72,
    elapsedHours: 56,
    estimatedDelivery: "2026-04-26",
    lastEvent: "Delivered — signed by Ahmed R. on behalf of Al Mansoori Group",
    lastEventTime: "2026-04-26T16:45:00Z",
    weight: "440 kg",
    supplierName: "UAE Fresh Produce Co.",
    buyerName: "Ahmed Al Mansoori",
    type: "B2B",
  },
  {
    id: "shp-004",
    orderId: "ord-002",
    orderNumber: "SL-2026-10042",
    carrier: "DHL Express",
    trackingNumber: "DHL-558821490",
    origin: "Emirates Textiles, Sharjah",
    destination: "Jebel Ali Free Zone",
    status: "booked",
    slaHours: 96,
    elapsedHours: 8,
    estimatedDelivery: "2026-05-03",
    lastEvent: "Shipment booked — awaiting pickup",
    lastEventTime: "2026-04-29T10:00:00Z",
    weight: "312 kg",
    supplierName: "Emirates Textiles Factory",
    buyerName: "Sara Johnson",
    type: "B2B",
  },
  {
    id: "shp-005",
    orderId: "ord-099",
    orderNumber: "SL-2026-10038",
    carrier: "Fetchr",
    trackingNumber: "FTCR-UAE-993210",
    origin: "Abu Dhabi Gaming Hub",
    destination: "Yas Island, Abu Dhabi",
    status: "exception",
    slaHours: 48,
    elapsedHours: 62,
    estimatedDelivery: "2026-04-28",
    lastEvent: "Delivery exception — address not found; 3 attempts made",
    lastEventTime: "2026-04-29T17:30:00Z",
    weight: "2.1 kg",
    supplierName: "Abu Dhabi Gaming Hub",
    buyerName: "Khalid Al Mubarak",
    type: "B2C",
  },
];

// ─── Merchandising ────────────────────────────────────────────────────────────

export interface MockBanner {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  targetUrl: string;
  imageColor: string;
  status: "active" | "scheduled" | "paused" | "expired";
  placement: "homepage_hero" | "category_top" | "sidebar" | "email";
  startDate: string;
  endDate: string;
  impressions: number;
  clicks: number;
  supplierId?: string;
}

export const MOCK_BANNERS: MockBanner[] = [
  {
    id: "ban-001",
    title: "Ramadan Collection — UAE-Made Gifts",
    subtitle: "Premium dates, sweets & artisan crafts from local farms",
    ctaText: "Shop Now",
    targetUrl: "/products?category=gifts",
    imageColor: "#c79a2b",
    status: "active",
    placement: "homepage_hero",
    startDate: "2026-04-01",
    endDate: "2026-05-15",
    impressions: 84320,
    clicks: 12440,
  },
  {
    id: "ban-002",
    title: "B2B Wholesale — Fresh Produce Direct",
    subtitle: "Bulk orders from UAE-certified farms, cold chain guaranteed",
    ctaText: "Request Quote",
    targetUrl: "/products?category=fresh-produce&mode=wholesale",
    imageColor: "#174f2a",
    status: "active",
    placement: "category_top",
    startDate: "2026-04-10",
    endDate: "2026-05-31",
    impressions: 32180,
    clicks: 4890,
  },
  {
    id: "ban-003",
    title: "New Supplier Spotlight — Emirates Electronics",
    subtitle: "Cutting-edge UAE-manufactured industrial components",
    ctaText: "View Catalog",
    targetUrl: "/seller-details/emirates-electronics",
    imageColor: "#3b82f6",
    status: "scheduled",
    placement: "homepage_hero",
    startDate: "2026-05-01",
    endDate: "2026-05-14",
    impressions: 0,
    clicks: 0,
    supplierId: "sup-005",
  },
  {
    id: "ban-004",
    title: "Summer Fashion — UAE Textile Brands",
    subtitle: "Explore sustainable fashion made right here in the UAE",
    ctaText: "Explore",
    targetUrl: "/products?category=textiles",
    imageColor: "#8b5cf6",
    status: "paused",
    placement: "sidebar",
    startDate: "2026-03-15",
    endDate: "2026-04-30",
    impressions: 21600,
    clicks: 1840,
  },
];

export interface MockFeaturedProduct {
  id: string;
  name: string;
  supplierName: string;
  category: string;
  price: number;
  currency: "AED";
  badge: string;
  boostScore: number;
  position: number;
  status: "featured" | "boosted" | "normal";
  imageColor: string;
}

export const MOCK_FEATURED_PRODUCTS: MockFeaturedProduct[] = [
  { id: "fp-001", name: "Premium Medjool Dates (1kg)", supplierName: "Al Ain Farms LLC", category: "Fresh Produce", price: 85, currency: "AED", badge: "Bestseller", boostScore: 98, position: 1, status: "featured", imageColor: "#c79a2b" },
  { id: "fp-002", name: "Organic Raw Honey (500g)", supplierName: "Al Ain Farms LLC", category: "Fresh Produce", price: 95, currency: "AED", badge: "Made in UAE", boostScore: 92, position: 2, status: "featured", imageColor: "#f59e0b" },
  { id: "fp-003", name: "Industrial Control Panel", supplierName: "Emirates Electronics", category: "Electronics", price: 4500, currency: "AED", badge: "B2B", boostScore: 88, position: 3, status: "boosted", imageColor: "#3b82f6" },
  { id: "fp-004", name: "Premium Cotton Fabric (50m)", supplierName: "Emirates Textiles", category: "Textiles", price: 320, currency: "AED", badge: "Wholesale", boostScore: 81, position: 4, status: "boosted", imageColor: "#6366f1" },
  { id: "fp-005", name: "Desert Runner VR Headset", supplierName: "Abu Dhabi Gaming Hub", category: "Gaming", price: 1299, currency: "AED", badge: "New", boostScore: 74, position: 5, status: "normal", imageColor: "#8b5cf6" },
];

// ─── Dispute / Support ────────────────────────────────────────────────────────

export interface MockDispute {
  id: string;
  orderId: string;
  orderNumber: string;
  buyerName: string;
  supplierName: string;
  type: "payment" | "delivery" | "quality" | "return" | "other";
  status: "open" | "under_review" | "resolved" | "escalated";
  amount: number;
  currency: "AED";
  raisedDate: string;
  description: string;
  resolution?: string;
}

export const MOCK_DISPUTES: MockDispute[] = [
  {
    id: "dis-001",
    orderId: "ord-007",
    orderNumber: "SL-2026-10047",
    buyerName: "David Chen",
    supplierName: "UAE Fresh Produce Co.",
    type: "other",
    status: "resolved",
    amount: 15000,
    currency: "AED",
    raisedDate: "2026-04-21",
    description: "Buyer requested cancellation after payment — refund requested",
    resolution: "Full refund issued via Telr on 2026-04-22. Restocking fee waived.",
  },
  {
    id: "dis-002",
    orderId: "ord-shp-005",
    orderNumber: "SL-2026-10038",
    buyerName: "Khalid Al Mubarak",
    supplierName: "Abu Dhabi Gaming Hub",
    type: "delivery",
    status: "escalated",
    amount: 1299,
    currency: "AED",
    raisedDate: "2026-04-29",
    description: "Item not delivered after 3 attempts; buyer unreachable. SLA breached.",
    resolution: undefined,
  },
  {
    id: "dis-003",
    orderId: "ord-013",
    orderNumber: "SL-2026-10021",
    buyerName: "Layla Al Naqbi",
    supplierName: "Al Ain Farms LLC",
    type: "quality",
    status: "under_review",
    amount: 425,
    currency: "AED",
    raisedDate: "2026-04-27",
    description: "Dates arrived partially spoiled — photos submitted",
    resolution: undefined,
  },
];

// ─── Seller-specific analytics ────────────────────────────────────────────────

export interface SellerWeeklySales {
  day: string;
  b2c: number;
  b2b: number;
}

export const SELLER_WEEKLY_SALES: SellerWeeklySales[] = [
  { day: "Mon", b2c: 3200, b2b: 12400 },
  { day: "Tue", b2c: 4100, b2b: 9800 },
  { day: "Wed", b2c: 3800, b2b: 18600 },
  { day: "Thu", b2c: 5200, b2b: 22100 },
  { day: "Fri", b2c: 7800, b2b: 8400 },
  { day: "Sat", b2c: 9100, b2b: 5200 },
  { day: "Sun", b2c: 6400, b2b: 4100 },
];

export interface SellerTopProduct {
  name: string;
  sku: string;
  sold: number;
  revenue: number;
  stock: number;
  trend: "up" | "down" | "flat";
}

export const SELLER_TOP_PRODUCTS: SellerTopProduct[] = [
  { name: "Premium Medjool Dates (1kg)", sku: "DAT-MJD-1KG", sold: 342, revenue: 29070, stock: 428, trend: "up" },
  { name: "Organic Raw Honey (500g)", sku: "HON-ORG-500G", sold: 218, revenue: 20710, stock: 184, trend: "up" },
  { name: "Dates Gift Box (Premium)", sku: "DAT-GFT-PRE", sold: 112, revenue: 16800, stock: 65, trend: "flat" },
  { name: "Organic Tomatoes (5kg box)", sku: "VEG-TOM-5KG", sold: 94, revenue: 2632, stock: 210, trend: "down" },
  { name: "Camel Milk (1L)", sku: "MLK-CAM-1L", sold: 78, revenue: 4290, stock: 320, trend: "up" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  packed: "Packed",
  dispatched: "Dispatched",
  in_transit: "In Transit",
  delivered: "Delivered",
  cancelled: "Cancelled",
  returned: "Returned",
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-indigo-100 text-indigo-800",
  packed: "bg-cyan-100 text-cyan-800",
  dispatched: "bg-purple-100 text-purple-800",
  in_transit: "bg-orange-100 text-orange-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  returned: "bg-gray-100 text-gray-800",
};

export const KYC_STATUS_LABELS: Record<KYCStatus, string> = {
  pending: "Pending Review",
  in_review: "In Review",
  approved: "Approved",
  rejected: "Rejected",
  docs_requested: "Docs Requested",
};

export const KYC_STATUS_COLORS: Record<KYCStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  in_review: "bg-blue-100 text-blue-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  docs_requested: "bg-orange-100 text-orange-800",
};

export const PAYOUT_STATUS_COLORS: Record<PayoutStatus, string> = {
  scheduled: "bg-blue-100 text-blue-800",
  processing: "bg-indigo-100 text-indigo-800",
  paid: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
  on_hold: "bg-orange-100 text-orange-800",
};

export function formatAED(amount: number): string {
  return `AED ${amount.toLocaleString("en-AE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatAEDCompact(amount: number): string {
  if (amount >= 1_000_000) return `AED ${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `AED ${(amount / 1_000).toFixed(1)}K`;
  return formatAED(amount);
}
