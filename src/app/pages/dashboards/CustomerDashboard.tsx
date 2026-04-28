import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import DashboardLayout from "../../components/DashboardLayout";
import RoleEntryModal from "../../components/RoleEntryModal";
import {
  Package, Clock, CreditCard, MapPin, Phone, IndianRupee, Loader2,
} from "lucide-react";
import CustomerProfilePage from "./customer/CustomerProfilePage";
import CustomerSettingsPage from "./customer/CustomerSettingsPage";
import { getOrders, getShipmentByOrderId } from "../../../services/shipmentService";
import { trackingSteps, paymentIcon } from "../../../data/customerData";

function DashboardHome() {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const orderId = sessionStorage.getItem("orderId");
    if (!orderId) { setLoading(false); return; }

    getShipmentByOrderId(orderId)
      .then((data) => { if (data) setOrder(data); })
      .catch(() => {
        // Fallback: try getOrders
        getOrders()
          .then((orders: any) => {
            if (Array.isArray(orders) && orders.length > 0) setOrder(orders[0]);
          })
          .catch(() => {});
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#8B004A]" /></div>;
  if (!order) return <div className="text-center py-20 text-[#9ca3af]">No order data available</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-[#1a1a1a] mb-1">Track Your Order</h2>
        <p className="text-[#555555] text-sm">
          Order ID:{" "}
          <span className="font-mono text-[#8B004A] font-bold">{order.orderId}</span>
        </p>
        <p className="text-[#555555] text-sm mt-1">
          Estimated Delivery:{" "}
          <span className="text-[#8B004A] font-bold">{order.estimatedDelivery}</span>
        </p>
      </motion.div>

      {/* ── Progress Bar ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-2xl p-6 border border-[#E5E5E5] shadow-sm"
      >
        <div className="flex justify-between items-center mb-3">
          <span className="text-[#555555] text-sm font-semibold">Order Progress</span>
          <span className="text-[#1a1a1a] font-bold">{order.progress}%</span>
        </div>
        <div className="w-full h-3 bg-[#F2EFE7] rounded-full overflow-hidden border border-[#E5E5E5]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${order.progress}%` }}
            transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-violet-600 via-cyan-600 to-emerald-600 rounded-full relative"
          >
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-white/30"
            />
          </motion.div>
        </div>
      </motion.div>

      {/* ── Tracking Timeline ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-2xl p-8 border border-[#E5E5E5] shadow-sm"
      >
        <h3 className="text-xl font-bold text-[#1a1a1a] mb-8">Tracking Timeline</h3>

        <div className="space-y-6">
          {trackingSteps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.08 }}
              className="flex gap-5"
            >
              {/* Icon + Line */}
              <div className="flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.08 }}
                  className={`relative w-12 h-12 rounded-full flex items-center justify-center z-10 ${
                    step.status === "completed"
                      ? "bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/30"
                      : step.status === "active"
                      ? "bg-gradient-to-br from-violet-600 to-cyan-600 shadow-lg shadow-violet-600/30"
                      : "bg-[#F2EFE7] border-2 border-[#E5E5E5]"
                  }`}
                >
                  <step.icon
                    className={`w-6 h-6 ${step.status === "pending" ? "text-[#888888]" : "text-[#1a1a1a]"}`}
                  />
                  {step.status === "active" && (
                    <motion.div
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 rounded-full bg-violet-400"
                    />
                  )}
                </motion.div>

                {index < trackingSteps.length - 1 && (
                  <div
                    className={`w-0.5 h-16 mt-2 ${
                      step.status === "completed"
                        ? "bg-gradient-to-b from-emerald-500 to-emerald-500/30"
                        : "bg-[#EDE9E1]"
                    }`}
                  />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-6">
                <div
                  className={`p-4 rounded-xl border transition-all ${
                    step.status === "active"
                      ? "bg-gradient-to-br from-violet-500/15 to-cyan-500/15 border-violet-400/40"
                      : step.status === "completed"
                      ? "bg-[#F9F7F2] border-emerald-500/25"
                      : "bg-[#F9F7F2] border-[rgba(139,0,74,0.1)]"
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="text-lg font-bold text-[#1a1a1a]">{step.title}</h4>
                    {step.status === "active" && (
                      <span className="px-2.5 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-bold flex items-center gap-1 border border-violet-200">
                        <Clock className="w-3 h-3" /> In Progress
                      </span>
                    )}
                  </div>
                  <p className="text-[#555555] text-sm font-medium">{step.description}</p>
                  <p className="text-[#888888] text-xs mt-1 font-semibold">{step.time}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── Order Details + Delivery Info ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Order Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="bg-white rounded-2xl p-6 border border-[#E5E5E5] shadow-sm"
        >
          <h3 className="text-xl font-bold text-[#1a1a1a] mb-6">Order Details</h3>

          {/* Single product card */}
          <div className="p-4 rounded-xl bg-[#F9F7F2] border border-[rgba(139,0,74,0.1)] space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/30 to-cyan-500/30 border border-[rgba(139,0,74,0.1)] flex items-center justify-center flex-shrink-0">
                <Package className="w-5 h-5 text-cyan-300" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold leading-snug">{order.product.name}</p>
                <p className="text-[#9ca3af] text-sm mt-0.5">Qty: {order.product.quantity}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-lg bg-white border border-[#E5E5E5] shadow-sm">
                <p className="text-[10px] text-[#555555] uppercase tracking-wider font-semibold mb-0.5">Order ID</p>
                <p className="text-sm font-mono font-bold text-[#8B004A] truncate">{order.orderId}</p>
              </div>
              <div className="p-3 rounded-lg bg-white border border-[#E5E5E5] shadow-sm">
                <p className="text-[10px] text-[#555555] uppercase tracking-wider font-semibold mb-0.5">Unit Price</p>
                <p className="text-sm font-bold text-[#1a1a1a]">₹{order.product.price.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Total */}
          <div className="mt-5 flex items-center justify-between p-4 rounded-xl bg-[#8B004A]/5 border border-[#8B004A]/20">
            <div className="flex items-center gap-2 text-[#8B004A]">
              <IndianRupee className="w-4 h-4" />
              <span className="font-bold">Total Amount</span>
            </div>
            <span className="text-xl font-black text-[#8B004A]">
              ₹{order.total.toLocaleString()}
            </span>
          </div>
        </motion.div>

        {/* Delivery Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="bg-white rounded-2xl p-6 border border-[#E5E5E5] shadow-sm"
        >
          <h3 className="text-xl font-bold text-[#1a1a1a] mb-6">Delivery Information</h3>

          <div className="space-y-4">
            {/* Delivery Address */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-[#E5E5E5]">
              <div className="w-9 h-9 rounded-lg bg-[#8B004A]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <MapPin className="w-4 h-4 text-[#8B004A]" />
              </div>
              <div>
                <p className="text-[11px] text-[#555555] uppercase tracking-wider font-semibold mb-0.5">Delivery Address</p>
                <p className="text-[#1a1a1a] text-sm font-medium leading-snug">{order.address}</p>
              </div>
            </div>
 
            {/* Contact */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-[#E5E5E5]">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0 border border-emerald-100">
                <Phone className="w-4 h-4 text-[#1F8A4C]" />
              </div>
              <div>
                <p className="text-[11px] text-[#555555] uppercase tracking-wider font-semibold mb-0.5">Contact Number</p>
                <p className="text-[#1a1a1a] text-sm font-bold">{order.phone}</p>
              </div>
            </div>

            {/* Payment Mode */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-100 shadow-sm">
              <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                <CreditCard className="w-4 h-4 text-[#1F8A4C]" />
              </div>
              <div className="flex-1">
                <p className="text-[11px] text-[#555555] uppercase tracking-wider font-semibold mb-0.5">Payment Mode</p>
                <p className="text-[#1a1a1a] text-sm font-bold flex items-center gap-1.5">
                  <span>{paymentIcon[order.paymentMode] ?? "💳"}</span>
                  {order.paymentMode}
                </p>
              </div>
              <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/25 rounded-full px-2.5 py-1 font-semibold">
                Active
              </span>
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
}

// ===== ROOT COMPONENT =====
export default function CustomerDashboard() {
  // ===== STATE =====
  const [orderId, setOrderId] = useState<string | null>(sessionStorage.getItem("orderId"));
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const navigate = useNavigate();

  // ===== HANDLERS =====
  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  // ===== PAGE ROUTING =====
  const renderPage = () => {
    switch (activeMenu) {
      case "profile":
        return <CustomerProfilePage />;
      case "settings":
        return <CustomerSettingsPage onLogout={handleLogout} />;
      default:
        return <DashboardHome />;
    }
  };

  // ===== UI =====
  return (
    <>
      <RoleEntryModal
        isOpen={!orderId}
        role="customer"
        onSave={(id) => setOrderId(id)}
      />
      <DashboardLayout
        role="customer"
        orderId={orderId || ""}
        activeMenu={activeMenu}
        onMenuClick={setActiveMenu}
      >
        {renderPage()}
      </DashboardLayout>
    </>
  );
}
