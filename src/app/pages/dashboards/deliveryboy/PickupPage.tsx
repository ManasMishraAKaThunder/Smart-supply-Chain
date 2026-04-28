import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Package, MapPin, CheckCircle2, Clock, Boxes,
  AlertCircle, Warehouse, ArrowRight, Loader2,
} from "lucide-react";
import { getOrders } from "../../../../services/shipmentService";



type Status = "pending" | "picked-up";

export default function PickupPage() {
  const [pickups, setPickups] = useState<any[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrders()
      .then((data) => setPickups(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#8B004A]" /></div>;

  const toggleStatus = (id: string) => {
    setPickups((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: (p.status === "pending" ? "picked-up" : "pending") as Status }
          : p
      )
    );
    const pk = pickups.find((p) => p.id === id);
    if (pk) {
      const newLabel = pk.status === "pending" ? "Picked Up" : "Pending";
      setToast(`${pk.id} marked as ${newLabel}`);
      setTimeout(() => setToast(null), 2500);
    }
  };

  const pickedUp  = pickups.filter((p) => p.status === "picked-up").length;
  const pending   = pickups.filter((p) => p.status === "pending").length;
  const totalPkgs = pickups.reduce((s, p) => s + p.packages, 0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-bold text-[#1a1a1a]">Pickup Management</h2>
        <p className="text-[#9ca3af] text-sm mt-0.5">Today's scheduled pickups</p>
      </motion.div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Pickups",   value: pickups.length, color: "#60a5fa", icon: Boxes },
          { label: "Picked Up",       value: pickedUp,       color: "#34d399", icon: CheckCircle2 },
          { label: "Remaining",       value: pending,        color: "#fbbf24", icon: AlertCircle },
          { label: "Total Packages",  value: totalPkgs,      color: "#a78bfa", icon: Package },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, delay: i * 0.05 }}
            className="p-4 rounded-2xl bg-[#F9F7F2] border border-[rgba(139,0,74,0.1)] text-center"
          >
            <s.icon className="w-5 h-5 mx-auto mb-1.5" style={{ color: s.color }} />
            <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[10px] text-[#9ca3af] mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-[#9ca3af]">Pickup Progress</span>
          <span className="text-emerald-400 font-bold">{pickups.length > 0 ? Math.round((pickedUp / pickups.length) * 100) : 0}%</span>
        </div>
        <div className="h-2 rounded-full bg-white overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
            initial={{ width: 0 }}
            animate={{ width: `${pickups.length > 0 ? (pickedUp / pickups.length) * 100 : 0}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Pickup list */}
      <div className="space-y-3">
        {pickups.map((pk, i) => {
          const isDone = pk.status === "picked-up";
          return (
            <motion.div
              key={pk.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 + i * 0.04 }}
              whileHover={{ x: 4 }}
              className={`group relative bg-[#F9F7F2] backdrop-blur-xl rounded-2xl border overflow-hidden transition-all duration-300 ${
                isDone ? "border-emerald-500/20" : "border-[rgba(139,0,74,0.1)] hover:border-[rgba(139,0,74,0.2)]"
              }`}
            >
              {/* Left accent */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${isDone ? "bg-emerald-500" : "bg-amber-500"}`} />

              <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 pl-5">
                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isDone
                    ? "bg-emerald-500/15 border border-emerald-500/25"
                    : "bg-amber-500/15 border border-amber-500/25"
                }`}>
                  {isDone ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Warehouse className="w-5 h-5 text-amber-400" />}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-mono text-[#b0a8b0]">{pk.id}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      isDone
                        ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/25"
                        : "bg-amber-500/15 text-amber-400 border-amber-500/25"
                    }`}>
                      {isDone ? "Picked Up" : "Pending"}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-white truncate">{pk.warehouse}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-[#9ca3af]">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{pk.address}</span>
                    <span className="flex items-center gap-1"><Package className="w-3 h-3" />{pk.packages} pkgs</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{pk.time}</span>
                  </div>
                </div>

                {/* Action */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleStatus(pk.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all flex-shrink-0 ${
                    isDone
                      ? "bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/25 text-amber-400"
                      : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/20"
                  }`}
                >
                  {isDone ? "Mark Pending" : "Mark Picked Up"}
                  <ArrowRight className="w-3 h-3" />
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl bg-white backdrop-blur-xl border border-emerald-500/30 shadow-2xl"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-white font-medium">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
