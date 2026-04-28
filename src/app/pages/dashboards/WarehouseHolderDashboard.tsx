import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import DashboardLayout from "../../components/DashboardLayout";
import StatsCard from "../../components/StatsCard";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Package, AlertTriangle, TrendingUp, Users, Phone, Plus, Minus,
  Trash2, Search, Save, User, Mail, MapPin, FileText, Building2,
  CheckCircle2, Boxes, BarChart3, ShoppingCart, XCircle, Edit3,
  ChevronRight, ArrowLeft, Monitor, Shirt, UtensilsCrossed, Stethoscope,
  BookOpen, Sofa, Star, Truck, Clock, Loader2,
} from "lucide-react";
import { toast } from "sonner";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, LineChart, Line, Cell, AreaChart, Area,
} from "recharts";
import { getInventory, getOrders, getSuppliers } from "../../../services/shipmentService";
import { getUserProfile, updateUserProfile } from "../../../services/userService";

/* ══════════════════════════════════════
   DATA MODEL
   ══════════════════════════════════════ */
interface SubItem {
  id: string;
  name: string;
  quantity: number;
}

interface Category {
  id: string;
  name: string;
  icon: React.ElementType;
  gradient: string;
  items: SubItem[];
}

const LOW = 30;
let _uid = 500;
const uid = () => String(++_uid);

// Default categories used as fallback when API returns empty
const defaultCategories: Category[] = [
  { id: "electronics", name: "Electronics", icon: Monitor, gradient: "from-blue-500 to-cyan-500", items: [] },
  { id: "clothing", name: "Clothing", icon: Shirt, gradient: "from-violet-500 to-purple-500", items: [] },
  { id: "food", name: "Food Items", icon: UtensilsCrossed, gradient: "from-emerald-500 to-teal-500", items: [] },
  { id: "medical", name: "Medical Supplies", icon: Stethoscope, gradient: "from-red-500 to-rose-500", items: [] },
  { id: "books", name: "Books & Stationery", icon: BookOpen, gradient: "from-amber-500 to-orange-500", items: [] },
  { id: "furniture", name: "Furniture", icon: Sofa, gradient: "from-pink-500 to-rose-500", items: [] },
];

/* ══════════════════════════════════════
   STATIC DATA
   ══════════════════════════════════════ */
// TODO: replace with backend API
// Endpoint: GET /api/analytics/demand
const demandData = [
  { month: "Jan", demand: 4000, supply: 3500 },
  { month: "Feb", demand: 3000, supply: 3200 },
  { month: "Mar", demand: 5000, supply: 4600 },
  { month: "Apr", demand: 4500, supply: 4800 },
  { month: "May", demand: 6000, supply: 5200 },
  { month: "Jun", demand: 5500, supply: 5800 },
];

const lowStockTrend = [
  { week: "W1", count: 2 }, { week: "W2", count: 3 }, { week: "W3", count: 2 },
  { week: "W4", count: 5 }, { week: "W5", count: 4 }, { week: "W6", count: 3 },
];

const PIE_COLORS = ["#8B004A", "#C4006A", "#6B0039", "#E8739E", "#F5C6DC", "#d97706", "#059669", "#2563eb"];

const chartTooltip = {
  contentStyle: {
    backgroundColor: "rgba(255, 255, 255, 0.98)",
    border: "1px solid rgba(139,0,74,0.15)",
    borderRadius: "0.75rem",
    color: "#1a1a1a",
    fontSize: "0.8rem",
    boxShadow: "0 8px 24px rgba(139,0,74,0.1)",
  },
};

const inputCls = "bg-white border-[#E5E5E5] text-[#1a1a1a] placeholder:text-[#888888] focus:border-[#8B004A]/40";

/* Suppliers and orders fetched from backend API */

/* ═══ RATINGS DATA ═══ */
interface Partner {
  name: string;
  rating: number;
  avgTime: string;
  reliability: number;
  status: "good" | "average" | "poor";
}

// TODO: replace with backend API
// Endpoint: GET /api/analytics/supplier-ratings
const supplierRatings: Partner[] = [
  { name: "TechParts Co.", rating: 4.8, avgTime: "2.1 days", reliability: 96, status: "good" },
  { name: "MedCorp Ltd.", rating: 4.2, avgTime: "3.5 days", reliability: 88, status: "good" },
  { name: "FashionHub", rating: 3.1, avgTime: "5.2 days", reliability: 64, status: "average" },
  { name: "FreshFoods Inc.", rating: 4.5, avgTime: "1.8 days", reliability: 92, status: "good" },
  { name: "BookWorld", rating: 2.4, avgTime: "7.0 days", reliability: 48, status: "poor" },
];

// TODO: replace with backend API
// Endpoint: GET /api/analytics/receiver-ratings
const receiverRatings: Partner[] = [
  { name: "Station Alpha", rating: 4.6, avgTime: "1.5 hrs", reliability: 94, status: "good" },
  { name: "Hub Central", rating: 3.8, avgTime: "3.2 hrs", reliability: 76, status: "average" },
  { name: "Depot East", rating: 4.9, avgTime: "0.8 hrs", reliability: 98, status: "good" },
  { name: "Point South", rating: 2.9, avgTime: "5.5 hrs", reliability: 52, status: "poor" },
  { name: "Zone West", rating: 4.1, avgTime: "2.0 hrs", reliability: 85, status: "good" },
];

const performanceCompare = [
  { name: "TechParts", supplier: 96, receiver: 0 },
  { name: "MedCorp", supplier: 88, receiver: 0 },
  { name: "FreshFoods", supplier: 92, receiver: 0 },
  { name: "Station Alpha", supplier: 0, receiver: 94 },
  { name: "Depot East", supplier: 0, receiver: 98 },
  { name: "Zone West", supplier: 0, receiver: 85 },
];

const statusStyle: Record<string, { cls: string; label: string }> = {
  good: { cls: "status-instock", label: "Good" },
  average: { cls: "status-low", label: "Average" },
  poor: { cls: "status-out", label: "Poor" },
};

function Stars({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < Math.floor(rating);
        const half = !filled && i < rating;
        return (
          <Star
            key={i}
            className={`w-3.5 h-3.5 transition-colors ${
              filled ? "text-amber-500 fill-amber-500" : half ? "text-amber-500 fill-amber-500/40" : "text-[#E5E5E5]"
            }`}
          />
        );
      })}
      <span className="text-[#555555] text-xs ml-1.5 tabular-nums">{rating.toFixed(1)}</span>
    </div>
  );
}

/* ══════════════════════════════════════
   HELPERS
   ══════════════════════════════════════ */
function catTotalQty(cat: Category) {
  return cat.items.reduce((s, i) => s + i.quantity, 0);
}
function catStatus(cat: Category) {
  const total = catTotalQty(cat);
  const outCount = cat.items.filter((i) => i.quantity === 0).length;
  if (outCount === cat.items.length) return { label: "Out of Stock", cls: "status-out" };
  const lowCount = cat.items.filter((i) => i.quantity > 0 && i.quantity <= LOW).length;
  if (lowCount > 0 || total <= LOW * cat.items.length * 0.3) return { label: "Low Stock", cls: "status-low" };
  return { label: "In Stock", cls: "status-instock" };
}

function Card({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay }}
      className={`bg-white rounded-2xl p-6 border ${className}`}
      style={{ borderColor: "rgba(139,0,74,0.1)", boxShadow: "0 2px 16px rgba(139,0,74,0.06)" }}>
      {children}
    </motion.div>
  );
}

/* ══════════════════════════════════════
   OVERVIEW
   ══════════════════════════════════════ */
function OverviewPage({ categories }: { categories: Category[] }) {
  const allItems = categories.flatMap((c) => c.items);
  const totalStock = allItems.reduce((s, i) => s + i.quantity, 0);
  const lowCount = allItems.filter((i) => i.quantity > 0 && i.quantity <= LOW).length;
  const outCount = allItems.filter((i) => i.quantity === 0).length;

  const stockDistData = categories.map((c) => ({ name: c.name, stock: catTotalQty(c) }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Total Stock" value={totalStock.toLocaleString()} icon={Package} trend="+12.5%" trendUp gradient="from-blue-500 to-cyan-500" delay={0} />
        <StatsCard title="Low Stock Items" value={lowCount + outCount} icon={AlertTriangle} trend={`${lowCount} low · ${outCount} out`} trendUp={false} gradient="from-amber-500 to-orange-500" delay={0.1} />
        <StatsCard title="Categories" value={categories.length} icon={Boxes} trend={`${allItems.length} products`} trendUp gradient="from-emerald-500 to-teal-500" delay={0.2} />
        <StatsCard title="Active Orders" value="156" icon={Users} trend="+5.4%" trendUp gradient="from-violet-500 to-purple-500" delay={0.3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2" delay={0.4}>
          <h3 className="text-xl font-semibold text-foreground mb-6">Category Overview</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="text-left border-b border-border/5"><th className="pb-3 text-muted-foreground text-xs uppercase tracking-wider">Category</th><th className="pb-3 text-muted-foreground text-xs uppercase tracking-wider">Items</th><th className="pb-3 text-muted-foreground text-xs uppercase tracking-wider">Total Qty</th><th className="pb-3 text-muted-foreground text-xs uppercase tracking-wider">Status</th></tr></thead>
              <tbody>
                {categories.map((c) => { const s = catStatus(c); return (
                  <tr key={c.id} className="border-b border-border/5">
                    <td className="py-3 text-foreground text-sm font-medium">{c.name}</td>
                    <td className="py-3 text-muted-foreground text-sm">{c.items.length}</td>
                    <td className="py-3 text-foreground text-sm">{catTotalQty(c).toLocaleString()}</td>
                    <td className="py-3"><span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${s.cls}`}>{s.label}</span></td>
                  </tr>
                ); })}
              </tbody>
            </table>
          </div>
        </Card>

        <Card delay={0.5}>
          <h3 className="text-xl font-semibold text-foreground mb-6">Restock Suggestions</h3>
          <div className="space-y-3">
            {categories.filter((c) => c.items.some((i) => i.quantity <= LOW)).slice(0, 3).map((c) => (
              <div key={c.id} className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <p className="text-amber-400 font-medium text-sm">{c.name}</p>
                <p className="text-[#9ca3af] text-xs">{c.items.filter((i) => i.quantity <= LOW).length} items need restocking</p>
              </div>
            ))}
            <Button className="w-full mt-2 bg-gradient-to-r from-[#8B004A] to-[#C4006A] hover:from-[#6B0039] hover:to-[#8B004A]"><Phone className="w-4 h-4 mr-2" />Contact Supplier</Button>
          </div>
        </Card>
      </div>

      <Card delay={0.6}>
        <h3 className="text-xl font-semibold text-foreground mb-6">Demand Insights</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={demandData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,0,74,0.08)" />
            <XAxis dataKey="month" stroke="rgba(26,26,26,0.4)" fontSize={12} />
            <YAxis stroke="rgba(26,26,26,0.4)" fontSize={12} />
            <Tooltip {...chartTooltip} />
            <Line type="monotone" dataKey="demand" stroke="#8B004A" strokeWidth={3} dot={{ fill: "#3b82f6", r: 5 }} name="Demand" />
            <Line type="monotone" dataKey="supply" stroke="#C4006A" strokeWidth={3} dot={{ fill: "#10b981", r: 5 }} name="Supply" />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

/* ══════════════════════════════════════
   INVENTORY — CATEGORY LIST (no +/-)
   ══════════════════════════════════════ */
function InventoryPage({ categories, onOpenCategory }: { categories: Category[]; onOpenCategory: (id: string) => void }) {
  const [search, setSearch] = useState("");
  const filtered = search.trim()
    ? categories.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    : categories;

  const allItems = categories.flatMap((c) => c.items);
  const totalProducts = allItems.length;
  const totalUnits = allItems.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-[#1a1a1a]">Inventory</h2>
        <p className="text-[#9ca3af] text-sm">{categories.length} categories · {totalProducts} products · {totalUnits.toLocaleString()} total units</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#b0a8b0]" />
        <Input placeholder="Search categories…" value={search} onChange={(e) => setSearch(e.target.value)} className={`${inputCls} pl-10`} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((cat, i) => {
          const Icon = cat.icon;
          const status = catStatus(cat);
          const total = catTotalQty(cat);
          const lowItems = cat.items.filter((it) => it.quantity <= LOW).length;

          return (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              whileHover={{ y: -4, scale: 1.01 }}
              onClick={() => onOpenCategory(cat.id)}
              className="group relative bg-[#F9F7F2] backdrop-blur-xl rounded-2xl p-5 border border-[rgba(139,0,74,0.1)] hover:border-[rgba(139,0,74,0.2)] transition-all duration-300 text-left"
            >
              {/* gradient glow on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-0 group-hover:opacity-[0.06] rounded-2xl transition-opacity duration-300`} />

              <div className="relative flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.gradient} p-2.5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-full h-full text-[#1a1a1a]" />
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium border ${status.cls}`}>{status.label}</span>
              </div>

              <div className="relative">
                <h3 className="text-lg font-semibold text-white mb-1">{cat.name}</h3>
                <div className="flex items-center gap-3 text-sm text-[#9ca3af]">
                  <span>{cat.items.length} items</span>
                  <span className="w-1 h-1 rounded-full bg-blue-200/20" />
                  <span>{total.toLocaleString()} units</span>
                </div>
                {lowItems > 0 && (
                  <p className="text-amber-400/80 text-xs mt-2 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> {lowItems} item{lowItems > 1 ? "s" : ""} need attention
                  </p>
                )}
              </div>

              <div className="relative flex items-center justify-end mt-4 text-[#8B004A] group-hover:text-[#8B004A] transition-colors">
                <span className="text-xs font-medium">View Items</span>
                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-[#b0a8b0] text-sm">No categories match your search</div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════
   SUBCATEGORY PAGE — quantity +/-
   ══════════════════════════════════════ */
function SubcategoryPage({
  category,
  onBack,
  onUpdateItem,
  onDeleteItem,
  onAddItem,
}: {
  category: Category;
  onBack: () => void;
  onUpdateItem: (catId: string, itemId: string, delta: number) => void;
  onDeleteItem: (catId: string, itemId: string) => void;
  onAddItem: (catId: string, name: string, qty: number) => void;
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newQty, setNewQty] = useState("");
  const [search, setSearch] = useState("");

  const Icon = category.icon;
  const filtered = search.trim()
    ? category.items.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()))
    : category.items;

  const totalQty = catTotalQty(category);
  const lowCount = category.items.filter((i) => i.quantity > 0 && i.quantity <= LOW).length;
  const outCount = category.items.filter((i) => i.quantity === 0).length;

  const handleAdd = () => {
    if (!newName.trim()) return;
    onAddItem(category.id, newName.trim(), Math.max(0, parseInt(newQty) || 0));
    setNewName("");
    setNewQty("");
    setShowAdd(false);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <button onClick={onBack} className="flex items-center gap-1.5 text-[#9ca3af] hover:text-blue-200 transition-colors text-sm mb-2">
            <ArrowLeft className="w-4 h-4" /> Back to Inventory
          </button>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${category.gradient} p-2 shadow-lg`}>
              <Icon className="w-full h-full text-[#1a1a1a]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#1a1a1a]">{category.name}</h2>
              <p className="text-[#9ca3af] text-sm">{category.items.length} items · {totalQty.toLocaleString()} units</p>
            </div>
          </div>
        </div>
        <Button onClick={() => setShowAdd(true)} className="bg-gradient-to-r from-[#8B004A] to-[#C4006A] hover:from-[#6B0039] hover:to-[#8B004A] shadow-lg shadow-[#8B004A]/15">
          <Plus className="w-4 h-4 mr-1.5" /> Add New Item
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#F9F7F2] rounded-xl p-3 border border-[rgba(139,0,74,0.1)]">
          <p className="text-2xl font-bold text-[#1a1a1a]">{totalQty.toLocaleString()}</p>
          <p className="text-[#9ca3af] text-xs">Total Units</p>
        </div>
        <div className={`rounded-xl p-3 border ${lowCount > 0 ? "bg-amber-500/[0.06] border-amber-500/20" : "bg-[#F9F7F2] border-[rgba(139,0,74,0.1)]"}`}>
          <p className="text-2xl font-bold text-[#1a1a1a]">{lowCount}</p>
          <p className="text-[#9ca3af] text-xs">Low Stock</p>
        </div>
        <div className={`rounded-xl p-3 border ${outCount > 0 ? "bg-red-500/[0.06] border-red-500/20" : "bg-[#F9F7F2] border-[rgba(139,0,74,0.1)]"}`}>
          <p className="text-2xl font-bold text-[#1a1a1a]">{outCount}</p>
          <p className="text-[#9ca3af] text-xs">Out of Stock</p>
        </div>
      </div>

      {/* Add Item Form */}
      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
            <Card>
              <h3 className="text-white font-semibold mb-3 text-sm flex items-center gap-2"><Plus className="w-4 h-4 text-cyan-400" /> Add New Item to {category.name}</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1"><Label className="text-white/60 text-xs">Product Name</Label><Input placeholder="e.g. Headphones" value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAdd()} className={inputCls} /></div>
                <div className="w-full sm:w-32"><Label className="text-white/60 text-xs">Quantity</Label><Input type="number" min={0} placeholder="0" value={newQty} onChange={(e) => setNewQty(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAdd()} className={inputCls} /></div>
                <div className="flex items-end gap-2">
                  <Button onClick={handleAdd} disabled={!newName.trim()} className="bg-gradient-to-r from-[#8B004A] to-[#C4006A] disabled:opacity-40"><Plus className="w-4 h-4 mr-1" />Add</Button>
                  <Button onClick={() => setShowAdd(false)} variant="outline" className="bg-white border-[rgba(139,0,74,0.1)] text-white hover:bg-[#F2EFE7] hover:text-white">Cancel</Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#b0a8b0]" />
        <Input placeholder="Search items…" value={search} onChange={(e) => setSearch(e.target.value)} className={`${inputCls} pl-10`} />
      </div>

      {/* Items List */}
      <div className="space-y-2.5">
        <AnimatePresence mode="popLayout">
          {filtered.map((item, i) => {
            const isOut = item.quantity === 0;
            const isLow = item.quantity > 0 && item.quantity <= LOW;

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, delay: i * 0.03 }}
                whileHover={{ y: -2 }}
                className={`group bg-[#F9F7F2] backdrop-blur-xl rounded-xl p-4 border transition-all duration-300 ${
                  isOut ? "border-red-500/25 hover:border-red-500/40" : isLow ? "border-amber-500/25 hover:border-amber-500/40" : "border-[rgba(139,0,74,0.1)] hover:border-[rgba(139,0,74,0.2)]"
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${isOut ? "bg-red-500/15" : isLow ? "bg-amber-500/15" : "bg-[rgba(139,0,74,0.1)]"}`}>
                    <Package className={`w-5 h-5 ${isOut ? "text-red-400" : isLow ? "text-amber-400" : "text-[#8B004A]"}`} />
                  </div>

                  {/* Name + status */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[#1a1a1a] font-medium">{item.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {isOut ? (
                        <><XCircle className="w-3 h-3 text-red-400" /><span className="text-xs font-medium text-red-400">Out of Stock</span></>
                      ) : isLow ? (
                        <><AlertTriangle className="w-3 h-3 text-amber-400" /><span className="text-xs font-medium text-amber-400">Low Stock</span></>
                      ) : (
                        <><CheckCircle2 className="w-3 h-3 text-emerald-400" /><span className="text-xs font-medium text-emerald-400">In Stock</span></>
                      )}
                    </div>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdateItem(category.id, item.id, -1)}
                      disabled={item.quantity === 0}
                      className="w-8 h-8 rounded-lg bg-white border border-[rgba(139,0,74,0.1)] flex items-center justify-center text-white/60 hover:bg-[#F2EFE7] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-90"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-14 text-center text-white font-semibold tabular-nums text-lg">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateItem(category.id, item.id, 1)}
                      className="w-8 h-8 rounded-lg bg-[rgba(139,0,74,0.1)] border border-blue-500/25 flex items-center justify-center text-[#8B004A] hover:bg-blue-500/25 hover:text-[#8B004A] transition-all active:scale-90"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => onDeleteItem(category.id, item.id)}
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
          <div className="text-center py-12 text-[#b0a8b0]"><Package className="w-10 h-10 mx-auto mb-3 opacity-40" /><p className="text-sm">{search ? "No items match" : "No items in this category"}</p></div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   LOW STOCK
   ══════════════════════════════════════ */
function LowStockPage({ categories, onUpdateItem }: { categories: Category[]; onUpdateItem: (catId: string, itemId: string, delta: number) => void }) {
  const lowItems = categories.flatMap((c) =>
    c.items.filter((i) => i.quantity <= LOW).map((i) => ({ ...i, categoryId: c.id, categoryName: c.name }))
  );

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-[#1a1a1a]">Low Stock Alerts</h2>
        <p className="text-[#9ca3af] text-sm">{lowItems.length} items need attention</p>
      </div>

      {lowItems.length === 0 ? (
        <Card><div className="py-12 text-center"><CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" /><p className="text-[#1a1a1a] text-lg font-semibold">All stocks are healthy!</p><p className="text-[#9ca3af] text-sm mt-1">No items below the threshold ({LOW} units)</p></div></Card>
      ) : (
        <div className="space-y-2.5">
          {lowItems.map((item, i) => (
            <motion.div key={`${item.categoryId}-${item.id}`} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
              className={`rounded-xl p-4 border transition-all ${item.quantity === 0 ? "bg-red-500/[0.06] border-red-500/25" : "bg-amber-500/[0.06] border-amber-500/25"}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.quantity === 0 ? "bg-red-500/15" : "bg-amber-500/15"}`}>
                    {item.quantity === 0 ? <XCircle className="w-5 h-5 text-red-400" /> : <AlertTriangle className="w-5 h-5 text-amber-400" />}
                  </div>
                  <div>
                    <p className="text-[#1a1a1a] font-medium">{item.name}</p>
                    <p className="text-[#9ca3af] text-xs">{item.categoryName} · {item.quantity === 0 ? "Out of stock" : `${item.quantity} units`}</p>
                  </div>
                </div>
                <Button onClick={() => onUpdateItem(item.categoryId, item.id, 10)} size="sm" className="bg-gradient-to-r from-[#8B004A] to-[#C4006A] hover:from-[#6B0039] hover:to-[#8B004A] shadow-sm"><Plus className="w-3.5 h-3.5 mr-1" />Restock +10</Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════
   SUPPLIERS
   ══════════════════════════════════════ */
function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [sLoading, setSLoading] = useState(true);

  useEffect(() => {
    getSuppliers()
      .then((data) => setSuppliers(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setSLoading(false));
  }, []);

  if (sLoading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#8B004A]" /></div>;

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold text-[#1a1a1a]">Suppliers</h2>
      {suppliers.length === 0 ? (
        <div className="text-center py-12 text-[#9ca3af]">No suppliers found</div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suppliers.map((s: any, i: number) => (
          <Card key={s.id} delay={i * 0.08}>
            <div className="flex items-start justify-between">
              <div><h3 className="text-[#1a1a1a] font-semibold">{s.name}</h3><p className="text-[#9ca3af] text-xs mt-1">{s.items}</p><p className="text-[#9ca3af] text-sm mt-2 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />{s.contact}</p></div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${s.status === "active" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-amber-500/20 text-amber-400 border-amber-500/30"}`}>{s.status === "active" ? "Active" : "Pending"}</span>
            </div>
            <div className="flex items-center gap-3 mt-5">
              <Button className="flex-1 bg-[#D7340B]/10 text-[#D7340B] border-none hover:bg-[#D7340B]/20 transition-all duration-300 hover:scale-[1.02] shadow-sm rounded-xl h-11" variant="outline">
                <Phone className="w-4 h-4 mr-2" />Contact
              </Button>
              <Button onClick={() => { window.location.href = "mailto:supplier@email.com"; }} className="flex-1 bg-[#F3F4F6] text-[#111827] border-none hover:bg-[#E5E7EB] transition-all duration-300 hover:scale-[1.02] shadow-sm rounded-xl h-11" variant="outline">
                <Mail className="w-4 h-4 mr-2" />Email
              </Button>
            </div>
          </Card>
        ))}
      </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════
   ORDERS
   ══════════════════════════════════════ */
function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [oLoading, setOLoading] = useState(true);

  useEffect(() => {
    getOrders()
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setOLoading(false));
  }, []);

  if (oLoading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#8B004A]" /></div>;

  const cls: Record<string, string> = { shipped: "bg-blue-500/20 text-[#8B004A] border-blue-500/30", processing: "bg-amber-500/20 text-amber-400 border-amber-500/30", delivered: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" };
  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold text-[#1a1a1a]">Orders / Shipments</h2>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="text-left border-b border-[rgba(139,0,74,0.1)]"><th className="pb-3 text-[#6b6b6b] text-xs uppercase tracking-wider">Order ID</th><th className="pb-3 text-[#6b6b6b] text-xs uppercase tracking-wider">Product</th><th className="pb-3 text-[#6b6b6b] text-xs uppercase tracking-wider">Qty</th><th className="pb-3 text-[#6b6b6b] text-xs uppercase tracking-wider">Date</th><th className="pb-3 text-[#6b6b6b] text-xs uppercase tracking-wider">Status</th></tr></thead>
            <tbody>
              {orders.map((o: any, i: number) => (
                <motion.tr key={o.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="border-b border-[rgba(139,0,74,0.07)] hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 text-[#1a1a1a] text-sm font-mono">{o.id}</td><td className="py-3.5 text-white text-sm">{o.product}</td><td className="py-3.5 text-white text-sm">{o.qty}</td><td className="py-3.5 text-[#9ca3af] text-sm">{o.date}</td>
                  <td className="py-3.5"><span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${cls[o.status]}`}>{o.status}</span></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

/* ══════════════════════════════════════
   PARTNER RATING TABLE
   ══════════════════════════════════════ */
function PartnerTable({ partners, type }: { partners: Partner[]; type: "supplier" | "receiver" }) {
  const isSupplier = type === "supplier";
  const sorted = [...partners].sort((a, b) => b.rating - a.rating);

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left border-b border-border/10">
            <th className="pb-3 text-muted-foreground text-xs uppercase tracking-wider">#</th>
            <th className="pb-3 text-muted-foreground text-xs uppercase tracking-wider">Name</th>
            <th className="pb-3 text-muted-foreground text-xs uppercase tracking-wider">Rating</th>
            <th className="pb-3 text-muted-foreground text-xs uppercase tracking-wider">{isSupplier ? "Delivery Time" : "Response Time"}</th>
            <th className="pb-3 text-muted-foreground text-xs uppercase tracking-wider">Reliability</th>
            <th className="pb-3 text-muted-foreground text-xs uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((p, i) => {
            const st = statusStyle[p.status];
            const isTop = i === 0;
            return (
              <motion.tr
                key={p.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className={`border-b border-[rgba(139,0,74,0.07)] hover:bg-[#F9F7F2] transition-colors ${isTop ? "bg-amber-500/[0.03]" : ""}`}
              >
                <td className="py-3.5 text-[#888888] text-sm">
                  {isTop ? <span className="text-amber-400 font-bold">👑</span> : i + 1}
                </td>
                <td className="py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isSupplier ? "bg-[rgba(139,0,74,0.1)]" : "bg-[rgba(139,0,74,0.08)]"
                    }`}>
                      {isSupplier
                        ? <Truck className="w-4 h-4 text-[#8B004A]" />
                        : <Package className="w-4 h-4 text-[#8B004A]" />
                      }
                    </div>
                    <span className={`text-sm font-medium ${isTop ? "text-amber-600 font-bold" : "text-foreground"}`}>{p.name}</span>
                  </div>
                </td>
                <td className="py-3.5"><Stars rating={p.rating} /></td>
                <td className="py-3.5">
                  <div className="flex items-center gap-1.5 text-[#9ca3af] text-sm">
                    <Clock className="w-3.5 h-3.5" />{p.avgTime}
                  </div>
                </td>
                <td className="py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 rounded-full bg-[#F2EFE7] overflow-hidden border border-[rgba(139,0,74,0.08)]">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          p.reliability >= 80 ? "bg-emerald-400" : p.reliability >= 60 ? "bg-amber-400" : "bg-red-400"
                        }`}
                        style={{ width: `${p.reliability}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground tabular-nums">{p.reliability}%</span>
                  </div>
                </td>
                <td className="py-3.5">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${st.cls}`}>{st.label}</span>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ══════════════════════════════════════
   ANALYTICS
   ══════════════════════════════════════ */
function AnalyticsPage({ categories }: { categories: Category[] }) {
  const stockDistData = categories.map((c) => ({ name: c.name, stock: catTotalQty(c) }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1a1a1a]">Analytics & Insights</h2>
        <p className="text-[#9ca3af] text-sm">Performance metrics, stock trends and partner ratings</p>
      </div>

      {/* Row 1: Stock Distribution + Demand vs Supply */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card delay={0.1}>
          <h3 className="text-lg font-semibold text-foreground mb-4">Stock Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stockDistData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,0,74,0.08)" />
              <XAxis dataKey="name" stroke="rgba(26,26,26,0.4)" fontSize={11} angle={-20} textAnchor="end" height={60} />
              <YAxis stroke="rgba(26,26,26,0.4)" fontSize={12} />
              <Tooltip {...chartTooltip} />
              <Bar dataKey="stock" radius={[6, 6, 0, 0]}>{stockDistData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card delay={0.2}>
          <h3 className="text-lg font-semibold text-foreground mb-4">Demand vs Supply</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={demandData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,0,74,0.08)" />
              <XAxis dataKey="month" stroke="rgba(26,26,26,0.4)" fontSize={12} />
              <YAxis stroke="rgba(26,26,26,0.4)" fontSize={12} />
              <Tooltip {...chartTooltip} />
              <Area type="monotone" dataKey="demand" stroke="#8B004A" fill="#8B004A" fillOpacity={0.15} strokeWidth={2} />
              <Area type="monotone" dataKey="supply" stroke="#C4006A" fill="#059669" fillOpacity={0.1} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Row 2: Supplier & Receiver Performance */}
      <Card delay={0.3}>
        <div className="mb-5">
          <h3 className="text-lg font-semibold text-[#1a1a1a]">Supplier & Receiver Performance</h3>
          <p className="text-[#9ca3af] text-xs mt-1">Ratings and performance insights for your partners</p>
        </div>

        {/* Supplier Ratings */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-[rgba(139,0,74,0.1)] flex items-center justify-center"><Truck className="w-3.5 h-3.5 text-[#8B004A]" /></div>
            <h4 className="text-sm font-semibold text-[#1a1a1a]">Supplier Ratings</h4>
            <span className="text-[10px] text-[#b0a8b0] ml-1">{supplierRatings.length} partners</span>
          </div>
          <PartnerTable partners={supplierRatings} type="supplier" />
        </div>

        <div className="border-t border-[rgba(139,0,74,0.1)] pt-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-[#8B004A]/10 flex items-center justify-center"><Package className="w-3.5 h-3.5 text-[#8B004A]" /></div>
            <h4 className="text-sm font-semibold text-[#1a1a1a]">Receiver Ratings</h4>
            <span className="text-[10px] text-[#888888] ml-1">{receiverRatings.length} partners</span>
          </div>
          <PartnerTable partners={receiverRatings} type="receiver" />
        </div>
      </Card>

      {/* Row 3: Low Stock Trends + Performance Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card delay={0.4}>
          <h3 className="text-lg font-semibold text-[#1A1A1A] mb-4">Low Stock Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lowStockTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,0,74,0.08)" />
              <XAxis dataKey="week" stroke="rgba(26,26,26,0.4)" fontSize={12} />
              <YAxis stroke="rgba(26,26,26,0.4)" fontSize={12} />
              <Tooltip {...chartTooltip} />
              <Line type="monotone" dataKey="count" stroke="#f59e0b" strokeWidth={3} dot={{ fill: "#f59e0b", r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card delay={0.5}>
          <h3 className="text-lg font-semibold text-[#1A1A1A] mb-4">Top Performers — Reliability Score</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceCompare} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,0,74,0.08)" />
              <XAxis type="number" domain={[0, 100]} stroke="rgba(26,26,26,0.4)" fontSize={12} unit="%" />
              <YAxis dataKey="name" type="category" stroke="rgba(26,26,26,0.4)" fontSize={11} width={90} />
              <Tooltip {...chartTooltip} />
              <Legend wrapperStyle={{ fontSize: "12px", color: "rgba(255,255,255,0.6)" }} />
              <Bar dataKey="supplier" name="Supplier" fill="#8B004A" radius={[0, 6, 6, 0]} barSize={14} />
              <Bar dataKey="receiver" name="Receiver" fill="#8b5cf6" radius={[0, 6, 6, 0]} barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   PROFILE
   ══════════════════════════════════════ */
function ProfilePage({ setPage }: { setPage: (p: string) => void }) {
  const data = JSON.parse(sessionStorage.getItem("warehouseData") || "{}");
  const fields = [
    { label: "Warehouse Name", value: data.warehouseName || "Central Storage Hub", icon: Building2 },
    { label: "Owner Name", value: data.ownerName || sessionStorage.getItem("userName") || "Admin User", icon: User },
    { label: "Email Address", value: data.email || "admin@supplychain.com", icon: Mail },
    { label: "Phone Number", value: data.phone || "+91 98765 43210", icon: Phone },
    { label: "GST Number", value: data.gstNumber || "22AAAAA0000A1Z5", icon: FileText },
    { label: "Address", value: data.address || "Mumbai, Maharashtra", icon: MapPin },
  ];
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between"><h2 className="text-2xl font-bold text-foreground">Profile</h2><Button onClick={() => setPage("settings")} variant="outline" className="bg-card border-border/10 text-foreground hover:bg-accent/10"><Edit3 className="w-4 h-4 mr-1.5" />Edit</Button></div>
      <Card>
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border/10">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#8B004A] to-[#C4006A] flex items-center justify-center shadow-lg shadow-[#8B004A]/25"><User className="w-8 h-8 text-white" /></div>
          <div><h3 className="text-xl font-bold text-foreground">{fields[1].value}</h3><p className="text-muted-foreground text-sm">{fields[0].value}</p><span className="inline-block mt-1 text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20 rounded-full px-2 py-0.5">Warehouse Holder</span></div>
        </div>
        <div className="space-y-4">
          {fields.map((f) => { const I = f.icon; return (
            <div key={f.label} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shadow-sm">
                <I className="w-4 h-4 text-[#888888]" />
              </div>
              <div>
                <p className="text-[10px] text-[#888888] uppercase tracking-wider">{f.label}</p>
                <p className="text-[#1a1a1a] text-sm">{f.value}</p>
              </div>
            </div>
          ); })}
        </div>
      </Card>
    </div>
  );
}

/* ══════════════════════════════════════
   SETTINGS
   ══════════════════════════════════════ */
function SettingsPage() {
  const data = JSON.parse(sessionStorage.getItem("warehouseData") || "{}");
  const [vals, setVals] = useState({ ownerName: data.ownerName || "Admin User", email: data.email || "admin@supplychain.com", phone: data.phone || "+91 98765 43210", warehouseName: data.warehouseName || "Central Storage Hub", address: data.address || "Mumbai, Maharashtra", gstNumber: data.gstNumber || "22AAAAA0000A1Z5", password: "", confirmPassword: "" });
  const [saved, setSaved] = useState(false);
  const set = (k: string, v: string) => setVals((p) => ({ ...p, [k]: v }));
  const handleSave = () => { sessionStorage.setItem("warehouseData", JSON.stringify(vals)); sessionStorage.setItem("userName", vals.ownerName); setSaved(true); setTimeout(() => setSaved(false), 2500); };
  const fields = [{ id: "ownerName", label: "Owner Name", type: "text" }, { id: "email", label: "Email", type: "email" }, { id: "phone", label: "Phone", type: "tel" }, { id: "warehouseName", label: "Warehouse Name", type: "text" }, { id: "address", label: "Address", type: "text" }, { id: "gstNumber", label: "GST Number", type: "text" }];

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-2xl font-bold text-[#1a1a1a]">Account Settings</h2>
      <Card>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map((f) => (<div key={f.id} className="space-y-1.5"><Label className="text-muted-foreground text-xs">{f.label}</Label><Input type={f.type} value={(vals as Record<string, string>)[f.id]} onChange={(e) => set(f.id, e.target.value)} className={inputCls} /></div>))}
          </div>
          <div className="pt-4 border-t border-border/10">
            <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-3">Change Password</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label className="text-muted-foreground text-xs">New Password</Label><Input type="password" placeholder="••••••••" value={vals.password} onChange={(e) => set("password", e.target.value)} className={inputCls} /></div>
              <div className="space-y-1.5"><Label className="text-muted-foreground text-xs">Confirm Password</Label><Input type="password" placeholder="••••••••" value={vals.confirmPassword} onChange={(e) => set("confirmPassword", e.target.value)} className={inputCls} /></div>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <Button onClick={handleSave} className="bg-gradient-to-r from-[#8B004A] to-[#C4006A] hover:from-[#6B0039] hover:to-[#8B004A] shadow-lg shadow-[#8B004A]/15"><Save className="w-4 h-4 mr-1.5" />Save Changes</Button>
            {saved && <motion.span initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="text-emerald-400 text-sm flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Saved!</motion.span>}
          </div>
        </div>
      </Card>
    </div>
  );
}

import RoleEntryModal from "../../components/RoleEntryModal";

/* ══════════════════════════════════════
   MASTER DASHBOARD
   ══════════════════════════════════════ */
export default function WarehouseHolderDashboard() {
  const [activePage, setActivePage] = useState("dashboard");
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);
  const [warehouseId, setWarehouseId] = useState<string | null>(sessionStorage.getItem("warehouseId"));
  const [invLoading, setInvLoading] = useState(true);

  // Fetch inventory from API on mount
  useEffect(() => {
    getInventory()
      .then((data: any) => {
        if (Array.isArray(data) && data.length > 0) {
          // Map API data to local Category shape, preserving icons/gradients
          const mapped = data.map((apiCat: any) => {
            const fallback = defaultCategories.find(d => d.id === apiCat.id) || defaultCategories[0];
            return { ...fallback, ...apiCat, icon: fallback.icon, gradient: fallback.gradient };
          });
          setCategories(mapped);
        }
      })
      .catch(() => {})
      .finally(() => setInvLoading(false));
  }, []);

  /* ── Category operations ── */
  const updateItem = (catId: string, itemId: string, delta: number) => {
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id === catId) {
          const item = c.items.find(i => i.id === itemId);
          if (item) {
            const newQty = Math.max(0, item.quantity + delta);
            toast.success(`Inventory Updated`, {
              description: `${item.name}: ${item.quantity} → ${newQty}`,
              icon: delta > 0 ? <Plus className="w-4 h-4" /> : <Minus className="w-4 h-4" />
            });
          }
          return { ...c, items: c.items.map((i) => (i.id === itemId ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i)) };
        }
        return c;
      })
    );
  };

  const deleteItem = (catId: string, itemId: string) => {
    const cat = categories.find(c => c.id === catId);
    const item = cat?.items.find(i => i.id === itemId);
    if (item) toast.error(`Item Deleted`, { description: `${item.name} removed from ${cat?.name}` });

    setCategories((prev) =>
      prev.map((c) => (c.id === catId ? { ...c, items: c.items.filter((i) => i.id !== itemId) } : c))
    );
  };

  const addItem = (catId: string, name: string, qty: number) => {
    toast.success(`New Item Added`, { description: `${name} (${qty} units) added to inventory` });
    setCategories((prev) =>
      prev.map((c) => (c.id === catId ? { ...c, items: [...c.items, { id: uid(), name, quantity: qty }] } : c))
    );
  };

  const openCategory = categories.find((c) => c.id === openCategoryId) || null;

  /* ── Handle menu click — if in subcategory, go back to inventory first ── */
  const handleMenuClick = (id: string) => {
    setOpenCategoryId(null);
    setActivePage(id);
  };

  const renderPage = () => {
    // If a subcategory is open
    if (openCategoryId && openCategory) {
      return (
        <SubcategoryPage
          category={openCategory}
          onBack={() => setOpenCategoryId(null)}
          onUpdateItem={updateItem}
          onDeleteItem={deleteItem}
          onAddItem={addItem}
        />
      );
    }

    switch (activePage) {
      case "dashboard": return <OverviewPage categories={categories} />;
      case "inventory": return <InventoryPage categories={categories} onOpenCategory={(id) => setOpenCategoryId(id)} />;
      case "low-stock": return <LowStockPage categories={categories} onUpdateItem={updateItem} />;
      case "suppliers": return <SuppliersPage />;
      case "orders": return <OrdersPage />;
      case "analytics": return <AnalyticsPage categories={categories} />;
      case "profile": return <ProfilePage setPage={setActivePage} />;
      case "settings": return <SettingsPage />;
      default: return <OverviewPage categories={categories} />;
    }
  };

  return (
    <>
      <RoleEntryModal
        isOpen={!warehouseId}
        role="warehouse"
        onSave={(id) => setWarehouseId(id)}
      />
      <DashboardLayout role="warehouse" activeMenu={activePage} onMenuClick={handleMenuClick}>
        <AnimatePresence mode="wait">
          <motion.div key={openCategoryId || activePage} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </DashboardLayout>
    </>
  );
}
