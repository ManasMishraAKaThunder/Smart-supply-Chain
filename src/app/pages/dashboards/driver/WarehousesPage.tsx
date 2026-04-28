import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Phone, MapPin, Star, Mail, ExternalLink, Wifi, WifiOff, Building2, Loader2 } from "lucide-react";
import { getWarehouses } from "../../../../services/shipmentService";


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

const typeColors: Record<string, string> = {
  "Cold Storage": "text-cyan-400 bg-cyan-500/10 border-cyan-500/25",
  General: "text-[#8B004A] bg-blue-500/10 border-blue-500/25",
  "Bulk Storage": "text-violet-400 bg-violet-500/10 border-violet-500/25",
  Hazardous: "text-rose-400 bg-rose-500/10 border-rose-500/25",
  Express: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25",
};

export default function WarehousesPage() {
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWarehouses()
      .then((data) => setWarehouses(Array.isArray(data) ? data : []))
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
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div>
          <h2 className="text-2xl font-bold text-[#1a1a1a]">Warehouse Contacts</h2>
          <p className="text-[#9ca3af] text-sm mt-0.5">
            {warehouses.filter((w) => w.available).length} of {warehouses.length} warehouses currently available
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
            <Wifi className="w-3.5 h-3.5" /> Available
          </div>
          <div className="flex items-center gap-1.5 text-red-400 text-xs font-medium bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-full">
            <WifiOff className="w-3.5 h-3.5" /> Unavailable
          </div>
        </div>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {warehouses.map((wh, i) => (
          <motion.div
            key={wh.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            whileHover={{ y: -4, scale: 1.01 }}
            className="group relative bg-[#F9F7F2] backdrop-blur-xl rounded-2xl border border-[rgba(139,0,74,0.1)] hover:border-[rgba(139,0,74,0.2)] transition-all duration-300 overflow-hidden"
          >
            {/* Top accent */}
            <div
              className={`absolute top-0 left-0 right-0 h-0.5 ${
                wh.available
                  ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                  : "bg-gradient-to-r from-red-500 to-rose-400"
              }`}
            />

            <div className="p-5 space-y-4">
              {/* Header row */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-5 h-5 text-[#8B004A]" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm leading-tight">{wh.name}</h3>
                    <span className="text-[10px] text-[#b0a8b0] font-mono">{wh.id}</span>
                  </div>
                </div>
                <span
                  className={`flex-shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                    wh.available
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
                      : "bg-red-500/10 text-red-400 border-red-500/25"
                  }`}
                >
                  {wh.available ? "Available" : "Unavailable"}
                </span>
              </div>

              {/* Type badge */}
              <span className={`inline-block text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${typeColors[wh.type] ?? typeColors.General}`}>
                {wh.type}
              </span>

              {/* Details */}
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2 text-[#6b6b6b]">
                  <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-[#8B004A]/60" />
                  <span className="leading-snug">{wh.address}</span>
                </div>
                <div className="flex items-center gap-2 text-[#6b6b6b]">
                  <Mail className="w-3.5 h-3.5 flex-shrink-0 text-[#8B004A]/60" />
                  <span>{wh.email}</span>
                </div>
              </div>

              {/* Rating + Distance */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StarRating rating={wh.rating} />
                  <span className="text-xs text-white font-semibold">{wh.rating}</span>
                  <span className="text-xs text-[#b0a8b0]">({wh.reviews})</span>
                </div>
                <span className="text-xs text-[#8B004A] font-semibold bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded-full">
                  📍 {wh.distance}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                <motion.a
                  href={`tel:${wh.contact}`}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gradient-to-r from-[#8B004A] to-[#C4006A] hover:from-[#6B0039] hover:to-[#8B004A] text-white text-xs font-semibold transition-all shadow-md shadow-[#8B004A]/20"
                >
                  <Phone className="w-3.5 h-3.5" /> Call
                </motion.a>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white hover:bg-[#F2EFE7] border border-[rgba(139,0,74,0.1)] hover:border-[rgba(139,0,74,0.2)] text-white/70 hover:text-white text-xs font-semibold transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Details
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
