import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";

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
      {/* Glassmorphism card */}
      <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden">
        {/* Gradient glow */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
        
        {/* Icon */}
        <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} p-2.5 mb-4 group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-full h-full text-white" />
        </div>

        {/* Content */}
        <div className="relative">
          <p className="text-blue-200/70 text-sm mb-1">{title}</p>
          <p className="text-3xl font-bold text-white mb-2">{value}</p>
          
          {trend && (
            <div className={`flex items-center gap-1 text-sm ${
              trendUp ? "text-emerald-400" : "text-red-400"
            }`}>
              <span>{trendUp ? "↑" : "↓"}</span>
              <span>{trend}</span>
            </div>
          )}
        </div>
      </div>

      {/* Gradient border effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-20 rounded-2xl blur-xl transition-opacity duration-300 -z-10`} />
    </motion.div>
  );
}
