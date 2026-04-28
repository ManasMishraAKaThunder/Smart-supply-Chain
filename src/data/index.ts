/**
 * ══════════════════════════════════════════════
 *  VAMA — Data Layer (barrel export)
 *
 *  Centralizes all mock data, menu configs, and
 *  static datasets. Each file can be swapped out
 *  for backend API calls during integration.
 * ══════════════════════════════════════════════
 */

// ===== MENU CONFIGURATION =====
export * from "./menuConfig";

// ===== SHARED MOCK DATA (shipments, contacts, routes) =====
export * from "./mockData";

// ===== WAREHOUSE-SPECIFIC DATA (inventory, analytics) =====
export * from "./warehouseData";

// ===== CUSTOMER-SPECIFIC DATA (order tracking) =====
export * from "./customerData";
