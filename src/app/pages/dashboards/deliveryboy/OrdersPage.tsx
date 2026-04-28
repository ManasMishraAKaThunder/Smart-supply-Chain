import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Package, MapPin, Clock, User, Phone,
  CheckCircle2, Truck, AlertCircle, Timer, Loader2,
} from "lucide-react";
import { getOrders } from "../../../../services/shipmentService";



const statusConfig: Record<string, { label: string; color: string; bg: string; border: string; icon: React.ElementType }> = {
  pending:            { label: "Pending",          color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200",   icon: AlertCircle },
  "picked-up":        { label: "Picked Up",        color: "text-cyan-700",    bg: "bg-cyan-50",    border: "border-cyan-200",    icon: Package },
  "out-for-delivery": { label: "Out for Delivery",  color: "text-[#8B004A]",    bg: "bg-[#8B004A]/5",    border: "border-[#8B004A]/20",    icon: Truck },
  delivered:          { label: "Delivered",         color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", icon: CheckCircle2 },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrders()
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#8B004A]" /></div>;

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);
  const counts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    "picked-up": orders.filter((o) => o.status === "picked-up").length,
    "out-for-delivery": orders.filter((o) => o.status === "out-for-delivery").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
  };

  const updateStatus = (id: string, next: string) =>
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: next } : o)));

  const nextAction: Record<string, { label: string; next: string; gradient: string }> = {
    pending:            { label: "Mark Picked Up",    next: "picked-up",        gradient: "from-cyan-600 to-blue-600" },
    "picked-up":        { label: "Out for Delivery",  next: "out-for-delivery", gradient: "from-blue-600 to-violet-600" },
    "out-for-delivery": { label: "Mark Delivered",    next: "delivered",        gradient: "from-emerald-600 to-teal-600" },
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-[#1a1a1a]">Today's Orders</h2>
          <p className="text-[#555555] text-sm font-medium mt-0.5">{orders.length} orders assigned for today</p>
        </div>
      </motion.div>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2">
        {(["all", "pending", "picked-up", "out-for-delivery", "delivered"] as const).map((f) => {
          const isActive = filter === f;
          const cfg = f === "all" ? null : statusConfig[f];
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
                isActive
                  ? "bg-[#8B004A] text-white border-[#8B004A] shadow-md shadow-[#8B004A]/20"
                  : "bg-white text-[#555555] border-[#E5E5E5] hover:border-[#8B004A]/30 hover:bg-gray-50"
              }`}
            >
              {f === "all" ? "All" : cfg?.label} ({counts[f]})
            </button>
          );
        })}
      </div>

      {/* Order Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((order, i) => {
          const cfg = statusConfig[order.status];
          const action = nextAction[order.status];
          const Icon = cfg.icon;
          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.04 }}
              whileHover={{ y: -3, scale: 1.01 }}
              className="group relative bg-white rounded-2xl border border-[#E5E5E5] hover:border-[#8B004A]/30 transition-all duration-300 overflow-hidden shadow-sm"
            >
              {/* Top accent */}
              <div className={`absolute top-0 left-0 right-0 h-1 ${cfg.bg.replace("bg-", "bg-opacity-100 bg-")}`} style={{ backgroundColor: cfg.color.replace("text-", "") === "#8B004A" ? "#8B004A" : undefined }} />

              <div className="p-4 space-y-3">
                {/* Header row */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#888888]">{order.id}</span>
                  <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                    <Icon className="w-3 h-3" /> {cfg.label}
                  </span>
                </div>

                {/* Customer */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#8B004A]/10 border border-[#8B004A]/20 flex items-center justify-center">
                    <User className="w-4 h-4 text-[#8B004A]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[#1a1a1a] truncate">{order.customer}</p>
                    <p className="text-[10px] text-[#555555] font-bold">{order.phone}</p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-2 text-xs text-[#555555] font-medium">
                  <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-[#8B004A]" />
                  <span className="leading-snug">{order.address}</span>
                </div>

                {/* Meta tags */}
                <div className="flex items-center gap-3 text-xs text-[#555555] font-bold">
                  <span className="flex items-center gap-1"><Timer className="w-3 h-3 text-[#8B004A]" />{order.time}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-[#8B004A]" />{order.distance}</span>
                </div>

                {/* Action */}
                <div className="pt-2 border-t border-[#E5E5E5]">
                  {action ? (
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => updateStatus(order.id, action.next)}
                        className={`flex-1 py-2 rounded-xl bg-gradient-to-r ${action.gradient} text-white text-xs font-bold shadow-md transition-all`}
                      >
                        {action.label}
                      </motion.button>
                      <motion.a
                        href={`tel:${order.phone}`}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        className="px-3 py-2 rounded-xl bg-white hover:bg-gray-50 border border-[#E5E5E5] text-[#8B004A] transition-all flex items-center shadow-sm"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </motion.a>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2 py-2 text-emerald-700 text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4" /> Completed
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
