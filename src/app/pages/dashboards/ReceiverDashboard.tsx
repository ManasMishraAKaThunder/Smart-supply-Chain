import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import DashboardLayout from "../../components/DashboardLayout";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Truck, CheckCircle2, AlertCircle, MapPin, Phone,
  Star, Package, CloudRain, TrafficCone,
  ArrowRight, ChevronRight, TrendingUp, Zap, Users, ShoppingBag,
  User, Mail, Edit3, Save, Building2,
} from "lucide-react";

/* ══════════════════════════════════════
   DATA & TYPES
   ══════════════════════════════════════ */
type ReceiveCategory = "electronics" | "clothing" | "food" | "medical" | "others";
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
  category: ReceiveCategory[];
}

interface SupplierContact {
  id: number;
  name: string;
  contact: string;
  rating: number;
  totalOrders: number;
  isVerified: boolean;
  isPreferred: boolean;
  category: ReceiveCategory[];
}

const categoryOptions: { id: ReceiveCategory; label: string; icon: string }[] = [
  { id: "electronics", label: "Electronics", icon: "💻" },
  { id: "clothing", label: "Clothing", icon: "👕" },
  { id: "food", label: "Food Items", icon: "🍎" },
  { id: "medical", label: "Medical", icon: "💊" },
  { id: "others", label: "Others", icon: "📦" },
];

const orderDatabase: Record<string, Shipment> = {
  "ORD-2026-001": {
    id: "SHP-4201", status: "in-transit", from: "Mumbai Depot", to: "Receiver Hub, Delhi",
    eta: "2h 15m", progress: 65,
  },
  "ORD-2026-002": {
    id: "SHP-4202", status: "delayed", from: "Delhi Hub", to: "Receiver Hub, Jaipur",
    eta: "5h 40m (+2h delay)", progress: 30,
    delayReason: "Delayed due to heavy traffic on NH-44 highway", delayIcon: TrafficCone,
  },
  "ORD-2026-003": {
    id: "SHP-4203", status: "delivered", from: "Chennai Port", to: "Receiver Hub, Bangalore",
    eta: "Completed", progress: 100,
  },
  "ORD-2026-004": {
    id: "SHP-4204", status: "delayed", from: "Kolkata Hub", to: "Receiver Hub, Patna",
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

const supplierContacts: SupplierContact[] = [
  { id: 1, name: "TechVision Supplies", contact: "+91 99887 76655", rating: 4.9, totalOrders: 1400, isVerified: true, isPreferred: true, category: ["electronics"] },
  { id: 2, name: "MedCorp India", contact: "+91 88776 65544", rating: 4.6, totalOrders: 920, isVerified: true, isPreferred: true, category: ["medical"] },
  { id: 3, name: "FreshFarm Direct", contact: "+91 77665 54433", rating: 4.7, totalOrders: 1050, isVerified: true, isPreferred: false, category: ["food"] },
  { id: 4, name: "UrbanThreads Co.", contact: "+91 66554 43322", rating: 4.1, totalOrders: 780, isVerified: true, isPreferred: true, category: ["clothing"] },
  { id: 5, name: "AllGoods Distributors", contact: "+91 55443 32211", rating: 3.8, totalOrders: 320, isVerified: false, isPreferred: false, category: ["electronics", "others"] },
  { id: 6, name: "GreenLeaf Organics", contact: "+91 44332 21100", rating: 4.4, totalOrders: 560, isVerified: true, isPreferred: false, category: ["food", "medical"] },
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


/* ══════════════════════════════════════
   STEP 1 — SELECT RECEIVE TYPE
   ══════════════════════════════════════ */
function ReceiveTypeStep({ onSelect }: { onSelect: (cat: ReceiveCategory) => void }) {
  const [selected, setSelected] = useState<ReceiveCategory | null>(null);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-slate-900/95 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 p-3.5 mx-auto mb-5 shadow-lg shadow-teal-500/25">
            <ShoppingBag className="w-full h-full text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">What do you receive?</h2>
          <p className="text-teal-200/50 text-sm">Select your category to get started</p>
        </div>

        <div className="px-8 pb-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {categoryOptions.map((cat) => (
            <button key={cat.id} onClick={() => setSelected(cat.id)}
              className={`p-4 rounded-xl border transition-all duration-200 text-center ${selected === cat.id
                ? "bg-teal-500/20 border-teal-400/40 shadow-sm shadow-teal-500/10"
                : "bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.05]"
                }`}>
              <span className="text-2xl block mb-1.5">{cat.icon}</span>
              <span className={`text-sm font-medium ${selected === cat.id ? "text-white" : "text-white/70"}`}>{cat.label}</span>
            </button>
          ))}
        </div>

        <div className="p-6 pt-2">
          <Button disabled={!selected} onClick={() => selected && onSelect(selected)}
            className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 h-12 text-lg shadow-lg shadow-teal-500/15 disabled:opacity-40">
            Continue <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════
   STEP 2 — ENTER ORDER ID (INLINE PAGE)
   ══════════════════════════════════════ */
function OrderIdPage({ onSubmit }: { onSubmit: (id: string) => void }) {
  const [orderId, setOrderId] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    const trimmed = orderId.trim().toUpperCase();
    if (!trimmed) { setError("Please enter an Order ID"); return; }
    if (!orderDatabase[trimmed]) { setError(`Order "${trimmed}" not found`); return; }
    onSubmit(trimmed);
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 p-3 mx-auto mb-4 shadow-lg shadow-teal-500/20">
            <Truck className="w-full h-full text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Enter Order ID</h2>
          <p className="text-teal-200/40 text-sm mt-1">Enter your order ID to start tracking</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 space-y-4">
          <div>
            <label className="text-[11px] text-teal-200/40 uppercase tracking-wider font-medium mb-2 block">Order ID</label>
            <Input
              placeholder="e.g. ORD-2026-001"
              value={orderId}
              onChange={(e) => { setOrderId(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className={`bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-teal-400/50 focus:ring-teal-400/20 h-12 text-center text-lg font-mono tracking-wider ${error ? "border-red-500/50" : ""}`}
            />
            {error && (
              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-xs mt-2">{error}</motion.p>
            )}
          </div>

          <Button onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 h-11 text-base shadow-lg shadow-teal-500/15">
            Track Order <ArrowRight className="w-4.5 h-4.5 ml-2" />
          </Button>
        </div>
      </motion.div>
    </div>
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
          <p className="text-teal-200/40 text-sm">Order: <span className="text-teal-300 font-mono">{orderId}</span> · Shipment: <span className="font-mono">{shipment.id}</span></p>
        </div>
        <span className={`px-3 py-1.5 rounded-full text-sm font-semibold border ${st.bg} ${st.text}`}>{st.label}</span>
      </div>

      {/* Live Map */}
      <Card delay={0.1} className="!p-0 overflow-hidden">
        <div className="relative h-64 md:h-80 bg-gradient-to-br from-slate-900 via-teal-950/50 to-slate-900">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(20,184,166,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(20,184,166,0.05)_1px,transparent_1px)] bg-[size:3rem_3rem]" />

          {/* Route path */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 320" preserveAspectRatio="none">
            <path d="M 80 260 Q 200 180, 350 200 Q 500 220, 600 140 Q 680 90, 720 70" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" strokeLinecap="round" />
            <path d="M 80 260 Q 200 180, 350 200 Q 500 220, 600 140 Q 680 90, 720 70" fill="none" stroke="rgba(20,184,166,0.5)" strokeWidth="3" strokeDasharray="12 6">
              <animate attributeName="stroke-dashoffset" from="18" to="0" dur="1.5s" repeatCount="indefinite" />
            </path>
          </svg>

          {/* Origin pin */}
          <div className="absolute left-[8%] top-[75%] flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center shadow-lg shadow-teal-500/40">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <span className="text-[10px] text-teal-300 mt-1 font-medium bg-slate-900/80 px-1.5 py-0.5 rounded">{shipment.from}</span>
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
            <span className="text-[10px] text-teal-200/60 mt-1 font-medium bg-slate-900/80 px-1.5 py-0.5 rounded">{shipment.to}</span>
          </div>

          {/* Legend */}
          <div className="absolute bottom-3 right-3 flex gap-3 bg-slate-900/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10">
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-teal-500" /><span className="text-[10px] text-teal-200/60">In Transit</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" /><span className="text-[10px] text-teal-200/60">Delayed</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500" /><span className="text-[10px] text-teal-200/60">Delivered</span></div>
          </div>
        </div>
      </Card>

      {/* Order Info Card */}
      <Card delay={0.2}>
        {/* Progress bar */}
        <div className="mb-5">
          <div className="flex items-center justify-between text-xs text-teal-200/40 mb-1.5">
            <span>{shipment.from}</span>
            <span>{shipment.to}</span>
          </div>
          <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${shipment.progress}%` }} transition={{ duration: 1.2, ease: "easeOut" }}
              className={`h-full rounded-full ${shipment.status === "delayed" ? "bg-gradient-to-r from-red-500 to-red-400" : shipment.status === "delivered" ? "bg-gradient-to-r from-emerald-500 to-emerald-400" : "bg-gradient-to-r from-teal-500 to-cyan-400"}`} />
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
            <p className="text-[10px] text-teal-200/30 uppercase tracking-wider">Order ID</p>
            <p className="text-white font-mono text-sm mt-0.5">{orderId}</p>
          </div>
          <div className="bg-white/[0.04] rounded-lg p-3 border border-white/5">
            <p className="text-[10px] text-teal-200/30 uppercase tracking-wider">Shipment</p>
            <p className="text-white font-mono text-sm mt-0.5">{shipment.id}</p>
          </div>
          <div className="bg-white/[0.04] rounded-lg p-3 border border-white/5">
            <p className="text-[10px] text-teal-200/30 uppercase tracking-wider">Status</p>
            <p className={`text-sm mt-0.5 font-semibold ${st.text}`}>{st.label}</p>
          </div>
          <div className="bg-white/[0.04] rounded-lg p-3 border border-white/5">
            <p className="text-[10px] text-teal-200/30 uppercase tracking-wider">ETA</p>
            <p className="text-white text-sm mt-0.5 font-semibold">{shipment.eta}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ══════════════════════════════════════
   CONNECTED WAREHOUSES
   ══════════════════════════════════════ */
function WarehousesPage({ receiveCat }: { receiveCat: ReceiveCategory }) {
  const [sortByRating, setSortByRating] = useState(true);
  const matched = warehouseContacts.filter((w) => w.category.includes(receiveCat));
  const others = warehouseContacts.filter((w) => !w.category.includes(receiveCat));
  const sortFn = (a: WarehouseContact, b: WarehouseContact) => sortByRating ? b.rating - a.rating : 0;
  const catLabel = categoryOptions.find((c) => c.id === receiveCat)?.label || receiveCat;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white">Connected Warehouses</h2>
          <p className="text-teal-200/40 text-sm">Matching: <span className="text-teal-300 font-medium">{catLabel}</span></p>
        </div>
        <Button onClick={() => setSortByRating((v) => !v)} variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white text-xs">
          {sortByRating ? "⭐ Sorted by Rating" : "Default Order"}
        </Button>
      </div>

      <div>
        <p className="text-[10px] text-teal-200/30 uppercase tracking-wider mb-3">Best Matches</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...matched].sort(sortFn).map((w, i) => (
            <Card key={w.id} delay={i * 0.06}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center shadow-md shadow-teal-500/20"><Package className="w-5 h-5 text-white" /></div>
                  <div>
                    <h3 className="text-white font-semibold">{w.name}</h3>
                    <div className="flex items-center gap-1 text-teal-200/40 text-xs mt-0.5"><MapPin className="w-3 h-3" />{w.location}</div>
                  </div>
                </div>
                {i === 0 && <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/25 rounded-full px-2 py-0.5 font-semibold">Top Rated</span>}
              </div>
              <StarRating rating={w.rating} />
              <div className="flex items-center gap-2 mt-3">
                <Button size="sm" className="flex-1 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600"><Phone className="w-3.5 h-3.5 mr-1.5" />Call</Button>
                <Button size="sm" variant="outline" className="flex-1 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white">Details <ChevronRight className="w-3.5 h-3.5 ml-1" /></Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {others.length > 0 && (
        <div>
          <p className="text-[10px] text-teal-200/30 uppercase tracking-wider mb-3">Other Warehouses</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...others].sort(sortFn).map((w, i) => (
              <Card key={w.id} delay={0.3 + i * 0.06} className="opacity-70">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center"><Package className="w-5 h-5 text-white/50" /></div>
                  <div>
                    <h3 className="text-white/80 font-semibold">{w.name}</h3>
                    <div className="flex items-center gap-1 text-teal-200/30 text-xs mt-0.5"><MapPin className="w-3 h-3" />{w.location}</div>
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
   SUPPLIERS FOR YOUR ORDER
   ══════════════════════════════════════ */
function SuppliersPage({ receiveCat }: { receiveCat: ReceiveCategory }) {
  const [sortByRating, setSortByRating] = useState(true);
  const matched = supplierContacts.filter((s) => s.category.includes(receiveCat));
  const others = supplierContacts.filter((s) => !s.category.includes(receiveCat));
  const sortFn = (a: SupplierContact, b: SupplierContact) => sortByRating ? b.rating - a.rating : 0;
  const catLabel = categoryOptions.find((c) => c.id === receiveCat)?.label || receiveCat;

  const SupplierCard = ({ s, idx, faded = false }: { s: SupplierContact; idx: number; faded?: boolean }) => (
    <Card delay={idx * 0.06} className={faded ? "opacity-70" : ""}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-md ${faded ? "bg-white/10" : "bg-gradient-to-br from-violet-500 to-purple-500 shadow-violet-500/20"}`}>
            <Users className={`w-5 h-5 ${faded ? "text-white/50" : "text-white"}`} />
          </div>
          <div>
            <h3 className={`font-semibold ${faded ? "text-white/80" : "text-white"}`}>{s.name}</h3>
            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
              {s.isVerified && <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/25 rounded-full px-2 py-0.5 font-semibold flex items-center gap-1"><Zap className="w-2.5 h-2.5" />Verified</span>}
              {s.isPreferred && <span className="text-[10px] bg-teal-500/20 text-teal-400 border border-teal-500/25 rounded-full px-2 py-0.5 font-semibold flex items-center gap-1"><TrendingUp className="w-2.5 h-2.5" />Preferred</span>}
            </div>
          </div>
        </div>
      </div>
      <StarRating rating={s.rating} />
      <div className="flex items-center justify-between mt-2 text-xs text-teal-200/40">
        <span>{s.totalOrders.toLocaleString()} orders · {catLabel}</span>
        <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{s.contact}</span>
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
          <h2 className="text-2xl font-bold text-white">Suppliers for Your Order</h2>
          <p className="text-teal-200/40 text-sm">For: <span className="text-violet-300 font-medium">{catLabel}</span></p>
        </div>
        <Button onClick={() => setSortByRating((v) => !v)} variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white text-xs">
          {sortByRating ? "⭐ Sorted by Rating" : "Default Order"}
        </Button>
      </div>

      <div>
        <p className="text-[10px] text-teal-200/30 uppercase tracking-wider mb-3">Best Matches</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...matched].sort(sortFn).map((s, i) => <SupplierCard key={s.id} s={s} idx={i} />)}
        </div>
      </div>

      {others.length > 0 && (
        <div>
          <p className="text-[10px] text-teal-200/30 uppercase tracking-wider mb-3">Other Suppliers</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...others].sort(sortFn).map((s, i) => <SupplierCard key={s.id} s={s} idx={i} faded />)}
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════
   RECEIVER PROFILE
   ══════════════════════════════════════ */
function ReceiverProfilePage({ setPage }: { setPage: (p: string) => void }) {
  const userName = sessionStorage.getItem("userName") || "Receiver User";
  const userEmail = sessionStorage.getItem("userEmail") || "receiver@supplychain.com";
  const receiverData = JSON.parse(sessionStorage.getItem("receiverData") || "{}");

  const fields = [
    { label: "Full Name", value: receiverData.name || userName, icon: User },
    { label: "Email Address", value: receiverData.email || userEmail, icon: Mail },
    { label: "Role", value: "Receiver", icon: Package },
    { label: "Phone Number", value: receiverData.phone || "+91 98765 43210", icon: Phone },
    { label: "Organization", value: receiverData.organization || "Supply Chain Corp.", icon: Building2 },
    { label: "Location", value: receiverData.location || "Delhi, India", icon: MapPin },
  ];

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Receiver Profile</h2>
        <Button onClick={() => setPage("settings")} variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white">
          <Edit3 className="w-4 h-4 mr-1.5" />Edit Profile
        </Button>
      </div>
      <Card>
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-500/25">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{fields[0].value}</h3>
            <p className="text-teal-200/50 text-sm">{fields[1].value}</p>
            <span className="inline-block mt-1 text-[10px] font-semibold bg-teal-500/15 text-teal-300 border border-teal-500/20 rounded-full px-2 py-0.5">Receiver</span>
          </div>
        </div>
        <div className="space-y-4">
          {fields.map((f) => {
            const I = f.icon;
            return (
              <div key={f.label} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center">
                  <I className="w-4 h-4 text-teal-200/40" />
                </div>
                <div>
                  <p className="text-[10px] text-teal-200/30 uppercase tracking-wider">{f.label}</p>
                  <p className="text-white text-sm">{f.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

/* ══════════════════════════════════════
   RECEIVER SETTINGS
   ══════════════════════════════════════ */
function ReceiverSettingsPage() {
  const userName = sessionStorage.getItem("userName") || "Receiver User";
  const userEmail = sessionStorage.getItem("userEmail") || "receiver@supplychain.com";
  const receiverData = JSON.parse(sessionStorage.getItem("receiverData") || "{}");

  const [vals, setVals] = useState({
    name: receiverData.name || userName,
    email: receiverData.email || userEmail,
    phone: receiverData.phone || "+91 98765 43210",
    organization: receiverData.organization || "Supply Chain Corp.",
    location: receiverData.location || "Delhi, India",
    password: "",
    confirmPassword: "",
  });
  const [saved, setSaved] = useState(false);

  const set = (k: string, v: string) => setVals((p) => ({ ...p, [k]: v }));

  const handleSave = () => {
    const { password, confirmPassword, ...rest } = vals;
    sessionStorage.setItem("receiverData", JSON.stringify(rest));
    sessionStorage.setItem("userName", vals.name);
    sessionStorage.setItem("userEmail", vals.email);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const formFields = [
    { id: "name", label: "Full Name", type: "text" },
    { id: "email", label: "Email Address", type: "email" },
    { id: "phone", label: "Phone Number", type: "tel" },
    { id: "organization", label: "Organization", type: "text" },
    { id: "location", label: "Location", type: "text" },
  ];

  const inputStyles = "bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-teal-400/50 focus:ring-teal-400/20";

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-2xl font-bold text-white">Account Settings</h2>
      <Card>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {formFields.map((f) => (
              <div key={f.id} className="space-y-1.5">
                <Label className="text-white/60 text-xs">{f.label}</Label>
                <Input
                  type={f.type}
                  value={(vals as Record<string, string>)[f.id]}
                  onChange={(e) => set(f.id, e.target.value)}
                  className={inputStyles}
                />
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-white/10">
            <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-3">Change Password</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-white/60 text-xs">New Password</Label>
                <Input type="password" placeholder="••••••••" value={vals.password} onChange={(e) => set("password", e.target.value)} className={inputStyles} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-white/60 text-xs">Confirm Password</Label>
                <Input type="password" placeholder="••••••••" value={vals.confirmPassword} onChange={(e) => set("confirmPassword", e.target.value)} className={inputStyles} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button onClick={handleSave} className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 shadow-lg shadow-teal-500/15">
              <Save className="w-4 h-4 mr-1.5" />Save Changes
            </Button>
            {saved && (
              <motion.span initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="text-emerald-400 text-sm flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Saved!
              </motion.span>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ══════════════════════════════════════
   MASTER DASHBOARD
   ══════════════════════════════════════ */
export default function ReceiverDashboard() {
  const [receiveCat, setReceiveCat] = useState<ReceiveCategory | null>(() => {
    const s = sessionStorage.getItem("receiverCategory");
    return s ? (s as ReceiveCategory) : null;
  });
  const [orderId, setOrderId] = useState<string | null>(() => sessionStorage.getItem("receiverOrderId"));
  const [activePage, setActivePage] = useState("dashboard");

  const shipment = orderId ? orderDatabase[orderId] || null : null;

  /* Flow: Step 1 = pick category, Step 2 = enter order ID (inline page), then dashboard */
  const needsCategory = !receiveCat;
  const needsOrderId = !needsCategory && (!orderId || !shipment);

  const handleCategorySelect = (cat: ReceiveCategory) => {
    setReceiveCat(cat);
    sessionStorage.setItem("receiverCategory", cat);
  };

  const handleOrderSubmit = (id: string) => {
    setOrderId(id);
    sessionStorage.setItem("receiverOrderId", id);
  };

  const renderPage = () => {
    if (!receiveCat) return null;
    /* Show inline Order ID page if no valid order yet */
    if (needsOrderId) return <OrderIdPage onSubmit={handleOrderSubmit} />;
    switch (activePage) {
      case "dashboard":
        return shipment ? <TrackingPage shipment={shipment} orderId={orderId!} /> : null;
      case "warehouses":
        return <WarehousesPage receiveCat={receiveCat} />;
      case "suppliers":
        return <SuppliersPage receiveCat={receiveCat} />;
      case "profile":
        return <ReceiverProfilePage setPage={setActivePage} />;
      case "settings":
        return <ReceiverSettingsPage />;
      default:
        return shipment ? <TrackingPage shipment={shipment} orderId={orderId!} /> : null;
    }
  };

  return (
    <>
      {/* Step 1: What do you receive? (modal) */}
      {needsCategory && <ReceiveTypeStep onSelect={handleCategorySelect} />}

      {/* Step 2 + Dashboard: rendered inside layout */}
      <DashboardLayout role="receiver" activeMenu={activePage} onMenuClick={setActivePage}>
        <AnimatePresence mode="wait">
          <motion.div key={needsOrderId ? "order-id" : activePage} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </DashboardLayout>
    </>
  );
}
