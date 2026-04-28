/**
 * ══════════════════════════════════════════════
 *  VAMA — Shared Shipment Mock Data
 *  Used by Supplier, Receiver, and Customer dashboards.
 *
 *  TODO: replace with backend API calls.
 * ══════════════════════════════════════════════
 */
import { CloudRain, TrafficCone } from "lucide-react";

/* ===== TYPES ===== */
export type ShipmentStatus = "in-transit" | "delivered" | "delayed";

export interface Shipment {
  id: string;
  status: ShipmentStatus;
  from: string;
  to: string;
  eta: string;
  progress: number;
  delayReason?: string;
  delayIcon?: React.ElementType;
}

export interface WarehouseContact {
  id: number;
  name: string;
  contact: string;
  location: string;
  rating: number;
  category: string[];
}

export interface SupplierContact {
  id: number;
  name: string;
  contact: string;
  rating: number;
  totalOrders: number;
  isVerified: boolean;
  isPreferred: boolean;
  category: string[];
}

export interface ReceiverContact {
  id: number;
  name: string;
  contact: string;
  rating: number;
  bulkOrders: number;
  isBulkBuyer: boolean;
  isFrequent: boolean;
  category: string[];
}

/* ===== SHIPMENT STATUS STYLES ===== */
export const shipmentStatusCls: Record<ShipmentStatus, { bg: string; text: string; label: string }> = {
  "in-transit": { bg: "bg-blue-50 text-[#1a1a1a] border-blue-200", text: "text-[#1a1a1a]", label: "In Transit" },
  delivered:    { bg: "status-instock",                              text: "text-[#1F8A4C]", label: "Delivered" },
  delayed:      { bg: "status-low",                                  text: "text-[#B76E00]", label: "Delayed" },
};

/* ===== SUPPLIER DASHBOARD — ORDER DATABASE ===== */
// TODO: replace with backend API — Endpoint: GET /api/shipments?orderId={orderId}
export const supplierOrderDatabase: Record<string, Shipment> = {
  "ORD-2026-001": {
    id: "SHP-4201", status: "in-transit", from: "Mumbai Depot", to: "Warehouse Alpha, Delhi",
    eta: "2h 15m", progress: 65,
  },
  "ORD-2026-002": {
    id: "SHP-4202", status: "delayed", from: "Delhi Hub", to: "Warehouse Beta, Jaipur",
    eta: "5h 40m (+2h delay)", progress: 30,
    delayReason: "Delayed due to heavy traffic on NH-44 highway", delayIcon: TrafficCone,
  },
  "ORD-2026-003": {
    id: "SHP-4203", status: "delivered", from: "Chennai Port", to: "Warehouse Gamma, Bangalore",
    eta: "Completed", progress: 100,
  },
  "ORD-2026-004": {
    id: "SHP-4204", status: "delayed", from: "Kolkata Hub", to: "Warehouse Delta, Patna",
    eta: "7h (+3h delay)", progress: 15,
    delayReason: "Delayed due to bad weather — heavy rainfall warning", delayIcon: CloudRain,
  },
};

/* ===== RECEIVER DASHBOARD — ORDER DATABASE ===== */
// TODO: replace with backend API — Endpoint: GET /api/shipments?orderId={orderId}
export const receiverOrderDatabase: Record<string, Shipment> = {
  "ORD-2026-001": {
    id: "SHP-4201", status: "in-transit", from: "Mumbai Depot", to: "Receiver Hub, Delhi",
    eta: "2h 15m", progress: 65,
  },
  "ORD-2026-002": {
    id: "SHP-4202", status: "delayed", from: "Delhi Hub", to: "Receiver Hub, Jaipur",
    eta: "5h 40m (+2h delay)", progress: 30,
    delayReason: "Delayed due to heavy traffic on NH-44 highway", delayIcon: TrafficCone,
  },
  "ORD-2026-003": {
    id: "SHP-4203", status: "delivered", from: "Chennai Port", to: "Receiver Hub, Bangalore",
    eta: "Completed", progress: 100,
  },
  "ORD-2026-004": {
    id: "SHP-4204", status: "delayed", from: "Kolkata Hub", to: "Receiver Hub, Patna",
    eta: "7h (+3h delay)", progress: 15,
    delayReason: "Delayed due to bad weather — heavy rainfall warning", delayIcon: CloudRain,
  },
};

/* ===== SHARED WAREHOUSE CONTACTS ===== */
// TODO: replace with backend API — Endpoint: GET /api/warehouses
export const warehouseContacts: WarehouseContact[] = [
  { id: 1, name: "Warehouse Alpha", contact: "+91 98765 43210", location: "Mumbai, MH", rating: 4.8, category: ["electronics", "others"] },
  { id: 2, name: "Warehouse Beta",  contact: "+91 87654 32109", location: "Delhi, DL",  rating: 4.5, category: ["clothing", "others"] },
  { id: 3, name: "Warehouse Gamma", contact: "+91 76543 21098", location: "Chennai, TN", rating: 4.2, category: ["food", "medical"] },
  { id: 4, name: "Warehouse Delta", contact: "+91 65432 10987", location: "Pune, MH",    rating: 3.9, category: ["electronics", "medical"] },
  { id: 5, name: "Warehouse Epsilon", contact: "+91 54321 09876", location: "Kolkata, WB", rating: 4.6, category: ["food", "clothing"] },
  { id: 6, name: "Warehouse Zeta",  contact: "+91 43210 98765", location: "Hyderabad, TS", rating: 3.5, category: ["others", "electronics"] },
];

/* ===== SUPPLIER CONTACTS (used by Receiver) ===== */
// TODO: replace with backend API — Endpoint: GET /api/suppliers
export const supplierContacts: SupplierContact[] = [
  { id: 1, name: "TechVision Supplies",   contact: "+91 99887 76655", rating: 4.9, totalOrders: 1400, isVerified: true,  isPreferred: true,  category: ["electronics"] },
  { id: 2, name: "MedCorp India",         contact: "+91 88776 65544", rating: 4.6, totalOrders: 920,  isVerified: true,  isPreferred: true,  category: ["medical"] },
  { id: 3, name: "FreshFarm Direct",      contact: "+91 77665 54433", rating: 4.7, totalOrders: 1050, isVerified: true,  isPreferred: false, category: ["food"] },
  { id: 4, name: "UrbanThreads Co.",      contact: "+91 66554 43322", rating: 4.1, totalOrders: 780,  isVerified: true,  isPreferred: true,  category: ["clothing"] },
  { id: 5, name: "AllGoods Distributors", contact: "+91 55443 32211", rating: 3.8, totalOrders: 320,  isVerified: false, isPreferred: false, category: ["electronics", "others"] },
  { id: 6, name: "GreenLeaf Organics",   contact: "+91 44332 21100", rating: 4.4, totalOrders: 560,  isVerified: true,  isPreferred: false, category: ["food", "medical"] },
];

/* ===== RECEIVER CONTACTS (used by Supplier) ===== */
// TODO: replace with backend API — Endpoint: GET /api/receivers
export const receiverContacts: ReceiverContact[] = [
  { id: 1, name: "RetailMart India",     contact: "+91 99887 76655", rating: 4.9, bulkOrders: 1200, isBulkBuyer: true,  isFrequent: true,  category: ["electronics", "clothing"] },
  { id: 2, name: "MedLife Stores",       contact: "+91 88776 65544", rating: 4.3, bulkOrders: 800,  isBulkBuyer: true,  isFrequent: true,  category: ["medical"] },
  { id: 3, name: "QuickBite Foods",      contact: "+91 77665 54433", rating: 4.6, bulkOrders: 950,  isBulkBuyer: false, isFrequent: true,  category: ["food"] },
  { id: 4, name: "StyleHub Retail",      contact: "+91 66554 43322", rating: 3.9, bulkOrders: 400,  isBulkBuyer: false, isFrequent: false, category: ["clothing", "others"] },
  { id: 5, name: "TechZone Outlet",      contact: "+91 55443 32211", rating: 4.7, bulkOrders: 1100, isBulkBuyer: true,  isFrequent: true,  category: ["electronics"] },
  { id: 6, name: "Wellness Pharmacy",    contact: "+91 44332 21100", rating: 4.2, bulkOrders: 650,  isBulkBuyer: true,  isFrequent: false, category: ["medical", "food"] },
];

/* ===== DRIVER ROUTE DATA ===== */
// TODO: replace with backend API — Endpoint: GET /api/routes/optimized
export const driverRoutes = [
  { id: "RT-001", destination: "Warehouse District", distance: "12.5 km", duration: "18 min",  traffic: "Light",    recommended: true },
  { id: "RT-002", destination: "Warehouse District", distance: "14.2 km", duration: "25 min",  traffic: "Heavy",    recommended: false },
  { id: "RT-003", destination: "Warehouse District", distance: "13.8 km", duration: "22 min",  traffic: "Moderate", recommended: false },
];

/* ===== DELIVERY BOY DATA ===== */
// TODO: replace with backend API — Endpoint: GET /api/deliveries/today
export interface DeliveryItem {
  id: string;
  customer: string;
  address: string;
  items: string;
  status: string;
  distance: string;
}

export const deliveryBoyDeliveries: DeliveryItem[] = [
  { id: "DEL-001", customer: "Rahul Mehta",  address: "A-204, Lodha Palava, Dombivli East",   items: "2 packages", status: "picked",          distance: "2.3 km" },
  { id: "DEL-002", customer: "Priya Sharma", address: "Flat 302, Prestige Oasis, Whitefield", items: "1 package",  status: "pending",          distance: "3.1 km" },
  { id: "DEL-003", customer: "Mike Johnson", address: "789 Pine Road, Unit 12",               items: "3 packages", status: "out-for-delivery", distance: "1.8 km" },
];

export const deliveryStatusColors: Record<string, { label: string; cls: string }> = {
  pending:            { label: "Pending",          cls: "status-low" },
  picked:             { label: "Picked",           cls: "status-instock" },
  "out-for-delivery": { label: "Out for Delivery", cls: "bg-blue-50 text-[#8B004A] border-blue-200" },
  delivered:          { label: "Delivered",         cls: "status-instock" },
};
