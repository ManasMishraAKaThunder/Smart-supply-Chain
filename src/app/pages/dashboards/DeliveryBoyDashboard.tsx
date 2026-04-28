import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import DashboardLayout from "../../components/DashboardLayout";
import RoleEntryModal from "../../components/RoleEntryModal";
import {
  Bike, MapPin, Package, CheckCircle2, Navigation,
  Clock, ArrowRight, Star, Loader2,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { getActiveShipments, updateShipmentStatus } from "../../../services/shipmentService";
import OrdersPage from "./deliveryboy/OrdersPage";
import PickupPage from "./deliveryboy/PickupPage";
import DeliveryBoyProfilePage from "./deliveryboy/DeliveryBoyProfilePage";
import DeliveryBoySettingsPage from "./deliveryboy/DeliveryBoySettingsPage";
import { deliveryStatusColors } from "../../../data/mockData";
import type { DeliveryItem } from "../../../data/mockData";

/* ─── Mini Stats Card (compact) ─── */
function MiniStat({ title, value, icon: Icon, gradient, delay = 0 }: {
  title: string; value: string; icon: React.ElementType; gradient: string; delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      whileHover={{ y: -3, scale: 1.02 }}
      className="group relative bg-[#F9F7F2] backdrop-blur-xl rounded-xl p-4 border border-[rgba(139,0,74,0.1)] hover:border-[rgba(139,0,74,0.2)] transition-all duration-300 overflow-hidden"
    >
      {/* Glow on hover */}
      <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-8 transition-opacity duration-400`} />
      <div className="relative flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg flex-shrink-0`}>
          <Icon className="w-5 h-5 text-[#1a1a1a]" />
        </div>
        <div>
          <p className="text-lg font-bold text-[#1a1a1a] leading-tight">{value}</p>
          <p className="text-[10px] text-[#555555] uppercase tracking-wider">{title}</p>
        </div>
      </div>
    </motion.div>
  );
}

// ===== DASHBOARD HOME =====
function DashboardHome() {
  const [deliveryList, setDeliveryList] = useState<DeliveryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActiveShipments()
      .then((data) => {
        if (Array.isArray(data)) setDeliveryList(data as any);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const nextAction: Record<string, { label: string; next: string; gradient: string }> = {
    pending:            { label: "Mark Picked",      next: "picked",            gradient: "from-cyan-500 to-blue-500" },
    picked:             { label: "Out for Delivery",  next: "out-for-delivery",  gradient: "from-blue-500 to-violet-500" },
    "out-for-delivery": { label: "Mark Delivered",    next: "delivered",         gradient: "from-emerald-500 to-teal-500" },
  };

  const update = (id: string, next: string) =>
    setDeliveryList((prev) => prev.map((d) => (d.id === id ? { ...d, status: next } : d)));

  return (
    <div className="space-y-5">
      {/* ── Compact Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MiniStat title="Delivered Today" value="18" icon={CheckCircle2} gradient="from-emerald-500 to-teal-500" delay={0} />
        <MiniStat title="Out for Delivery" value="5" icon={Bike} gradient="from-blue-500 to-cyan-500" delay={0.05} />
        <MiniStat title="Pending Pickup" value="8" icon={Package} gradient="from-amber-500 to-orange-500" delay={0.1} />
        <MiniStat title="Total Distance" value="32.5 km" icon={MapPin} gradient="from-violet-500 to-purple-500" delay={0.15} />
      </div>

      {/* ── Main grid: Large map + side list ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* ─── Large Map Panel (3 cols) ─── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="lg:col-span-3 bg-[#F9F7F2] backdrop-blur-xl rounded-2xl border border-[rgba(139,0,74,0.1)] overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-[#1a1a1a]">Current Location</h3>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-[#1F8A4C] border border-emerald-200 text-[10px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1F8A4C] animate-pulse" /> Live Tracking
            </span>
            </div>
          </div>

          {/* Map area — significantly larger */}
          {/* TODO: replace with Google Maps API component */}
          {/* TODO: update marker using real-time backend location from WebSocket */}
          <div className="relative h-80 md:h-96 bg-[#F8F6F2] overflow-hidden mx-5 rounded-xl border border-[#E5E5E5]">
            {/* Grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#E5E5E5_1px,transparent_1px),linear-gradient(to_bottom,#E5E5E5_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-25" />

            {/* Route path */}
            <svg className="absolute inset-0 w-full h-full">
              <motion.path
                d="M 60 340 Q 120 260 200 230 T 380 180 T 540 120 T 680 100"
                stroke="url(#routeGrad)"
                strokeWidth="4"
                fill="none"
                strokeDasharray="8 6"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2.5, delay: 0.3, ease: "easeInOut" }}
              />
              <defs>
                <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>

            {/* Start marker */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="absolute bottom-8 left-[8%]"
            >
              <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-lg shadow-emerald-500/50" />
              <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] text-emerald-400 font-semibold whitespace-nowrap">You</span>
            </motion.div>

            {/* Current position (animated) */}
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[55%] left-[35%]"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8B004A] to-[#C4006A] flex items-center justify-center shadow-xl shadow-blue-500/40 border-2 border-[rgba(139,0,74,0.2)]">
                <Bike className="w-5 h-5 text-[#1a1a1a]" />
              </div>
              <div className="absolute -inset-3 rounded-full border-2 border-blue-400/30 animate-ping" />
            </motion.div>

            {/* Next stop marker */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, type: "spring" }}
              className="absolute top-[22%] right-[12%]"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/40">
                <MapPin className="w-4 h-4 text-[#1a1a1a]" />
              </div>
              <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] text-amber-400 font-semibold whitespace-nowrap">Next Stop</span>
            </motion.div>

            {/* Waypoint dots */}
            {[{ top: "42%", left: "55%" }, { top: "32%", left: "70%" }].map((pos, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6 + i * 0.2 }}
                className="absolute w-2.5 h-2.5 rounded-full bg-blue-400/50 border border-blue-400/60"
                style={{ top: pos.top, left: pos.left }}
              />
            ))}
          </div>

          {/* Info bar */}
          <div className="px-5 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#F9F7F2] border border-white/8">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-[#8B004A]" />
                  <div>
                    <p className="text-[10px] text-[#555555] uppercase tracking-wider font-semibold">Next Stop</p>
                    <p className="text-sm text-[#1a1a1a] font-bold">A-204, Lodha Palava</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1 text-cyan-400 font-semibold bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
                    <MapPin className="w-3 h-3" /> 2.3 km
                  </span>
                  <span className="flex items-center gap-1 text-amber-400 font-semibold bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                    <Clock className="w-3 h-3" /> 8 min ETA
                  </span>
                </div>
              </div>
              <Button className="bg-gradient-to-r from-[#8B004A] to-[#C4006A] hover:from-[#6B0039] hover:to-[#8B004A] text-sm px-5 shadow-md shadow-[#8B004A]/20">
                <Navigation className="w-3.5 h-3.5 mr-1.5" /> Navigate
              </Button>
            </div>
          </div>
        </motion.div>

        {/* ─── Right: Deliveries + Performance (2 cols) ─── */}
        <div className="lg:col-span-2 space-y-5">
          {/* Today's Deliveries (compact) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.3 }}
            className="bg-[#F9F7F2] backdrop-blur-xl rounded-2xl border border-[rgba(139,0,74,0.1)] overflow-hidden"
          >
            <div className="px-5 pt-5 pb-3 flex items-center justify-between">
              <h3 className="text-base font-semibold text-[#1a1a1a]">Today's Deliveries</h3>
              <span className="text-xs text-[#555555] font-medium">{deliveryList.length} items</span>
            </div>

            <div className="px-5 pb-4 space-y-3 max-h-80 overflow-y-auto">
              {deliveryList.map((d, i) => {
                const scfg = statusColors[d.status];
                const action = nextAction[d.status];
                return (
                  <motion.div
                    key={d.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: 0.35 + i * 0.06 }}
                    className="p-3 rounded-xl bg-[#F9F7F2] border border-white/8 hover:border-white/15 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-mono text-[#555555]">{d.id}</span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${scfg.cls}`}>
                        {scfg.label}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-[#1a1a1a] mb-0.5">{d.customer}</p>
                    <p className="text-xs text-[#555555] truncate mb-2">{d.address}</p>
                    <div className="flex items-center gap-3 text-[10px] text-[#888888] font-medium mb-2">
                      <span>{d.items}</span><span>•</span><span>{d.distance}</span>
                    </div>
                    {action ? (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => update(d.id, action.next)}
                        className={`w-full py-1.5 rounded-lg bg-gradient-to-r ${action.gradient} text-white text-xs font-semibold transition-all flex items-center justify-center gap-1`}
                      >
                        {action.label} <ArrowRight className="w-3 h-3" />
                      </motion.button>
                    ) : (
                      <div className="flex items-center justify-center gap-1 text-emerald-400 text-xs font-semibold py-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Performance card (compact) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.4 }}
            className="bg-[#F9F7F2] backdrop-blur-xl rounded-2xl border border-[rgba(139,0,74,0.1)] p-5"
          >
            <h3 className="text-base font-semibold text-[#1a1a1a] mb-4">Performance</h3>
            <div className="space-y-3">
              {/* Progress bar */}
              <div>
                <div className="flex justify-between mb-1.5 text-xs">
                  <span className="text-[#555555] font-medium">Daily Target</span>
                  <span className="text-[#1a1a1a] font-bold">72%</span>
                </div>
                <div className="h-2 rounded-full bg-white border border-[#E5E5E5] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "72%" }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full rounded-full bg-gradient-to-r from-[#8B004A] to-[#C4006A]"
                  />
                </div>
              </div>
              {/* Mini stats */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-xl bg-white border border-[#E5E5E5] text-center shadow-sm">
                  <p className="text-[#555555] text-[10px] font-semibold mb-0.5">On-Time</p>
                  <p className="text-[#1a1a1a] font-bold text-base">96%</p>
                </div>
                <div className="p-3 rounded-xl bg-white border border-[#E5E5E5] text-center shadow-sm">
                  <p className="text-[#555555] text-[10px] font-semibold mb-0.5">Rating</p>
                  <p className="text-[#1a1a1a] font-bold text-base flex items-center justify-center gap-1">4.8 <Star className="w-3 h-3 text-amber-500 fill-amber-500" /></p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// ===== ROOT COMPONENT =====
export default function DeliveryBoyDashboard() {
  // ===== STATE =====
  const [deliveryBoyId, setDeliveryBoyId] = useState<string | null>(sessionStorage.getItem("deliveryBoyId"));
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  const renderPage = () => {
    switch (activeMenu) {
      case "orders":
        return <OrdersPage />;
      case "pickups":
        return <PickupPage />;
      case "profile":
        return <DeliveryBoyProfilePage />;
      case "settings":
        return <DeliveryBoySettingsPage onLogout={handleLogout} />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <>
      <RoleEntryModal
        isOpen={!deliveryBoyId}
        role="delivery-boy"
        onSave={(id) => setDeliveryBoyId(id)}
      />
      <DashboardLayout
        role="delivery-boy"
        orderId={deliveryBoyId || ""}
        activeMenu={activeMenu}
        onMenuClick={setActiveMenu}
      >
        {renderPage()}
      </DashboardLayout>
    </>
  );
}
