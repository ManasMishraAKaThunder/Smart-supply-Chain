import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Phone, Star, MessageSquare, MapPin, ShieldCheck, Package2, Loader2 } from "lucide-react";
import { getSuppliers } from "../../../../services/shipmentService";


function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-3.5 h-3.5 ${
            s <= Math.floor(rating)
              ? "text-amber-400 fill-amber-400"
              : s - rating < 1
              ? "text-amber-400 fill-amber-400/40"
              : "text-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

function ReliabilityBar({ score }: { score: number }) {
  const color =
    score >= 95 ? "#10b981" : score >= 85 ? "#3b82f6" : score >= 75 ? "#f59e0b" : "#ef4444";
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-[#9ca3af] flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" /> Reliability
        </span>
        <span className="font-semibold" style={{ color }}>{score}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-white overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

const categoryColors: Record<string, string> = {
  "Food & Beverages": "text-emerald-400 bg-emerald-500/10 border-emerald-500/25",
  Electronics: "text-[#8B004A] bg-blue-500/10 border-blue-500/25",
  "Medical Supplies": "text-rose-400 bg-rose-500/10 border-rose-500/25",
  Construction: "text-amber-400 bg-amber-500/10 border-amber-500/25",
  "Clothing & Textiles": "text-violet-400 bg-violet-500/10 border-violet-500/25",
};

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSuppliers()
      .then((data) => setSuppliers(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#8B004A]" /></div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-[#1a1a1a]">Supplier Contacts</h2>
        <p className="text-[#9ca3af] text-sm mt-0.5">
          {suppliers.length} suppliers registered in your network
        </p>
      </motion.div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {suppliers.map((sup, i) => (
          <motion.div
            key={sup.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.07 }}
            whileHover={{ y: -4, scale: 1.01 }}
            className="group relative bg-[#F9F7F2] backdrop-blur-xl rounded-2xl border border-[rgba(139,0,74,0.1)] hover:border-[rgba(139,0,74,0.2)] transition-all duration-300 overflow-hidden"
          >
            {/* Accent bar */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 to-blue-500" />

            <div className="p-5 space-y-4">
              {/* Header */}
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500/20 to-blue-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
                  <Package2 className="w-5 h-5 text-[#8B004A]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-sm leading-tight">{sup.name}</h3>
                  <span className="text-[10px] text-[#b0a8b0] font-mono">{sup.id}</span>
                </div>
              </div>

              {/* Category */}
              <span
                className={`inline-block text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${
                  categoryColors[sup.category] ?? "text-[#8B004A] bg-blue-500/10 border-blue-500/25"
                }`}
              >
                {sup.category}
              </span>

              {/* Product types */}
              <div className="flex flex-wrap gap-1.5">
                {sup.productTypes.map((pt) => (
                  <span
                    key={pt}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-[rgba(139,0,74,0.1)] text-[#9ca3af]"
                  >
                    {pt}
                  </span>
                ))}
              </div>

              {/* Address */}
              <div className="flex items-start gap-2 text-[#9ca3af] text-xs">
                <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-[#8B004A]/50" />
                <span>{sup.address}</span>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <StarRating rating={sup.rating} />
                <span className="text-xs text-white font-semibold">{sup.rating}</span>
                <span className="text-xs text-[#b0a8b0]">({sup.reviews} reviews)</span>
              </div>

              {/* Reliability bar */}
              <ReliabilityBar score={sup.reliability} />

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                <motion.a
                  href={`tel:${sup.contact}`}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gradient-to-r from-[#8B004A] to-[#C4006A] hover:from-[#6B0039] hover:to-[#8B004A] text-white text-xs font-semibold transition-all shadow-md shadow-[#8B004A]/20"
                >
                  <Phone className="w-3.5 h-3.5" /> Call
                </motion.a>
                <motion.a
                  href={`mailto:${sup.email}`}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white hover:bg-[#F2EFE7] border border-[rgba(139,0,74,0.1)] hover:border-[rgba(139,0,74,0.2)] text-white/70 hover:text-white text-xs font-semibold transition-all"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> Message
                </motion.a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
