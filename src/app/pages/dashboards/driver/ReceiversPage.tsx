import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Phone, Star, FileText, MapPin, Clock, UserCheck, Repeat, Loader2 } from "lucide-react";
import { getReceivers } from "../../../../services/shipmentService";


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

const avatarColors = [
  "from-emerald-500 to-teal-400",
  "from-blue-500 to-cyan-400",
  "from-violet-500 to-purple-400",
  "from-amber-500 to-orange-400",
  "from-rose-500 to-pink-400",
];

export default function ReceiversPage() {
  const [receivers, setReceivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReceivers()
      .then((data) => setReceivers(Array.isArray(data) ? data : []))
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
        <h2 className="text-2xl font-bold text-[#1a1a1a]">Receiver Contacts</h2>
        <p className="text-[#9ca3af] text-sm mt-0.5">
          {receivers.length} receivers assigned to your route
        </p>
      </motion.div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {receivers.map((rcv, i) => (
          <motion.div
            key={rcv.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.07 }}
            whileHover={{ y: -4, scale: 1.01 }}
            className="group relative bg-[#F9F7F2] backdrop-blur-xl rounded-2xl border border-[rgba(139,0,74,0.1)] hover:border-[rgba(139,0,74,0.2)] transition-all duration-300 overflow-hidden"
          >
            {/* Top accent */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-400" />

            <div className="p-5 space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div
                    className={`w-11 h-11 rounded-xl bg-gradient-to-br ${avatarColors[i % avatarColors.length]} flex items-center justify-center flex-shrink-0 shadow-md`}
                  >
                    <span className="text-white font-bold text-sm">
                      {rcv.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm leading-tight">{rcv.name}</h3>
                    <span className="text-[10px] text-[#b0a8b0] font-mono">{rcv.id}</span>
                  </div>
                </div>
                {/* Badges */}
                <div className="flex flex-col gap-1 flex-shrink-0">
                  {rcv.isBulk && (
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[rgba(139,0,74,0.1)] text-[#8B004A] border border-blue-500/25 flex items-center gap-0.5">
                      <UserCheck className="w-2.5 h-2.5" /> BULK
                    </span>
                  )}
                  {rcv.isFrequent && (
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 flex items-center gap-0.5">
                      <Repeat className="w-2.5 h-2.5" /> FREQUENT
                    </span>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-2 text-[#9ca3af] text-xs">
                <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-emerald-400/60" />
                <span className="leading-snug">{rcv.address}</span>
              </div>

              {/* Preferred time */}
              <div className="flex items-center gap-2 text-xs">
                <Clock className="w-3.5 h-3.5 text-amber-400/70" />
                <span className="text-[#9ca3af]">Preferred: </span>
                <span className="text-amber-300 font-semibold">{rcv.preferredTime}</span>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <StarRating rating={rcv.rating} />
                <span className="text-xs text-white font-semibold">{rcv.rating}</span>
                <span className="text-xs text-[#b0a8b0]">({rcv.reviews})</span>
              </div>

              {/* Delivery notes */}
              <div className="p-3 rounded-xl bg-[#F9F7F2] border border-white/8">
                <p className="text-[10px] text-[#b0a8b0] uppercase tracking-wider mb-1">📋 Delivery Notes</p>
                <p className="text-xs text-[#6b6b6b] leading-relaxed">{rcv.notes}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                <motion.a
                  href={`tel:${rcv.contact}`}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-semibold transition-all shadow-md shadow-emerald-500/20"
                >
                  <Phone className="w-3.5 h-3.5" /> Call
                </motion.a>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white hover:bg-[#F2EFE7] border border-[rgba(139,0,74,0.1)] hover:border-[rgba(139,0,74,0.2)] text-white/70 hover:text-white text-xs font-semibold transition-all"
                >
                  <FileText className="w-3.5 h-3.5" /> Notes
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
