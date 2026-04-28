/**
 * ══════════════════════════════════════════════
 *  VAMA — Customer Dashboard Mock Data
 *  Order tracking, payment info, and timeline steps.
 *
 *  TODO: replace with backend API calls.
 * ══════════════════════════════════════════════
 */
import { Package, Truck, Navigation, CheckCircle2 } from "lucide-react";

/* ===== TYPES ===== */
export interface TrackingStep {
  id: number;
  title: string;
  description: string;
  time: string;
  status: "completed" | "active" | "pending";
  icon: React.ElementType;
}

export interface MockOrder {
  orderId: string;
  product: {
    name: string;
    quantity: number;
    price: number;
  };
  total: number;
  paymentMode: string;
  estimatedDelivery: string;
  progress: number;
  address: string;
  phone: string;
}

/* ===== PAYMENT ICONS ===== */
export const paymentIcon: Record<string, string> = {
  "Cash on Delivery (COD)": "💵",
  "Online Payment": "🌐",
  UPI: "📲",
  "Card Payment": "💳",
};

/* ===== MOCK ORDER ===== */
// TODO: replace with backend API — Endpoint: GET /api/orders/{orderId}
export function getMockOrder(): MockOrder {
  return {
    orderId: sessionStorage.getItem("orderId") || "ORD-2026-001",
    product: {
      name: "Wireless Noise-Cancelling Headphones",
      quantity: 1,
      price: 2499,
    },
    total: 2499,
    paymentMode: "UPI",
    estimatedDelivery: "Today, 5:30 PM",
    progress: 60,
    address: "402, Sunrise Apartments, MG Road, Bengaluru – 560001",
    phone: "+91 98765 43210",
  };
}

/* ===== TRACKING TIMELINE ===== */
// TODO: replace with backend API — Endpoint: GET /api/orders/{orderId}/tracking
export const trackingSteps: TrackingStep[] = [
  {
    id: 1, title: "Order Placed",
    description: "Your order has been confirmed",
    time: "Apr 10, 9:30 AM", status: "completed", icon: Package,
  },
  {
    id: 2, title: "Warehouse Processing",
    description: "Items being prepared for shipment",
    time: "Apr 10, 10:45 AM", status: "completed", icon: Package,
  },
  {
    id: 3, title: "In Transit",
    description: "Package is on its way to you",
    time: "Apr 10, 2:15 PM", status: "active", icon: Truck,
  },
  {
    id: 4, title: "Out for Delivery",
    description: "Package will arrive soon",
    time: "Expected: 5:30 PM", status: "pending", icon: Navigation,
  },
  {
    id: 5, title: "Delivered",
    description: "Package successfully delivered",
    time: "Pending", status: "pending", icon: CheckCircle2,
  },
];
