import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import DashboardLayout from "../../components/DashboardLayout";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Truck, Clock, CheckCircle2, AlertCircle, MapPin, Phone,
  Star, Package, CloudRain, TrafficCone,
  ArrowRight, ChevronRight, TrendingUp, Zap, Users,
  User, Mail, Edit3, Save, Building2, Tag, Loader2,
} from "lucide-react";
import { getShipmentByOrderId, getWarehouses, getReceivers } from "../../../services/shipmentService";
import { getUserProfile, updateUserProfile } from "../../../services/userService";

/* ══════════════════════════════════════
   DATA & TYPES
   ══════════════════════════════════════ */
type SupplyCategory = "electronics" | "clothing" | "food" | "medical" | "others";
type ShipmentStatus = "in-transit" | "delivered" | "delayed";

interface Shipment {
  id: string;
  status: ShipmentStatus;
  from: string;
  to: string;
  eta: string;
  progress: number;
  delayReason?: string;
  delayIcon?: React.ElementType;
}

interface WarehouseContact {
  id: number;
  name: string;
  contact: string;
  location: string;
  rating: number;
  category: SupplyCategory[];
}

interface ReceiverContact {
  id: number;
  name: string;
  contact: string;
  rating: number;
  bulkOrders: number;
  isBulkBuyer: boolean;
  isFrequent: boolean;
  category: SupplyCategory[];
}

const categoryOptions: { id: SupplyCategory; label: string; icon: string }[] = [
  { id: "electronics", label: "Electronics", icon: "💻" },
  { id: "clothing", label: "Clothing", icon: "👕" },
  { id: "food", label: "Food Items", icon: "🍎" },
  { id: "medical", label: "Medical", icon: "💊" },
  { id: "others", label: "Others", icon: "📦" },
];

/* hardcoded data removed — fetched from backend API */

/* ══════════════════════════════════════
   HELPERS
   ══════════════════════════════════════ */
function Card({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay }}
      className={`bg-white rounded-2xl p-6 border border-[rgba(139,0,74,0.08)] ${className}`}>
      {children}
    </motion.div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`w-3.5 h-3.5 ${i <= Math.floor(rating) ? "text-amber-400 fill-amber-400" : i - 0.5 <= rating ? "text-amber-400 fill-amber-400/40" : "text-gray-200"}`} />
      ))}
      <span className="text-gray-500 text-xs ml-1.5 tabular-nums">{rating.toFixed(1)}</span>
    </div>
  );
}

const statusCls: Record<ShipmentStatus, { bg: string; text: string; label: string }> = {
  "in-transit": { bg: "bg-blue-50 text-[#1a1a1a] border-blue-200", text: "text-[#1a1a1a]", label: "In Transit" },
  delivered: { bg: "status-instock", text: "text-[#1F8A4C]", label: "Delivered" },
  delayed: { bg: "status-low", text: "text-[#B76E00]", label: "Delayed" },
};

const inputCls = "bg-white border-[#E5E5E5] text-[#1a1a1a] placeholder:text-[#888888] focus:border-[#8B004A]/40";

/* ══════════════════════════════════════
   STEP 1 — SELECT SUPPLY TYPE
   ══════════════════════════════════════ */
function SupplyTypeStep({ onSelect }: { onSelect: (cat: SupplyCategory) => void }) {
  const [selected, setSelected] = useState<SupplyCategory | null>(null);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/25 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white backdrop-blur-2xl rounded-2xl border border-[rgba(139,0,74,0.1)] shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8B004A] to-[#C4006A] p-3.5 mx-auto mb-5 shadow-lg shadow-[#8B004A]/25">
            <Package className="w-full h-full text-[#1a1a1a]" />
          </div>
          <h2 className="text-2xl font-bold text-[#1a1a1a] mb-2">What do you supply?</h2>
          <p className="text-[#555555] text-sm">Select your category to get started</p>
        </div>

        <div className="px-8 pb-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {categoryOptions.map((cat) => (
            <button key={cat.id} onClick={() => setSelected(cat.id)}
              className={`p-4 rounded-xl border transition-all duration-200 text-center ${selected === cat.id
                  ? "bg-[#8B004A] border-[#8B004A] shadow-sm shadow-[#8B004A]/20"
                  : "bg-[#F9F7F2] border-[rgba(139,0,74,0.1)] hover:border-[rgba(139,0,74,0.3)] hover:bg-[rgba(139,0,74,0.05)]"
                }`}>
              <span className="text-2xl block mb-1.5">{cat.icon}</span>
              <span className={`block text-sm font-semibold text-center ${selected === cat.id ? "text-[#FFFFFF]" : "text-[#000000]"}`}>
                 {cat.label}
              </span>
            </button>
          ))}
        </div>

        <div className="p-6 pt-2">
          <Button disabled={!selected} onClick={() => selected && onSelect(selected)}
            className="w-full bg-gradient-to-r from-[#8B004A] to-[#C4006A] hover:from-[#6B0039] hover:to-[#8B004A] h-12 text-lg shadow-lg shadow-[#8B004A]/15 disabled:opacity-40">
            Continue <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════
   STEP 2 — ENTER ORDER ID
   ══════════════════════════════════════ */
function OrderIdStep({ onSubmit }: { onSubmit: (id: string, shipment: Shipment) => void }) {
  const [orderId, setOrderId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const trimmed = orderId.trim().toUpperCase();
    if (!trimmed) { setError("Please enter an Order ID"); return; }
    try {
      setLoading(true);
      setError("");
      const shipment = await getShipmentByOrderId(trimmed);
      if (!shipment) { setError(`Order "${trimmed}" not found`); return; }
      onSubmit(trimmed, shipment as Shipment);
    } catch {
      setError("Failed to look up order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/25 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white backdrop-blur-2xl rounded-2xl border border-[rgba(139,0,74,0.1)] shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8B004A] to-[#C4006A] p-3.5 mx-auto mb-5 shadow-lg shadow-[#8B004A]/25">
            <Truck className="w-full h-full text-[#1a1a1a]" />
          </div>
          <h2 className="text-2xl font-bold text-[#1a1a1a] mb-2">Enter Order ID</h2>
          <p className="text-[#555555] text-sm">Track your shipment</p>
        </div>

        <div className="px-8 pb-6 space-y-4">
          <div>
            <Input
              placeholder="e.g. ORD-2026-001"
              value={orderId}
              onChange={(e) => { setOrderId(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              disabled={loading}
              className={`${inputCls} h-12 text-center text-lg font-mono tracking-wider ${error ? "border-red-500/50" : ""}`}
            />
            {error && (
              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-xs mt-2 text-center">{error}</motion.p>
            )}
          </div>

          <Button onClick={handleSubmit} disabled={loading} className="w-full bg-gradient-to-r from-[#8B004A] to-[#C4006A] hover:from-[#6B0039] hover:to-[#8B004A] h-12 text-lg shadow-lg shadow-violet-500/15">
            {loading ? <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Looking up...</> : <>Track Shipment <ArrowRight className="w-5 h-5 ml-2" /></>}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════
   TRACKING PAGE — MAP + ORDER INFO ONLY
   ══════════════════════════════════════ */
function TrackingPage({ shipment, orderId }: { shipment: Shipment; orderId: string }) {
  const st = statusCls[shipment.status];
  const DIcon = shipment.delayIcon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-2xl font-bold text-[#1a1a1a]">Shipment Status</h2>
          <p className="text-[#9ca3af] text-sm">Order: <span className="text-[#8B004A] font-mono">{orderId}</span> · Shipment: <span className="font-mono">{shipment.id}</span></p>
        </div>
        <span className={`px-3 py-1.5 rounded-full text-sm font-semibold border ${st.bg} ${st.text}`}>{st.label}</span>
      </div>

      {/* Live Map */}
      {/* TODO: replace with Google Maps component using real-time backend location */}
      {/* TODO: update marker using real-time backend location from WebSocket */}
      <Card delay={0.1} className="!p-0 overflow-hidden">
        <div className="relative h-64 md:h-80 bg-gradient-to-br from-[#F9F7F2] via-[#EDE9E1] to-[#F9F7F2]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:3rem_3rem]" />

          {/* Route path */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 320" preserveAspectRatio="none">
            <path d="M 80 260 Q 200 180, 350 200 Q 500 220, 600 140 Q 680 90, 720 70" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" strokeLinecap="round" />
            <path d="M 80 260 Q 200 180, 350 200 Q 500 220, 600 140 Q 680 90, 720 70" fill="none" stroke="rgba(59,130,246,0.5)" strokeWidth="3" strokeDasharray="12 6">
              <animate attributeName="stroke-dashoffset" from="18" to="0" dur="1.5s" repeatCount="indefinite" />
            </path>
          </svg>

          {/* Origin pin */}
          <div className="absolute left-[8%] top-[75%] flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/40">
              <MapPin className="w-4 h-4 text-[#1a1a1a]" />
            </div>
            <span className="text-[10px] text-[#8B004A] mt-1 font-medium bg-slate-900/80 px-1.5 py-0.5 rounded">{shipment.from}</span>
          </div>

          {/* Truck / status marker */}
          {shipment.status !== "delivered" && (
            <motion.div
              animate={shipment.status === "delayed" ? { scale: [1, 1.08, 1] } : {}}
              transition={shipment.status === "delayed" ? { repeat: Infinity, duration: 1.5 } : {}}
              style={{ left: `${Math.max(12, shipment.progress * 0.75 + 5)}%`, top: `${80 - shipment.progress * 0.65}%` }}
              className="absolute flex flex-col items-center"
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-lg ${shipment.status === "delayed"
                  ? "bg-gradient-to-br from-red-500 to-rose-500 shadow-red-500/40"
                  : "bg-gradient-to-br from-emerald-500 to-teal-500 shadow-emerald-500/40"
                }`}>
                {shipment.status === "delayed" ? <AlertCircle className="w-5 h-5 text-[#1a1a1a]" /> : <Truck className="w-5 h-5 text-[#1a1a1a]" />}
              </div>
              <span className={`text-[10px] mt-1 font-medium bg-slate-900/80 px-1.5 py-0.5 rounded ${shipment.status === "delayed" ? "text-red-300" : "text-emerald-300"
                }`}>
                {shipment.id} {shipment.status === "delayed" && "⚠️"}
              </span>
            </motion.div>
          )}

          {/* Destination pin */}
          <div className="absolute right-[8%] top-[15%] flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${shipment.status === "delivered" ? "bg-emerald-500 shadow-emerald-500/40" : "bg-white/20 shadow-white/10"
              }`}>
              {shipment.status === "delivered" ? <CheckCircle2 className="w-4 h-4 text-[#1a1a1a]" /> : <MapPin className="w-4 h-4 text-white/60" />}
            </div>
            <span className="text-[10px] text-[#6b6b6b] mt-1 font-medium bg-slate-900/80 px-1.5 py-0.5 rounded">{shipment.to}</span>
          </div>

          {/* Legend */}
          <div className="absolute bottom-3 right-3 flex gap-3 bg-slate-900/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-[rgba(139,0,74,0.1)]">
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-blue-500" /><span className="text-[10px] text-[#6b6b6b]">In Transit</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" /><span className="text-[10px] text-[#6b6b6b]">Delayed</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500" /><span className="text-[10px] text-[#6b6b6b]">Delivered</span></div>
          </div>
        </div>
      </Card>

      {/* Order Info Card */}
      <Card delay={0.2}>
        {/* Progress bar */}
        <div className="mb-5">
          <div className="flex items-center justify-between text-xs text-[#9ca3af] mb-1.5">
            <span>{shipment.from}</span>
            <span>{shipment.to}</span>
          </div>
          <div className="h-2.5 rounded-full bg-[#F2EFE7] overflow-hidden border border-[rgba(139,0,74,0.08)]">
            <motion.div initial={{ width: 0 }} animate={{ width: `${shipment.progress}%` }} transition={{ duration: 1.2, ease: "easeOut" }}
              className={`h-full rounded-full ${shipment.status === "delayed" ? "bg-gradient-to-r from-red-500 to-red-400" : shipment.status === "delivered" ? "bg-gradient-to-r from-emerald-500 to-emerald-400" : "bg-gradient-to-r from-blue-500 to-cyan-400"}`} />
          </div>
          <p className="text-right text-xs text-white/40 mt-1 tabular-nums">{shipment.progress}% complete</p>
        </div>

        {/* Delay alert */}
        {shipment.delayReason && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="flex items-center gap-3 bg-red-500/[0.08] rounded-xl px-4 py-3 border border-red-500/20 mb-5">
            {DIcon && <DIcon className="w-5 h-5 text-red-400 shrink-0" />}
            <div>
              <p className="text-red-400 text-sm font-semibold">Shipment Delayed</p>
              <p className="text-red-300/70 text-xs">{shipment.delayReason}</p>
            </div>
          </motion.div>
        )}

        {/* Info grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-[#F9F7F2] rounded-lg p-3 border border-white/5">
            <p className="text-[10px] text-[#b0a8b0] uppercase tracking-wider">Order ID</p>
            <p className="text-white font-mono text-sm mt-0.5">{orderId}</p>
          </div>
          <div className="bg-[#F9F7F2] rounded-lg p-3 border border-white/5">
            <p className="text-[10px] text-[#b0a8b0] uppercase tracking-wider">Shipment</p>
            <p className="text-white font-mono text-sm mt-0.5">{shipment.id}</p>
          </div>
          <div className="bg-[#F9F7F2] rounded-lg p-3 border border-white/5">
            <p className="text-[10px] text-[#b0a8b0] uppercase tracking-wider">Status</p>
            <p className={`text-sm mt-0.5 font-semibold ${st.text}`}>{st.label}</p>
          </div>
          <div className="bg-[#F9F7F2] rounded-lg p-3 border border-white/5">
            <p className="text-[10px] text-[#b0a8b0] uppercase tracking-wider">ETA</p>
            <p className="text-white text-sm mt-0.5 font-semibold">{shipment.eta}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ══════════════════════════════════════
   WAREHOUSE CONNECTIONS
   ══════════════════════════════════════ */
function WarehousesPage({ supplyCat }: { supplyCat: SupplyCategory }) {
  const [sortByRating, setSortByRating] = useState(true);
  const [allWarehouses, setAllWarehouses] = useState<WarehouseContact[]>([]);
  const [wLoading, setWLoading] = useState(true);
  const [wError, setWError] = useState<string | null>(null);

  useEffect(() => {
    setWLoading(true);
    getWarehouses(supplyCat)
      .then((data) => setAllWarehouses(data as any))
      .catch(() => setWError("Failed to load warehouses"))
      .finally(() => setWLoading(false));
  }, [supplyCat]);

  if (wLoading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#8B004A]" /></div>;
  if (wError) return <div className="text-center py-20 text-red-400">{wError}</div>;

  const matched = allWarehouses.filter((w) => w.category.includes(supplyCat));
  const others = allWarehouses.filter((w) => !w.category.includes(supplyCat));
  const sortFn = (a: WarehouseContact, b: WarehouseContact) => sortByRating ? b.rating - a.rating : 0;
  const catLabel = categoryOptions.find((c) => c.id === supplyCat)?.label || supplyCat;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-[#1a1a1a]">Warehouse Connections</h2>
          <p className="text-[#9ca3af] text-sm">Matching: <span className="text-[#8B004A] font-medium">{catLabel}</span></p>
        </div>
        <Button onClick={() => setSortByRating((v) => !v)} variant="outline" className="bg-white border-[rgba(139,0,74,0.1)] text-white hover:bg-[#F2EFE7] hover:text-white text-xs">
          {sortByRating ? "⭐ Sorted by Rating" : "Default Order"}
        </Button>
      </div>

      <div>
        <p className="text-[10px] text-[#b0a8b0] uppercase tracking-wider mb-3">Best Matches</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...matched].sort(sortFn).map((w, i) => (
            <Card key={w.id} delay={i * 0.06}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#8B004A] to-[#C4006A] flex items-center justify-center shadow-md shadow-[#8B004A]/20"><Package className="w-5 h-5 text-[#1a1a1a]" /></div>
                  <div>
                    <h3 className="text-[#1a1a1a] font-semibold">{w.name}</h3>
                    <div className="flex items-center gap-1 text-[#9ca3af] text-xs mt-0.5"><MapPin className="w-3 h-3" />{w.location}</div>
                  </div>
                </div>
                {i === 0 && <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/25 rounded-full px-2 py-0.5 font-semibold">Top Rated</span>}
              </div>
              <StarRating rating={w.rating} />
              <div className="flex items-center gap-2 mt-3">
                <Button size="sm" className="flex-1 bg-gradient-to-r from-[#8B004A] to-[#C4006A] hover:from-[#6B0039] hover:to-[#8B004A]"><Phone className="w-3.5 h-3.5 mr-1.5" />Call</Button>
                <Button size="sm" variant="outline" className="flex-1 bg-white border-[rgba(139,0,74,0.1)] text-white hover:bg-[#F2EFE7] hover:text-white">Details <ChevronRight className="w-3.5 h-3.5 ml-1" /></Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {others.length > 0 && (
        <div>
          <p className="text-[10px] text-[#b0a8b0] uppercase tracking-wider mb-3">Other Warehouses</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...others].sort(sortFn).map((w, i) => (
              <Card key={w.id} delay={0.3 + i * 0.06} className="opacity-70">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center"><Package className="w-5 h-5 text-white/50" /></div>
                  <div>
                    <h3 className="text-white/80 font-semibold">{w.name}</h3>
                    <div className="flex items-center gap-1 text-[#b0a8b0] text-xs mt-0.5"><MapPin className="w-3 h-3" />{w.location}</div>
                  </div>
                </div>
                <StarRating rating={w.rating} />
                <Button size="sm" className="w-full mt-3 bg-white border border-[rgba(139,0,74,0.1)] text-white/60 hover:bg-[#F2EFE7] hover:text-white" variant="outline"><Phone className="w-3.5 h-3.5 mr-1.5" />Contact</Button>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════
   RECEIVER CONNECTIONS
   ══════════════════════════════════════ */
function ReceiversPage({ supplyCat }: { supplyCat: SupplyCategory }) {
  const [sortByRating, setSortByRating] = useState(true);
  const [allReceivers, setAllReceivers] = useState<ReceiverContact[]>([]);
  const [rLoading, setRLoading] = useState(true);
  const [rError, setRError] = useState<string | null>(null);

  useEffect(() => {
    setRLoading(true);
    getReceivers(supplyCat)
      .then((data) => setAllReceivers(data as any))
      .catch(() => setRError("Failed to load receivers"))
      .finally(() => setRLoading(false));
  }, [supplyCat]);

  if (rLoading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#8B004A]" /></div>;
  if (rError) return <div className="text-center py-20 text-red-400">{rError}</div>;

  const matched = allReceivers.filter((r) => r.category.includes(supplyCat));
  const others = allReceivers.filter((r) => !r.category.includes(supplyCat));
  const sortFn = (a: ReceiverContact, b: ReceiverContact) => sortByRating ? b.rating - a.rating : 0;
  const catLabel = categoryOptions.find((c) => c.id === supplyCat)?.label || supplyCat;

  const ReceiverCard = ({ r, idx, faded = false }: { r: ReceiverContact; idx: number; faded?: boolean }) => (
    <Card delay={idx * 0.06} className={faded ? "opacity-70" : ""}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-md ${faded ? "bg-[#EDE9E1]" : "bg-gradient-to-br from-[#8B004A] to-[#C4006A] shadow-[#8B004A]/20"}`}>
            <Users className={`w-5 h-5 ${faded ? "text-white/50" : "text-white"}`} />
          </div>
          <div>
            <h3 className={`font-semibold ${faded ? "text-[#1a1a1a]" : "text-white"}`}>{r.name}</h3>
            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
              {r.isBulkBuyer && <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/25 rounded-full px-2 py-0.5 font-semibold flex items-center gap-1"><Zap className="w-2.5 h-2.5" />Bulk Buyer</span>}
              {r.isFrequent && <span className="text-[10px] bg-blue-500/20 text-[#8B004A] border border-blue-500/25 rounded-full px-2 py-0.5 font-semibold flex items-center gap-1"><TrendingUp className="w-2.5 h-2.5" />Frequent</span>}
            </div>
          </div>
        </div>
      </div>
      <StarRating rating={r.rating} />
      <div className="flex items-center justify-between mt-2 text-xs text-[#9ca3af]">
        <span>{r.bulkOrders.toLocaleString()} orders</span>
        <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{r.contact}</span>
      </div>
      <div className="flex items-center gap-2 mt-3">
        <Button size="sm" className={`flex-1 ${faded ? "bg-white border border-[rgba(139,0,74,0.1)] text-white/60 hover:bg-[#F2EFE7] hover:text-white" : "bg-gradient-to-r from-[#8B004A] to-[#C4006A] hover:from-[#6B0039] hover:to-[#8B004A]"}`} variant={faded ? "outline" : "default"}><Phone className="w-3.5 h-3.5 mr-1.5" />Contact</Button>
        <Button size="sm" variant="outline" className="flex-1 bg-white border-[rgba(139,0,74,0.1)] text-white hover:bg-[#F2EFE7] hover:text-white">Details <ChevronRight className="w-3.5 h-3.5 ml-1" /></Button>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-[#1a1a1a]">Receiver Connections</h2>
          <p className="text-[#9ca3af] text-sm">For: <span className="text-violet-300 font-medium">{catLabel}</span></p>
        </div>
        <Button onClick={() => setSortByRating((v) => !v)} variant="outline" className="bg-white border-[rgba(139,0,74,0.1)] text-white hover:bg-[#F2EFE7] hover:text-white text-xs">
          {sortByRating ? "⭐ Sorted by Rating" : "Default Order"}
        </Button>
      </div>

      <div>
        <p className="text-[10px] text-[#b0a8b0] uppercase tracking-wider mb-3">Best Matches</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...matched].sort(sortFn).map((r, i) => <ReceiverCard key={r.id} r={r} idx={i} />)}
        </div>
      </div>

      {others.length > 0 && (
        <div>
          <p className="text-[10px] text-[#b0a8b0] uppercase tracking-wider mb-3">Other Receivers</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...others].sort(sortFn).map((r, i) => <ReceiverCard key={r.id} r={r} idx={i} faded />)}
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════
   SUPPLIER PROFILE
   ══════════════════════════════════════ */
function SupplierProfilePage({ setPage }: { setPage: (p: string) => void }) {
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    getUserProfile()
      .then((data) => setProfileData(data))
      .catch(() => {})
      .finally(() => setProfileLoading(false));
  }, []);

  if (profileLoading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#8B004A]" /></div>;

  const userName   = profileData?.fullName || sessionStorage.getItem("userName")  || "Supplier User";
  const userEmail  = profileData?.email || sessionStorage.getItem("userEmail") || "supplier@supplychain.com";
  const supplierData = profileData || JSON.parse(sessionStorage.getItem("supplierData") || "{}");
  const supplyCat  = profileData?.supplyCategory || sessionStorage.getItem("supplierCategory") || "electronics";

  const fields = [
    { label: "Full Name",        value: supplierData.name         || userName,                    icon: User      },
    { label: "Email Address",    value: supplierData.email        || userEmail,                   icon: Mail      },
    { label: "Role",             value: "Supplier",                                               icon: Package   },
    { label: "Phone Number",     value: supplierData.phone        || "+91 98765 43210",            icon: Phone     },
    { label: "Business Name",    value: supplierData.business     || "Supply Chain Corp.",        icon: Building2 },
    { label: "Supply Category",  value: supplierData.category     || supplyCat,                   icon: Tag       },
    { label: "Address",          value: supplierData.address      || "Mumbai, Maharashtra",       icon: MapPin    },
  ];

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#1a1a1a]">Supplier Profile</h2>
        <Button onClick={() => setPage("settings")} variant="outline"
          className="bg-white border-[rgba(139,0,74,0.1)] text-white hover:bg-[#F2EFE7] hover:text-white">
          <Edit3 className="w-4 h-4 mr-1.5" />Edit Profile
        </Button>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-[rgba(139,0,74,0.08)]">
        {/* Avatar row */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[rgba(139,0,74,0.1)]">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#8B004A] to-[#C4006A] flex items-center justify-center shadow-lg shadow-[#8B004A]/25">
            <User className="w-8 h-8 text-[#1a1a1a]" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#1a1a1a]">{fields[0].value}</h3>
            <p className="text-[#555555] text-sm">{fields[1].value}</p>
            <span className="inline-block mt-1 text-[10px] font-semibold bg-[#8B004A]/10 text-[#8B004A] border border-[#8B004A]/25 rounded-full px-2 py-0.5">Supplier</span>
          </div>
        </div>

        {/* Fields */}
        <div className="space-y-4">
          {fields.map((f) => {
            const I = f.icon;
            return (
              <div key={f.label} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shadow-sm">
                  <I className="w-4 h-4 text-[#888888]" />
                </div>
                <div>
                  <p className="text-[10px] text-[#555555] uppercase tracking-wider">{f.label}</p>
                  <p className="text-[#1a1a1a] text-sm capitalize">{f.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   SUPPLIER SETTINGS
   ══════════════════════════════════════ */
function SupplierSettingsPage() {
  const userName  = sessionStorage.getItem("userName")  || "Supplier User";
  const userEmail = sessionStorage.getItem("userEmail") || "supplier@supplychain.com";
  const supplierData = JSON.parse(sessionStorage.getItem("supplierData") || "{}");

  const [vals, setVals] = useState({
    name:     supplierData.name     || userName,
    email:    supplierData.email    || userEmail,
    phone:    supplierData.phone    || "+91 98765 43210",
    business: supplierData.business || "Supply Chain Corp.",
    category: supplierData.category || sessionStorage.getItem("supplierCategory") || "electronics",
    address:  supplierData.address  || "Mumbai, Maharashtra",
    password:        "",
    confirmPassword: "",
  });
  const [saved, setSaved] = useState(false);

  const set = (k: string, v: string) => setVals((p) => ({ ...p, [k]: v }));

  const handleSave = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, confirmPassword, ...rest } = vals;
    sessionStorage.setItem("supplierData", JSON.stringify(rest));
    sessionStorage.setItem("userName",  vals.name);
    sessionStorage.setItem("userEmail", vals.email);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const formFields = [
    { id: "name",     label: "Full Name",       type: "text"  },
    { id: "email",    label: "Email Address",   type: "email" },
    { id: "phone",    label: "Phone Number",    type: "tel"   },
    { id: "business", label: "Business Name",   type: "text"  },
    { id: "category", label: "Supply Category", type: "text"  },
    { id: "address",  label: "Address",         type: "text"  },
  ];

  const inputCls = "bg-white border-[rgba(139,0,74,0.1)] text-white placeholder:text-white/20 focus:border-blue-400/50 focus:ring-blue-400/20";

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-2xl font-bold text-[#1a1a1a]">Account Settings</h2>

      <div className="bg-white rounded-2xl p-6 border border-[rgba(139,0,74,0.08)] space-y-4">
        {/* Main fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {formFields.map((f) => (
            <div key={f.id} className="space-y-1.5">
              <Label className="text-white/60 text-xs">{f.label}</Label>
              <Input
                type={f.type}
                value={(vals as Record<string, string>)[f.id]}
                onChange={(e) => set(f.id, e.target.value)}
                className={inputCls}
              />
            </div>
          ))}
        </div>

        {/* Password */}
        <div className="pt-4 border-t border-[#E5E5E5]">
          <p className="text-[#555555] text-xs font-semibold uppercase tracking-wider mb-3">Change Password</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[#555555] text-xs">New Password</Label>
              <Input type="password" placeholder="••••••••" value={vals.password}
                onChange={(e) => set("password", e.target.value)} className={inputCls} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[#555555] text-xs">Confirm Password</Label>
              <Input type="password" placeholder="••••••••" value={vals.confirmPassword}
                onChange={(e) => set("confirmPassword", e.target.value)} className={inputCls} />
            </div>
          </div>
        </div>

        {/* Save */}
        <div className="flex items-center gap-3 pt-2">
          <Button onClick={handleSave}
            className="bg-gradient-to-r from-[#8B004A] to-[#C4006A] hover:from-[#6B0039] hover:to-[#8B004A] shadow-lg shadow-[#8B004A]/15">
            <Save className="w-4 h-4 mr-1.5" />Save Changes
          </Button>
          {saved && (
            <motion.span initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              className="text-emerald-400 text-sm flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Saved!
            </motion.span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   MASTER DASHBOARD
   ══════════════════════════════════════ */
export default function SupplierDashboard() {
  const [supplyCat, setSupplyCat] = useState<SupplyCategory | null>(() => {
    const s = sessionStorage.getItem("supplierCategory");
    return s ? (s as SupplyCategory) : null;
  });
  const [orderId, setOrderId] = useState<string | null>(() => sessionStorage.getItem("supplierOrderId"));
  const [activePage, setActivePage] = useState("dashboard");
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch shipment from API when orderId is available
  useEffect(() => {
    if (!orderId) return;
    setLoading(true);
    getShipmentByOrderId(orderId)
      .then((data) => { if (data) setShipment(data as any); })
      .catch(() => setError("Failed to load shipment"))
      .finally(() => setLoading(false));
  }, [orderId]);

  /* Flow: Step 1 = pick category, Step 2 = enter order ID, then dashboard */
  const needsCategory = !supplyCat;
  const needsOrderId = !needsCategory && (!orderId || !shipment);

  const handleCategorySelect = (cat: SupplyCategory) => {
    setSupplyCat(cat);
    sessionStorage.setItem("supplierCategory", cat);
  };

  const handleOrderSubmit = (id: string, fetchedShipment: Shipment) => {
    setOrderId(id);
    setShipment(fetchedShipment);
    sessionStorage.setItem("supplierOrderId", id);
  };

  const renderPage = () => {
    /* Profile & Settings are always available regardless of shipment state */
    if (activePage === "profile")   return <SupplierProfilePage  setPage={setActivePage} />;
    if (activePage === "settings")  return <SupplierSettingsPage />;
    if (!shipment || !supplyCat) return null;
    switch (activePage) {
      case "dashboard":
        return <TrackingPage shipment={shipment} orderId={orderId!} />;
      case "warehouses":
        return <WarehousesPage supplyCat={supplyCat} />;
      case "receivers":
        return <ReceiversPage supplyCat={supplyCat} />;
      default:
        return <TrackingPage shipment={shipment} orderId={orderId!} />;
    }
  };

  return (
    <>
      {/* Step 1: What do you supply? */}
      {needsCategory && <SupplyTypeStep onSelect={handleCategorySelect} />}

      {/* Step 2: Enter Order ID → goes directly to dashboard */}
      {needsOrderId && <OrderIdStep onSubmit={handleOrderSubmit} />}

      <DashboardLayout role="supplier" activeMenu={activePage} onMenuClick={setActivePage}>
        <AnimatePresence mode="wait">
          <motion.div key={activePage} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </DashboardLayout>
    </>
  );
}
