import api from "./api";

/**
 * ══════════════════════════════════════════════
 *  VAMA — Shipment / Order Service
 *  Spring Boot endpoints: /api/shipments/*
 *                         /api/orders/*
 *                         /api/warehouses/*
 *                         /api/inventory/*
 * ══════════════════════════════════════════════
 */

/* ── Types ──────────────────────────────────── */
export type ShipmentStatus = "in-transit" | "delivered" | "delayed";

export interface Shipment {
  id: string;
  orderId: string;
  status: ShipmentStatus;
  from: string;
  to: string;
  eta: string;
  progress: number;
  delayReason?: string;
}

export interface Order {
  id: string;
  product: string;
  quantity: number;
  status: string;
  date: string;
  total?: number;
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

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  categoryId: string;
}

export interface InventoryCategory {
  id: string;
  name: string;
  items: InventoryItem[];
}

/* ══════════════════════════════════════════════
   SHIPMENT APIs
   ══════════════════════════════════════════════ */

/** Fetch a single shipment by order ID */
export const getShipmentByOrderId = async (orderId: string): Promise<Shipment | null> => {
  try {
    const response = await api.get(`/shipments?orderId=${orderId}`);
    return response.data.data;
  } catch {
    return null;
  }
};

/** Fetch all active shipments for the logged-in user */
export const getActiveShipments = async (): Promise<Shipment[]> => {
  const response = await api.get("/shipments/active");
  return response.data.data;
};

/** Update shipment status (driver/delivery-boy) */
export const updateShipmentStatus = async (
  shipmentId: string,
  status: ShipmentStatus,
  progress: number,
  delayReason?: string
): Promise<void> => {
  await api.put(`/shipments/${shipmentId}/status`, { status, progress, delayReason });
};

/* ══════════════════════════════════════════════
   ORDER APIs
   ══════════════════════════════════════════════ */

/** Fetch all orders for the logged-in user */
export const getOrders = async (): Promise<Order[]> => {
  const response = await api.get("/orders");
  return response.data.data?.content ?? response.data.data;
};

/** Fetch a single order by ID */
export const getOrderById = async (orderId: string): Promise<Order | null> => {
  try {
    const response = await api.get(`/orders/${orderId}`);
    return response.data.data;
  } catch {
    return null;
  }
};

/* ══════════════════════════════════════════════
   WAREHOUSE APIs
   ══════════════════════════════════════════════ */

/** Fetch warehouses, optionally filtered by category */
export const getWarehouses = async (category?: string): Promise<WarehouseContact[]> => {
  const params = category ? { category } : {};
  const response = await api.get("/warehouses", { params });
  return response.data.data;
};

/* ══════════════════════════════════════════════
   SUPPLIER APIs
   ══════════════════════════════════════════════ */

/** Fetch suppliers, optionally filtered by category */
export const getSuppliers = async (category?: string): Promise<SupplierContact[]> => {
  const params = category ? { category } : {};
  const response = await api.get("/suppliers", { params });
  return response.data.data;
};

/* ══════════════════════════════════════════════
   RECEIVER APIs
   ══════════════════════════════════════════════ */

/** Fetch receivers, optionally filtered by category */
export const getReceivers = async (category?: string): Promise<ReceiverContact[]> => {
  const params = category ? { category } : {};
  const response = await api.get("/receivers", { params });
  return response.data.data;
};

/* ══════════════════════════════════════════════
   INVENTORY APIs (Warehouse Holder)
   ══════════════════════════════════════════════ */

/** Fetch all inventory categories with items */
export const getInventory = async (): Promise<InventoryCategory[]> => {
  const response = await api.get("/inventory");
  return response.data.data;
};

/** Update item quantity */
export const updateInventoryItem = async (
  categoryId: string,
  itemId: string,
  quantityDelta: number
): Promise<void> => {
  await api.patch(`/inventory/${categoryId}/items/${itemId}`, { quantityDelta });
};

/** Add new item to a category */
export const addInventoryItem = async (
  categoryId: string,
  name: string,
  quantity: number
): Promise<InventoryItem> => {
  const response = await api.post(`/inventory/${categoryId}/items`, { name, quantity });
  return response.data.data;
};

/** Delete item from a category */
export const deleteInventoryItem = async (categoryId: string, itemId: string): Promise<void> => {
  await api.delete(`/inventory/${categoryId}/items/${itemId}`);
};
