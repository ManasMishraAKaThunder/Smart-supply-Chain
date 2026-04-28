import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";

// ===== BRAND GRADIENT =====
const MURREY_GRAD = "linear-gradient(135deg, #8B004A, #C4006A)";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  gradient: string;
  delay?: number;
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  trendUp,
  gradient,
  delay = 0,
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="group relative"
    >
      <div className="relative bg-white rounded-2xl p-6 border transition-all duration-300 overflow-hidden"
        style={{ borderColor: "rgba(139,0,74,0.1)", boxShadow: "0 2px 16px rgba(139,0,74,0.06)" }}>
        {/* Subtle gradient glow on hover */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ boxShadow: "0 8px 32px rgba(139,0,74,0.1)" }} />

        {/* Icon */}
        <div className="relative w-12 h-12 rounded-xl p-2.5 mb-4 group-hover:scale-110 transition-transform duration-300"
          style={{ background: MURREY_GRAD }}>
          <Icon className="w-full h-full text-white" />
        </div>

        {/* Content */}
        <div className="relative">
          <p className="text-sm mb-1 font-medium" style={{ color: "#6b6b6b" }}>{title}</p>
          <p className="text-3xl font-bold mb-2" style={{ color: "#1a1a1a" }}>{value}</p>

          {trend && (
            <div className={`flex items-center gap-1 text-sm font-medium ${
              trendUp ? "text-emerald-600" : "text-red-500"
            }`}>
              <span>{trendUp ? "↑" : "↓"}</span>
              <span>{trend}</span>
            </div>
          )}
        </div>
      </div>

      {/* Murrey glow border on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 pointer-events-none"
        style={{ boxShadow: `0 0 0 2px rgba(139,0,74,0.15), 0 12px 40px rgba(139,0,74,0.12)` }} />
    </motion.div>
  );
}
