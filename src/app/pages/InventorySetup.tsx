import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  ArrowLeft,
  Plus,
  Minus,
  Package,
  AlertTriangle,
  XCircle,
  Sparkles,
  Save,
  Trash2,
  Search,
  Boxes,
  TrendingDown,
  CheckCircle2,
  Warehouse,
} from "lucide-react";

/* ──────── types ──────── */
interface Product {
  id: string;
  name: string;
  quantity: number;
}

/* ──────── starter products ──────── */
const starterProducts: Product[] = [
  { id: "1", name: "Electronics", quantity: 120 },
  { id: "2", name: "Clothing", quantity: 18 },
  { id: "3", name: "Food Items", quantity: 340 },
  { id: "4", name: "Medical Supplies", quantity: 0 },
  { id: "5", name: "Books & Stationery", quantity: 85 },
];

const LOW_STOCK_THRESHOLD = 30;

/* ──────── stock status ──────── */
function stockStatus(qty: number) {
  if (qty === 0) return { label: "Out of Stock", color: "text-red-400", bg: "bg-red-500/15 border-red-500/30", icon: XCircle };
  if (qty <= LOW_STOCK_THRESHOLD) return { label: "Low Stock", color: "text-amber-400", bg: "bg-amber-500/15 border-amber-500/30", icon: AlertTriangle };
  return { label: "In Stock", color: "text-emerald-400", bg: "bg-emerald-500/15 border-emerald-500/30", icon: CheckCircle2 };
}

/* ──────── unique id ──────── */
let _id = 100;
function uid() {
  return String(++_id);
}

/* ══════════════════════════════════════════
   COMPONENT
   ══════════════════════════════════════════ */
export default function InventorySetup() {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>(starterProducts);
  const [newName, setNewName] = useState("");
  const [newQty, setNewQty] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [saved, setSaved] = useState(false);

  /* ── derived stats ── */
  const totalProducts = products.length;
  const lowStockCount = products.filter((p) => p.quantity > 0 && p.quantity <= LOW_STOCK_THRESHOLD).length;
  const outOfStockCount = products.filter((p) => p.quantity === 0).length;
  const totalUnits = products.reduce((s, p) => s + p.quantity, 0);

  /* ── filtered list ── */
  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const q = searchQuery.toLowerCase();
    return products.filter((p) => p.name.toLowerCase().includes(q));
  }, [products, searchQuery]);

  /* ── actions ── */
  const increment = (id: string) =>
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, quantity: p.quantity + 1 } : p)));

  const decrement = (id: string) =>
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, quantity: Math.max(0, p.quantity - 1) } : p)));

  const remove = (id: string) =>
    setProducts((prev) => prev.filter((p) => p.id !== id));

  const addProduct = () => {
    const name = newName.trim();
    if (!name) return;
    const qty = Math.max(0, parseInt(newQty) || 0);
    setProducts((prev) => [...prev, { id: uid(), name, quantity: qty }]);
    setNewName("");
    setNewQty("");
  };

  const handleSave = () => {
    const data = products.map(({ name, quantity }) => ({ name, quantity }));
    sessionStorage.setItem("inventoryData", JSON.stringify(data));
    setSaved(true);
    setTimeout(() => navigate("/dashboard/warehouse-holder"), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 pb-16">
      {/* grid bg */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      {/* ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[32rem] h-[32rem] bg-gradient-to-br from-blue-500 to-cyan-500 opacity-[0.06] blur-3xl rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 pt-8">
        {/* back */}
        <button
          onClick={() => navigate("/warehouse/signup")}
          className="flex items-center gap-1.5 text-blue-200/70 hover:text-blue-200 transition-colors text-sm mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to registration
        </button>

        {/* step chips */}
        <div className="flex items-center gap-3 mb-8">
          <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Warehouse Details
          </span>
          <span className="h-px flex-1 bg-white/10" />
          <span className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1">
            <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold">
              2
            </span>
            Inventory Setup
          </span>
        </div>

        {/* header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Boxes className="w-8 h-8 text-cyan-400" />
            Add Your Inventory
          </h1>
          <p className="text-blue-200/50 text-sm md:text-base">
            Tell us what products you currently have in your warehouse. This data will power{" "}
            <span className="text-cyan-400/80 font-medium">AI demand predictions</span> and{" "}
            <span className="text-cyan-400/80 font-medium">auto-restock suggestions</span>.
          </p>
        </motion.div>

        {/* ─── STATS BAR ─── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
        >
          <StatBox icon={Package} label="Total Products" value={totalProducts} gradient="from-blue-500 to-cyan-500" />
          <StatBox icon={Boxes} label="Total Units" value={totalUnits.toLocaleString()} gradient="from-violet-500 to-purple-500" />
          <StatBox icon={TrendingDown} label="Low Stock" value={lowStockCount} gradient="from-amber-500 to-orange-500" alert={lowStockCount > 0} />
          <StatBox icon={XCircle} label="Out of Stock" value={outOfStockCount} gradient="from-red-500 to-rose-500" alert={outOfStockCount > 0} />
        </motion.div>

        {/* ─── AI INSIGHT BANNER ─── */}
        {lowStockCount > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3"
          >
            <Sparkles className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-amber-300 font-medium text-sm">
                AI Insight: {lowStockCount} item{lowStockCount > 1 ? "s" : ""} need restocking
              </p>
              <p className="text-blue-200/50 text-xs mt-0.5">
                Our system will auto-suggest optimal reorder quantities once you save your inventory.
              </p>
            </div>
          </motion.div>
        )}

        {/* ─── ADD PRODUCT ─── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="bg-white/[0.04] backdrop-blur-xl rounded-2xl border border-white/10 p-5 mb-6"
        >
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4 text-cyan-400" /> Add New Product
          </h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 space-y-1">
              <Label htmlFor="newProductName" className="text-white/60 text-xs">
                Product Name
              </Label>
              <Input
                id="newProductName"
                placeholder="e.g. Furniture"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addProduct()}
                className="bg-white/5 border-white/10 text-white placeholder:text-blue-200/30 focus:border-blue-400/50 focus:ring-blue-400/20"
              />
            </div>
            <div className="w-full sm:w-32 space-y-1">
              <Label htmlFor="newProductQty" className="text-white/60 text-xs">
                Quantity
              </Label>
              <Input
                id="newProductQty"
                type="number"
                min={0}
                placeholder="0"
                value={newQty}
                onChange={(e) => setNewQty(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addProduct()}
                className="bg-white/5 border-white/10 text-white placeholder:text-blue-200/30 focus:border-blue-400/50 focus:ring-blue-400/20"
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={addProduct}
                disabled={!newName.trim()}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/15 disabled:opacity-40 h-9"
              >
                <Plus className="w-4 h-4 mr-1" /> Add
              </Button>
            </div>
          </div>
        </motion.div>

        {/* ─── SEARCH ─── */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-200/30" />
          <Input
            placeholder="Search products…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white/5 border-white/10 text-white placeholder:text-blue-200/30 focus:border-blue-400/50 focus:ring-blue-400/20 pl-10"
          />
        </div>

        {/* ─── PRODUCT LIST ─── */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((product, i) => {
              const status = stockStatus(product.quantity);
              const StatusIcon = status.icon;
              const isHighlight = product.quantity === 0 || product.quantity <= LOW_STOCK_THRESHOLD;

              return (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 16, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  whileHover={{ y: -2 }}
                  className={`group bg-white/[0.04] backdrop-blur-xl rounded-xl p-4 border transition-all duration-300 ${
                    isHighlight
                      ? product.quantity === 0
                        ? "border-red-500/25 hover:border-red-500/40"
                        : "border-amber-500/25 hover:border-amber-500/40"
                      : "border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* product icon */}
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                        product.quantity === 0
                          ? "bg-red-500/15"
                          : product.quantity <= LOW_STOCK_THRESHOLD
                          ? "bg-amber-500/15"
                          : "bg-blue-500/15"
                      }`}
                    >
                      <Package
                        className={`w-5 h-5 ${
                          product.quantity === 0
                            ? "text-red-400"
                            : product.quantity <= LOW_STOCK_THRESHOLD
                            ? "text-amber-400"
                            : "text-blue-400"
                        }`}
                      />
                    </div>

                    {/* name + status */}
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{product.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <StatusIcon className={`w-3 h-3 ${status.color}`} />
                        <span className={`text-xs font-medium ${status.color}`}>{status.label}</span>
                      </div>
                    </div>

                    {/* quantity controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => decrement(product.id)}
                        disabled={product.quantity === 0}
                        className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      <span className="w-14 text-center text-white font-semibold tabular-nums text-lg">
                        {product.quantity}
                      </span>

                      <button
                        onClick={() => increment(product.id)}
                        className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/25 flex items-center justify-center text-blue-400 hover:bg-blue-500/25 hover:text-blue-300 transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* delete */}
                    <button
                      onClick={() => remove(product.id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="text-center py-12 text-blue-200/30">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="text-sm">{searchQuery ? "No products match your search" : "No products added yet"}</p>
            </div>
          )}
        </div>

        {/* ─── SAVE BUTTON ─── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.3 }}
          className="mt-8"
        >
          <Button
            onClick={handleSave}
            disabled={products.length === 0}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/20 transition-all duration-300 font-semibold h-12 text-base disabled:opacity-40"
          >
            <Save className="w-5 h-5 mr-2" />
            Save & Continue to Dashboard
          </Button>
          <p className="text-center text-blue-200/30 text-xs mt-3">
            Your inventory data will be used for AI-powered restocking &amp; demand insights
          </p>
        </motion.div>
      </div>

      {/* ─── SUCCESS OVERLAY ─── */}
      <AnimatePresence>
        {saved && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-500 p-5 shadow-lg shadow-emerald-500/30">
                <Warehouse className="w-full h-full text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Inventory Saved!</h2>
              <p className="text-blue-200/60 text-sm">Redirecting to your warehouse dashboard…</p>
              <div className="flex gap-2 mt-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0ms]" />
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:300ms]" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ──────── Stat Box ──────── */
function StatBox({
  icon: Icon,
  label,
  value,
  gradient,
  alert,
}: {
  icon: React.ElementType;
  label: string;
  value: number | string;
  gradient: string;
  alert?: boolean;
}) {
  return (
    <div
      className={`bg-white/[0.04] backdrop-blur-xl rounded-xl p-4 border transition-all ${
        alert ? "border-amber-500/20" : "border-white/10"
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${gradient} p-1.5`}>
          <Icon className="w-full h-full text-white" />
        </div>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-blue-200/40 text-xs mt-0.5">{label}</p>
    </div>
  );
}
