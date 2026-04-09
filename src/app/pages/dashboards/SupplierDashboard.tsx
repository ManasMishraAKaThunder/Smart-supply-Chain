import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import DashboardLayout from "../../components/DashboardLayout";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Truck, Clock, CheckCircle2, AlertCircle, MapPin, Phone,
  Star, Package, CloudRain, TrafficCone,
  ArrowRight, ChevronRight, TrendingUp, Zap, Users,
  User, Mail, Edit3, Save, Building2, Tag,
} from "lucide-react";

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

const orderDatabase: Record<string, Shipment> = {
  "ORD-2026-001": {
    id: "SHP-4201", status: "in-transit", from: "Mumbai Depot", to: "Warehouse Alpha, Delhi",
    eta: "2h 15m", progress: 65,
  },
  "ORD-2026-002": {
    id: "SHP-4202", status: "delayed", from: "Delhi Hub", to: "Warehouse Beta, Jaipur",
    eta: "5h 40m (+2h delay)", progress: 30,
    delayReason: "Delayed due to heavy traffic on NH-44 highway", delayIcon: TrafficCone,
  },
  "ORD-2026-003": {
    id: "SHP-4203", status: "delivered", from: "Chennai Port", to: "Warehouse Gamma, Bangalore",
    eta: "Completed", progress: 100,
  },
  "ORD-2026-004": {
    id: "SHP-4204", status: "delayed", from: "Kolkata Hub", to: "Warehouse Epsilon, Patna",
    eta: "7h (+3h delay)", progress: 15,
    delayReason: "Delayed due to bad weather — heavy rainfall warning", delayIcon: CloudRain,
  },
};

const warehouseContacts: WarehouseContact[] = [
  { id: 1, name: "Warehouse Alpha", contact: "+91 98765 43210", location: "Mumbai, MH", rating: 4.8, category: ["electronics", "others"] },
  { id: 2, name: "Warehouse Beta", contact: "+91 87654 32109", location: "Delhi, DL", rating: 4.5, category: ["clothing", "others"] },
  { id: 3, name: "Warehouse Gamma", contact: "+91 76543 21098", location: "Chennai, TN", rating: 4.2, category: ["food", "medical"] },
  { id: 4, name: "Warehouse Delta", contact: "+91 65432 10987", location: "Pune, MH", rating: 3.9, category: ["electronics", "medical"] },
  { id: 5, name: "Warehouse Epsilon", contact: "+91 54321 09876", location: "Kolkata, WB", rating: 4.6, category: ["food", "clothing"] },
  { id: 6, name: "Warehouse Zeta", contact: "+91 43210 98765", location: "Hyderabad, TS", rating: 3.5, category: ["others", "electronics"] },
];

const receiverContacts: ReceiverContact[] = [
  { id: 1, name: "RetailMart India", contact: "+91 99887 76655", rating: 4.9, bulkOrders: 1200, isBulkBuyer: true, isFrequent: true, category: ["electronics", "clothing"] },
  { id: 2, name: "MedLife Stores", contact: "+91 88776 65544", rating: 4.3, bulkOrders: 800, isBulkBuyer: true, isFrequent: true, category: ["medical"] },
  { id: 3, name: "QuickBite Chain", contact: "+91 77665 54433", rating: 4.7, bulkOrders: 950, isBulkBuyer: true, isFrequent: false, category: ["food"] },
  { id: 4, name: "SmallShop Plus", contact: "+91 66554 43322", rating: 3.8, bulkOrders: 120, isBulkBuyer: false, isFrequent: false, category: ["electronics", "others"] },
  { id: 5, name: "FashionPoint", contact: "+91 55443 32211", rating: 4.1, bulkOrders: 650, isBulkBuyer: true, isFrequent: true, category: ["clothing"] },
  { id: 6, name: "GreenGrocer Hub", contact: "+91 44332 21100", rating: 4.4, bulkOrders: 400, isBulkBuyer: false, isFrequent: true, category: ["food"] },
];

/* ══════════════════════════════════════
   HELPERS
   ══════════════════════════════════════ */
function Card({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay }}
      className={`bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 ${className}`}>
      {children}
    </motion.div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`w-3.5 h-3.5 ${i <= Math.floor(rating) ? "text-amber-400 fill-amber-400" : i - 0.5 <= rating ? "text-amber-400 fill-amber-400/40" : "text-white/15"}`} />
      ))}
      <span className="text-white/60 text-xs ml-1.5 tabular-nums">{rating.toFixed(1)}</span>
    </div>
  );
}

const statusCls: Record<ShipmentStatus, { bg: string; text: string; label: string }> = {
  "in-transit": { bg: "bg-blue-500/20 border-blue-500/30", text: "text-blue-400", label: "In Transit" },
  delivered: { bg: "bg-emerald-500/20 border-emerald-500/30", text: "text-emerald-400", label: "Delivered" },
  delayed: { bg: "bg-red-500/20 border-red-500/30", text: "text-red-400", label: "Delayed" },
};

const inputCls = "bg-white/5 border-white/10 text-white placeholder:text-blue-200/30 focus:border-blue-400/50 focus:ring-blue-400/20";

/* ══════════════════════════════════════
   STEP 1 — SELECT SUPPLY TYPE
   ══════════════════════════════════════ */
function SupplyTypeStep({ onSelect }: { onSelect: (cat: SupplyCategory) => void }) {
  const [selected, setSelected] = useState<SupplyCategory | null>(null);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-slate-900/95 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 p-3.5 mx-auto mb-5 shadow-lg shadow-blue-500/25">
            <Package className="w-full h-full text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">What do you supply?</h2>
          <p className="text-blue-200/50 text-sm">Select your category to get started</p>
        </div>

        <div className="px-8 pb-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {categoryOptions.map((cat) => (
            <button key={cat.id} onClick={() => setSelected(cat.id)}
              className={`p-4 rounded-xl border transition-all duration-200 text-center ${selected === cat.id
                  ? "bg-blue-500/20 border-blue-400/40 shadow-sm shadow-blue-500/10"
                  : "bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.05]"
                }`}>
              <span className="text-2xl block mb-1.5">{cat.icon}</span>
              <span className={`text-sm font-medium ${selected === cat.id ? "text-white" : "text-white/70"}`}>{cat.label}</span>
            </button>
          ))}
        </div>

        <div className="p-6 pt-2">
          <Button disabled={!selected} onClick={() => selected && onSelect(selected)}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 h-12 text-lg shadow-lg shadow-blue-500/15 disabled:opacity-40">
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
function OrderIdStep({ onSubmit }: { onSubmit: (id: string) => void }) {
  const [orderId, setOrderId] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    const trimmed = orderId.trim().toUpperCase();
    if (!trimmed) { setError("Please enter an Order ID"); return; }
    if (!orderDatabase[trimmed]) { setError(`Order "${trimmed}" not found. Try: ORD-2026-001`); return; }
    onSubmit(trimmed);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-slate-900/95 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 p-3.5 mx-auto mb-5 shadow-lg shadow-violet-500/25">
            <Truck className="w-full h-full text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Enter Order ID</h2>
          <p className="text-blue-200/50 text-sm">Track your shipment</p>
        </div>

        <div className="px-8 pb-6 space-y-4">
          <div>
            <Input
              placeholder="e.g. ORD-2026-001"
              value={orderId}
              onChange={(e) => { setOrderId(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className={`${inputCls} h-12 text-center text-lg font-mono tracking-wider ${error ? "border-red-500/50" : ""}`}
            />
            {error && (
              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-xs mt-2 text-center">{error}</motion.p>
            )}
          </div>

          <Button onClick={handleSubmit} className="w-full bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 h-12 text-lg shadow-lg shadow-violet-500/15">
            Track Shipment <ArrowRight className="w-5 h-5 ml-2" />
          </Button>

          <div className="text-center">
            <p className="text-blue-200/30 text-[10px] uppercase tracking-wider">Demo orders</p>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {Object.keys(orderDatabase).map((id) => (
                <button key={id} onClick={() => { setOrderId(id); setError(""); }}
                  className="text-[11px] font-mono text-blue-300/60 hover:text-blue-300 bg-white/5 hover:bg-white/10 rounded-lg px-2.5 py-1 border border-white/10 transition-all">
                  {id}
                </button>
              ))}
            </div>
          </div>
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
          <h2 className="text-2xl font-bold text-white">Shipment Status</h2>
          <p className="text-blue-200/40 text-sm">Order: <span className="text-blue-300 font-mono">{orderId}</span> · Shipment: <span className="font-mono">{shipment.id}</span></p>
        </div>
        <span className={`px-3 py-1.5 rounded-full text-sm font-semibold border ${st.bg} ${st.text}`}>{st.label}</span>
      </div>

      {/* Live Map */}
      <Card delay={0.1} className="!p-0 overflow-hidden">
        <div className="relative h-64 md:h-80 bg-gradient-to-br from-slate-900 via-blue-950/50 to-slate-900">
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
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <span className="text-[10px] text-blue-300 mt-1 font-medium bg-slate-900/80 px-1.5 py-0.5 rounded">{shipment.from}</span>
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
                {shipment.status === "delayed" ? <AlertCircle className="w-5 h-5 text-white" /> : <Truck className="w-5 h-5 text-white" />}
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
              {shipment.status === "delivered" ? <CheckCircle2 className="w-4 h-4 text-white" /> : <MapPin className="w-4 h-4 text-white/60" />}
            </div>
            <span className="text-[10px] text-blue-200/60 mt-1 font-medium bg-slate-900/80 px-1.5 py-0.5 rounded">{shipment.to}</span>
          </div>

          {/* Legend */}
          <div className="absolute bottom-3 right-3 flex gap-3 bg-slate-900/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10">
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-blue-500" /><span className="text-[10px] text-blue-200/60">In Transit</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" /><span className="text-[10px] text-blue-200/60">Delayed</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500" /><span className="text-[10px] text-blue-200/60">Delivered</span></div>
          </div>
        </div>
      </Card>

      {/* Order Info Card */}
      <Card delay={0.2}>
        {/* Progress bar */}
        <div className="mb-5">
          <div className="flex items-center justify-between text-xs text-blue-200/40 mb-1.5">
            <span>{shipment.from}</span>
            <span>{shipment.to}</span>
          </div>
          <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
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
          <div className="bg-white/[0.04] rounded-lg p-3 border border-white/5">
            <p className="text-[10px] text-blue-200/30 uppercase tracking-wider">Order ID</p>
            <p className="text-white font-mono text-sm mt-0.5">{orderId}</p>
          </div>
          <div className="bg-white/[0.04] rounded-lg p-3 border border-white/5">
            <p className="text-[10px] text-blue-200/30 uppercase tracking-wider">Shipment</p>
            <p className="text-white font-mono text-sm mt-0.5">{shipment.id}</p>
          </div>
          <div className="bg-white/[0.04] rounded-lg p-3 border border-white/5">
            <p className="text-[10px] text-blue-200/30 uppercase tracking-wider">Status</p>
            <p className={`text-sm mt-0.5 font-semibold ${st.text}`}>{st.label}</p>
          </div>
          <div className="bg-white/[0.04] rounded-lg p-3 border border-white/5">
            <p className="text-[10px] text-blue-200/30 uppercase tracking-wider">ETA</p>
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
  const matched = warehouseContacts.filter((w) => w.category.includes(supplyCat));
  const others = warehouseContacts.filter((w) => !w.category.includes(supplyCat));
  const sortFn = (a: WarehouseContact, b: WarehouseContact) => sortByRating ? b.rating - a.rating : 0;
  const catLabel = categoryOptions.find((c) => c.id === supplyCat)?.label || supplyCat;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white">Warehouse Connections</h2>
          <p className="text-blue-200/40 text-sm">Matching: <span className="text-blue-300 font-medium">{catLabel}</span></p>
        </div>
        <Button onClick={() => setSortByRating((v) => !v)} variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white text-xs">
          {sortByRating ? "⭐ Sorted by Rating" : "Default Order"}
        </Button>
      </div>

      <div>
        <p className="text-[10px] text-blue-200/30 uppercase tracking-wider mb-3">Best Matches</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...matched].sort(sortFn).map((w, i) => (
            <Card key={w.id} delay={i * 0.06}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-md shadow-blue-500/20"><Package className="w-5 h-5 text-white" /></div>
                  <div>
                    <h3 className="text-white font-semibold">{w.name}</h3>
                    <div className="flex items-center gap-1 text-blue-200/40 text-xs mt-0.5"><MapPin className="w-3 h-3" />{w.location}</div>
                  </div>
                </div>
                {i === 0 && <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/25 rounded-full px-2 py-0.5 font-semibold">Top Rated</span>}
              </div>
              <StarRating rating={w.rating} />
              <div className="flex items-center gap-2 mt-3">
                <Button size="sm" className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"><Phone className="w-3.5 h-3.5 mr-1.5" />Call</Button>
                <Button size="sm" variant="outline" className="flex-1 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white">Details <ChevronRight className="w-3.5 h-3.5 ml-1" /></Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {others.length > 0 && (
        <div>
          <p className="text-[10px] text-blue-200/30 uppercase tracking-wider mb-3">Other Warehouses</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...others].sort(sortFn).map((w, i) => (
              <Card key={w.id} delay={0.3 + i * 0.06} className="opacity-70">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center"><Package className="w-5 h-5 text-white/50" /></div>
                  <div>
                    <h3 className="text-white/80 font-semibold">{w.name}</h3>
                    <div className="flex items-center gap-1 text-blue-200/30 text-xs mt-0.5"><MapPin className="w-3 h-3" />{w.location}</div>
                  </div>
                </div>
                <StarRating rating={w.rating} />
                <Button size="sm" className="w-full mt-3 bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white" variant="outline"><Phone className="w-3.5 h-3.5 mr-1.5" />Contact</Button>
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
  const matched = receiverContacts.filter((r) => r.category.includes(supplyCat));
  const others = receiverContacts.filter((r) => !r.category.includes(supplyCat));
  const sortFn = (a: ReceiverContact, b: ReceiverContact) => sortByRating ? b.rating - a.rating : 0;
  const catLabel = categoryOptions.find((c) => c.id === supplyCat)?.label || supplyCat;

  const ReceiverCard = ({ r, idx, faded = false }: { r: ReceiverContact; idx: number; faded?: boolean }) => (
    <Card delay={idx * 0.06} className={faded ? "opacity-70" : ""}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-md ${faded ? "bg-white/10" : "bg-gradient-to-br from-violet-500 to-purple-500 shadow-violet-500/20"}`}>
            <Users className={`w-5 h-5 ${faded ? "text-white/50" : "text-white"}`} />
          </div>
          <div>
            <h3 className={`font-semibold ${faded ? "text-white/80" : "text-white"}`}>{r.name}</h3>
            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
              {r.isBulkBuyer && <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/25 rounded-full px-2 py-0.5 font-semibold flex items-center gap-1"><Zap className="w-2.5 h-2.5" />Bulk Buyer</span>}
              {r.isFrequent && <span className="text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/25 rounded-full px-2 py-0.5 font-semibold flex items-center gap-1"><TrendingUp className="w-2.5 h-2.5" />Frequent</span>}
            </div>
          </div>
        </div>
      </div>
      <StarRating rating={r.rating} />
      <div className="flex items-center justify-between mt-2 text-xs text-blue-200/40">
        <span>{r.bulkOrders.toLocaleString()} orders</span>
        <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{r.contact}</span>
      </div>
      <div className="flex items-center gap-2 mt-3">
        <Button size="sm" className={`flex-1 ${faded ? "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white" : "bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600"}`} variant={faded ? "outline" : "default"}><Phone className="w-3.5 h-3.5 mr-1.5" />Contact</Button>
        <Button size="sm" variant="outline" className="flex-1 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white">Details <ChevronRight className="w-3.5 h-3.5 ml-1" /></Button>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white">Receiver Connections</h2>
          <p className="text-blue-200/40 text-sm">For: <span className="text-violet-300 font-medium">{catLabel}</span></p>
        </div>
        <Button onClick={() => setSortByRating((v) => !v)} variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white text-xs">
          {sortByRating ? "⭐ Sorted by Rating" : "Default Order"}
        </Button>
      </div>

      <div>
        <p className="text-[10px] text-blue-200/30 uppercase tracking-wider mb-3">Best Matches</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...matched].sort(sortFn).map((r, i) => <ReceiverCard key={r.id} r={r} idx={i} />)}
        </div>
      </div>

      {others.length > 0 && (
        <div>
          <p className="text-[10px] text-blue-200/30 uppercase tracking-wider mb-3">Other Receivers</p>
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
  const userName   = sessionStorage.getItem("userName")  || "Supplier User";
  const userEmail  = sessionStorage.getItem("userEmail") || "supplier@supplychain.com";
  const supplierData = JSON.parse(sessionStorage.getItem("supplierData") || "{}");
  const supplyCat  = sessionStorage.getItem("supplierCategory") || "electronics";

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
        <h2 className="text-2xl font-bold text-white">Supplier Profile</h2>
        <Button onClick={() => setPage("settings")} variant="outline"
          className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white">
          <Edit3 className="w-4 h-4 mr-1.5" />Edit Profile
        </Button>
      </div>

      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
        {/* Avatar row */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{fields[0].value}</h3>
            <p className="text-blue-200/50 text-sm">{fields[1].value}</p>
            <span className="inline-block mt-1 text-[10px] font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/20 rounded-full px-2 py-0.5">Supplier</span>
          </div>
        </div>

        {/* Fields */}
        <div className="space-y-4">
          {fields.map((f) => {
            const I = f.icon;
            return (
              <div key={f.label} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center">
                  <I className="w-4 h-4 text-blue-200/40" />
                </div>
                <div>
                  <p className="text-[10px] text-blue-200/30 uppercase tracking-wider">{f.label}</p>
                  <p className="text-white text-sm capitalize">{f.value}</p>
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

  const inputCls = "bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-blue-400/50 focus:ring-blue-400/20";

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-2xl font-bold text-white">Account Settings</h2>

      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 space-y-4">
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
        <div className="pt-4 border-t border-white/10">
          <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-3">Change Password</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-white/60 text-xs">New Password</Label>
              <Input type="password" placeholder="••••••••" value={vals.password}
                onChange={(e) => set("password", e.target.value)} className={inputCls} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-white/60 text-xs">Confirm Password</Label>
              <Input type="password" placeholder="••••••••" value={vals.confirmPassword}
                onChange={(e) => set("confirmPassword", e.target.value)} className={inputCls} />
            </div>
          </div>
        </div>

        {/* Save */}
        <div className="flex items-center gap-3 pt-2">
          <Button onClick={handleSave}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg shadow-blue-500/15">
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

  const shipment = orderId ? orderDatabase[orderId] || null : null;

  /* Flow: Step 1 = pick category, Step 2 = enter order ID, then dashboard */
  const needsCategory = !supplyCat;
  const needsOrderId = !needsCategory && (!orderId || !shipment);

  const handleCategorySelect = (cat: SupplyCategory) => {
    setSupplyCat(cat);
    sessionStorage.setItem("supplierCategory", cat);
  };

  const handleOrderSubmit = (id: string) => {
    setOrderId(id);
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
