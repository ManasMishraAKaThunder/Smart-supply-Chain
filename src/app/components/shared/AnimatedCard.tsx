import { motion } from "motion/react";

/**
 * AnimatedCard — Shared animated card used across all dashboards.
 * Provides consistent styling, entrance animation, and border treatment.
 *
 * Previously duplicated in: SupplierDashboard, ReceiverDashboard,
 * WarehouseHolderDashboard (as local `Card` function).
 */
interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function AnimatedCard({ children, className = "", delay = 0 }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
      className={`bg-white rounded-2xl p-6 border border-[rgba(139,0,74,0.08)] ${className}`}
      style={{ boxShadow: "0 2px 16px rgba(139,0,74,0.06)" }}
    >
      {children}
    </motion.div>
  );
}
