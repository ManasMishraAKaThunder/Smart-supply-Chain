import { createBrowserRouter } from "react-router";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import WarehouseSignup from "./pages/WarehouseSignup";
import InventorySetup from "./pages/InventorySetup";
import OrderEntry from "./pages/OrderEntry";
import WarehouseHolderDashboard from "./pages/dashboards/WarehouseHolderDashboard";
import SupplierDashboard from "./pages/dashboards/SupplierDashboard";
import ReceiverDashboard from "./pages/dashboards/ReceiverDashboard";
import DriverDashboard from "./pages/dashboards/DriverDashboard";
import DeliveryBoyDashboard from "./pages/dashboards/DeliveryBoyDashboard";
import CustomerDashboard from "./pages/dashboards/CustomerDashboard";
import NotFound from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Landing,
  },
  {
    path: "/login/:role",
    Component: Login,
  },
  {
    path: "/register/:role",
    Component: Register,
  },
  /* ── Warehouse onboarding flow ── */
  {
    path: "/warehouse/signup",
    Component: WarehouseSignup,
  },
  {
    path: "/warehouse/inventory-setup",
    Component: InventorySetup,
  },
  {
    path: "/order-entry",
    Component: OrderEntry,
  },
  {
    path: "/dashboard/warehouse-holder",
    Component: WarehouseHolderDashboard,
  },
  {
    path: "/dashboard/supplier",
    Component: SupplierDashboard,
  },
  {
    path: "/dashboard/receiver",
    Component: ReceiverDashboard,
  },
  {
    path: "/dashboard/driver",
    Component: DriverDashboard,
  },
  {
    path: "/dashboard/delivery-boy",
    Component: DeliveryBoyDashboard,
  },
  {
    path: "/dashboard/customer",
    Component: CustomerDashboard,
  },
  {
    path: "*",
    Component: NotFound,
  },
]);