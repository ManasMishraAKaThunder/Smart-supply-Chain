import { createBrowserRouter } from "react-router";
import { lazy, Suspense } from "react";
import Landing from "./pages/VamaLanding";
import SelectRole from "./pages/SelectRole";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import NotificationsPage from "./pages/NotificationsPage";

/* ── Lazy-loaded dashboard pages (code-split) ── */
const WarehouseHolderDashboard = lazy(
  () => import("./pages/dashboards/WarehouseHolderDashboard")
);
const SupplierDashboard = lazy(
  () => import("./pages/dashboards/SupplierDashboard")
);
const ReceiverDashboard = lazy(
  () => import("./pages/dashboards/ReceiverDashboard")
);
const DriverDashboard = lazy(
  () => import("./pages/dashboards/DriverDashboard")
);
const DeliveryBoyDashboard = lazy(
  () => import("./pages/dashboards/DeliveryBoyDashboard")
);
const CustomerDashboard = lazy(
  () => import("./pages/dashboards/CustomerDashboard")
);

/* ── Loading spinner for lazy routes ── */
function LoadingSpinner() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "#0f0f23",
      }}
    >
      <div
        style={{
          width: "48px",
          height: "48px",
          border: "4px solid rgba(99, 102, 241, 0.2)",
          borderTopColor: "#6366f1",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ── Suspense wrapper for lazy components ── */
function LazyRoute({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Landing,
  },
  {
    path: "/notifications",
    Component: NotificationsPage,
  },
  {
    path: "/login/:role",
    Component: Login,
  },
  {
    path: "/register/:role",
    Component: Register,
  },
  {
    path: "/select-role",
    Component: SelectRole,
  },
  {
    path: "/dashboard/warehouse",
    element: (
      <ProtectedRoute allowedRole="warehouse">
        <LazyRoute>
          <WarehouseHolderDashboard />
        </LazyRoute>
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/supplier",
    element: (
      <ProtectedRoute allowedRole="supplier">
        <LazyRoute>
          <SupplierDashboard />
        </LazyRoute>
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/receiver",
    element: (
      <ProtectedRoute allowedRole="receiver">
        <LazyRoute>
          <ReceiverDashboard />
        </LazyRoute>
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/driver",
    element: (
      <ProtectedRoute allowedRole="driver">
        <LazyRoute>
          <DriverDashboard />
        </LazyRoute>
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/delivery-boy",
    element: (
      <ProtectedRoute allowedRole="delivery-boy">
        <LazyRoute>
          <DeliveryBoyDashboard />
        </LazyRoute>
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/customer",
    element: (
      <ProtectedRoute allowedRole="customer">
        <LazyRoute>
          <CustomerDashboard />
        </LazyRoute>
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    Component: NotFound,
  },
]);