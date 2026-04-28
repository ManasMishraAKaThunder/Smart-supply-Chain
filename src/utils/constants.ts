/**
 * ══════════════════════════════════════════════
 *  VAMA — Shared Constants
 *  Brand colors, thresholds, and reusable config
 * ══════════════════════════════════════════════
 */

/* ===== BRAND COLORS ===== */
export const BRAND = {
  primary:     "#8B004A",
  primaryDark: "#6B0039",
  primaryLight:"#C4006A",
  bg:          "#F2EFE7",
  textDark:    "#1a1a1a",
  textMuted:   "#6b6b6b",
  gradientCSS: "linear-gradient(135deg, #8B004A, #C4006A)",
} as const;

/* ===== INVENTORY THRESHOLDS ===== */
export const LOW_STOCK_THRESHOLD = 30;

/* ===== CATEGORY OPTIONS (shared by Supplier & Receiver) ===== */
export type ReceiveCategory = "electronics" | "clothing" | "food" | "medical" | "others";
export type SupplyCategory = ReceiveCategory; // Same set

export const categoryOptions: { id: ReceiveCategory; label: string; icon: string }[] = [
  { id: "electronics", label: "Electronics", icon: "💻" },
  { id: "clothing",    label: "Clothing",    icon: "👕" },
  { id: "food",        label: "Food Items",  icon: "🍎" },
  { id: "medical",     label: "Medical",     icon: "💊" },
  { id: "others",      label: "Others",      icon: "📦" },
];

/* ===== CHART TOOLTIP STYLE ===== */
export const chartTooltipStyle = {
  contentStyle: {
    backgroundColor: "rgba(255, 255, 255, 0.98)",
    border: "1px solid rgba(139,0,74,0.15)",
    borderRadius: "0.75rem",
    color: "#1a1a1a",
    fontSize: "0.8rem",
    boxShadow: "0 8px 24px rgba(139,0,74,0.1)",
  },
};

/* ===== COMMON INPUT CLASS ===== */
export const inputCls = "bg-white border-[#E5E5E5] text-[#1a1a1a] placeholder:text-[#888888] focus:border-[#8B004A]/40";
