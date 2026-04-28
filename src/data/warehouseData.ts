/**
 * ══════════════════════════════════════════════
 *  VAMA — Warehouse Mock Data
 *  Inventory categories, suppliers, orders, analytics.
 *
 *  TODO: replace each section with backend API calls.
 * ══════════════════════════════════════════════
 */
import { Monitor, Shirt, UtensilsCrossed, Stethoscope, BookOpen, Sofa } from "lucide-react";

/* ===== TYPES ===== */
export interface SubItem {
  id: string;
  name: string;
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  icon: React.ElementType;
  gradient: string;
  items: SubItem[];
}

export interface SupplierData {
  id: number;
  name: string;
  contact: string;
  items: string;
  status: string;
}

export interface OrderData {
  id: string;
  product: string;
  qty: number;
  status: string;
  date: string;
}

export interface Partner {
  name: string;
  rating: number;
  avgTime: string;
  reliability: number;
  status: "good" | "average" | "poor";
}

/* ===== INVENTORY CATEGORIES ===== */
// TODO: replace with backend API — Endpoint: GET /api/inventory
export const initialCategories: Category[] = [
  {
    id: "electronics", name: "Electronics", icon: Monitor, gradient: "from-blue-500 to-cyan-500",
    items: [
      { id: "e1", name: "Mobile Phones", quantity: 120 },
      { id: "e2", name: "Laptops", quantity: 85 },
      { id: "e3", name: "Televisions", quantity: 45 },
      { id: "e4", name: "Tablets", quantity: 200 },
    ],
  },
  {
    id: "clothing", name: "Clothing", icon: Shirt, gradient: "from-violet-500 to-purple-500",
    items: [
      { id: "c1", name: "T-Shirts", quantity: 8 },
      { id: "c2", name: "Jeans", quantity: 12 },
      { id: "c3", name: "Jackets", quantity: 3 },
      { id: "c4", name: "Shoes", quantity: 0 },
    ],
  },
  {
    id: "food", name: "Food Items", icon: UtensilsCrossed, gradient: "from-emerald-500 to-teal-500",
    items: [
      { id: "f1", name: "Rice (50kg bags)", quantity: 340 },
      { id: "f2", name: "Cooking Oil", quantity: 180 },
      { id: "f3", name: "Flour", quantity: 220 },
      { id: "f4", name: "Spices", quantity: 150 },
    ],
  },
  {
    id: "medical", name: "Medical Supplies", icon: Stethoscope, gradient: "from-red-500 to-rose-500",
    items: [
      { id: "m1", name: "First Aid Kits", quantity: 0 },
      { id: "m2", name: "Surgical Masks", quantity: 25 },
      { id: "m3", name: "Sanitizers", quantity: 0 },
      { id: "m4", name: "Bandages", quantity: 18 },
    ],
  },
  {
    id: "books", name: "Books & Stationery", icon: BookOpen, gradient: "from-amber-500 to-orange-500",
    items: [
      { id: "b1", name: "Notebooks", quantity: 200 },
      { id: "b2", name: "Pens & Pencils", quantity: 500 },
      { id: "b3", name: "Textbooks", quantity: 80 },
      { id: "b4", name: "Art Supplies", quantity: 40 },
    ],
  },
  {
    id: "furniture", name: "Furniture", icon: Sofa, gradient: "from-pink-500 to-rose-500",
    items: [
      { id: "fu1", name: "Office Chairs", quantity: 15 },
      { id: "fu2", name: "Desks", quantity: 22 },
      { id: "fu3", name: "Shelving Units", quantity: 5 },
    ],
  },
];

/* ===== DEMAND & ANALYTICS ===== */
// TODO: replace with backend API — Endpoint: GET /api/analytics/demand
export const demandData = [
  { month: "Jan", demand: 4000, supply: 3500 },
  { month: "Feb", demand: 3000, supply: 3200 },
  { month: "Mar", demand: 5000, supply: 4600 },
  { month: "Apr", demand: 4500, supply: 4800 },
  { month: "May", demand: 6000, supply: 5200 },
  { month: "Jun", demand: 5500, supply: 5800 },
];

export const lowStockTrend = [
  { week: "W1", count: 2 }, { week: "W2", count: 3 }, { week: "W3", count: 2 },
  { week: "W4", count: 5 }, { week: "W5", count: 4 }, { week: "W6", count: 3 },
];

export const performanceCompare = [
  { name: "TechParts", supplier: 96, receiver: 0 },
  { name: "MedCorp", supplier: 88, receiver: 0 },
  { name: "FreshFoods", supplier: 92, receiver: 0 },
  { name: "Station Alpha", supplier: 0, receiver: 94 },
  { name: "Depot East", supplier: 0, receiver: 98 },
  { name: "Zone West", supplier: 0, receiver: 85 },
];

/* ===== SUPPLIERS ===== */
// TODO: replace with backend API — Endpoint: GET /api/suppliers
export const suppliersData: SupplierData[] = [
  { id: 1, name: "TechParts Co.", contact: "+91 98765 43210", items: "Electronics, Appliances", status: "active" },
  { id: 2, name: "MedCorp Ltd.", contact: "+91 87654 32109", items: "Medical Supplies", status: "active" },
  { id: 3, name: "FashionHub", contact: "+91 76543 21098", items: "Clothing, Cosmetics", status: "pending" },
  { id: 4, name: "FreshFoods Inc.", contact: "+91 65432 10987", items: "Food Items", status: "active" },
];

/* ===== ORDERS ===== */
// TODO: replace with backend API — Endpoint: GET /api/orders
export const ordersData: OrderData[] = [
  { id: "ORD-001", product: "Electronics", qty: 50, status: "shipped", date: "2026-04-05" },
  { id: "ORD-002", product: "Medical Supplies", qty: 200, status: "processing", date: "2026-04-06" },
  { id: "ORD-003", product: "Clothing", qty: 150, status: "delivered", date: "2026-04-03" },
  { id: "ORD-004", product: "Food Items", qty: 300, status: "shipped", date: "2026-04-04" },
  { id: "ORD-005", product: "Furniture", qty: 25, status: "processing", date: "2026-04-06" },
];

/* ===== PARTNER RATINGS ===== */
// TODO: replace with backend API — Endpoint: GET /api/analytics/supplier-ratings
export const supplierRatings: Partner[] = [
  { name: "TechParts Co.", rating: 4.8, avgTime: "2.1 days", reliability: 96, status: "good" },
  { name: "MedCorp Ltd.", rating: 4.2, avgTime: "3.5 days", reliability: 88, status: "good" },
  { name: "FashionHub", rating: 3.1, avgTime: "5.2 days", reliability: 64, status: "average" },
  { name: "FreshFoods Inc.", rating: 4.5, avgTime: "1.8 days", reliability: 92, status: "good" },
  { name: "BookWorld", rating: 2.4, avgTime: "7.0 days", reliability: 48, status: "poor" },
];

// TODO: replace with backend API — Endpoint: GET /api/analytics/receiver-ratings
export const receiverRatings: Partner[] = [
  { name: "Station Alpha", rating: 4.6, avgTime: "1.5 hrs", reliability: 94, status: "good" },
  { name: "Hub Central", rating: 3.8, avgTime: "3.2 hrs", reliability: 76, status: "average" },
  { name: "Depot East", rating: 4.9, avgTime: "0.8 hrs", reliability: 98, status: "good" },
  { name: "Point South", rating: 2.9, avgTime: "5.5 hrs", reliability: 52, status: "poor" },
  { name: "Zone West", rating: 4.1, avgTime: "2.0 hrs", reliability: 85, status: "good" },
];

/* ===== CHART COLORS ===== */
export const PIE_COLORS = ["#8B004A", "#C4006A", "#6B0039", "#E8739E", "#F5C6DC", "#d97706", "#059669", "#2563eb"];

/* ===== STATUS STYLES ===== */
export const partnerStatusStyle: Record<string, { cls: string; label: string }> = {
  good:    { cls: "status-instock", label: "Good" },
  average: { cls: "status-low",     label: "Average" },
  poor:    { cls: "status-out",     label: "Poor" },
};
