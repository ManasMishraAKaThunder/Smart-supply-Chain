/**
 * ══════════════════════════════════════════════
 *  VAMA — Sidebar Menu Configurations
 *  Defines navigation items for each role's dashboard.
 *
 *  TODO: replace with backend API
 *  Endpoint: GET /api/config/menus?role={role}
 * ══════════════════════════════════════════════
 */
import {
  Home, Package, Settings, BarChart3, Bell,
  Warehouse, AlertTriangle, Users, ShoppingCart,
  Boxes, ShoppingBag, Navigation, Bike,
} from "lucide-react";

export interface MenuItem {
  icon: React.ElementType;
  label: string;
  id: string;
}

export const warehouseMenu: MenuItem[] = [
  { icon: Home,          label: "Dashboard",         id: "dashboard" },
  { icon: Boxes,         label: "Inventory",         id: "inventory" },
  { icon: AlertTriangle, label: "Low Stock Alerts",  id: "low-stock" },
  { icon: Users,         label: "Suppliers",         id: "suppliers" },
  { icon: ShoppingCart,  label: "Orders / Shipments",id: "orders" },
  { icon: BarChart3,     label: "Analytics",         id: "analytics" },
  { icon: Bell,          label: "Notifications",     id: "notifications" },
];

export const supplierMenu: MenuItem[] = [
  { icon: Home,      label: "Dashboard",      id: "dashboard" },
  { icon: Warehouse, label: "Warehouses",     id: "warehouses" },
  { icon: Users,     label: "Receivers",      id: "receivers" },
  { icon: Bell,      label: "Notifications",  id: "notifications" },
];

export const receiverMenu: MenuItem[] = [
  { icon: Home,        label: "Dashboard",      id: "dashboard" },
  { icon: Warehouse,   label: "Warehouses",     id: "warehouses" },
  { icon: ShoppingBag, label: "Suppliers",      id: "suppliers" },
  { icon: Bell,        label: "Notifications",  id: "notifications" },
];

export const driverMenu: MenuItem[] = [
  { icon: Home,       label: "Dashboard",      id: "dashboard" },
  { icon: Warehouse,  label: "Warehouses",     id: "warehouses" },
  { icon: Navigation, label: "Suppliers",      id: "suppliers" },
  { icon: Users,      label: "Receivers",      id: "receivers" },
  { icon: Bell,       label: "Notifications",  id: "notifications" },
];

export const deliveryBoyMenu: MenuItem[] = [
  { icon: Home,    label: "Dashboard",         id: "dashboard" },
  { icon: Package, label: "Orders",            id: "orders" },
  { icon: Boxes,   label: "Pickup Management", id: "pickups" },
  { icon: Bell,    label: "Notifications",     id: "notifications" },
];

export const customerMenu: MenuItem[] = [
  { icon: Home, label: "Dashboard",     id: "dashboard" },
  { icon: Bell, label: "Notifications", id: "notifications" },
];

export const defaultMenu: MenuItem[] = [
  { icon: Home,      label: "Dashboard", id: "dashboard" },
  { icon: Package,   label: "Orders",    id: "orders" },
  { icon: BarChart3, label: "Analytics", id: "analytics" },
  { icon: Settings,  label: "Settings",  id: "settings" },
];

/** Returns the menu items for a given role */
export function getMenuForRole(role: string): MenuItem[] {
  switch (role) {
    case "warehouse":    return warehouseMenu;
    case "supplier":     return supplierMenu;
    case "receiver":     return receiverMenu;
    case "driver":       return driverMenu;
    case "delivery-boy": return deliveryBoyMenu;
    case "customer":     return customerMenu;
    default:             return defaultMenu;
  }
}
