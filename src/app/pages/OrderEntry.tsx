import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Search,
  Package,
  Warehouse,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";

/* ────────── helpers ────────── */
const WH_REGEX = /^WH-\d{3,6}$/;

function generateWarehouseCode(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `WH-${num}`;
}

/* ══════════════════════════════════════════
   ORDER ENTRY / WAREHOUSE ACCESS
   ══════════════════════════════════════════ */
export default function OrderEntry() {
  const navigate = useNavigate();
  const userRole = sessionStorage.getItem("userRole") || "";
  const userName = sessionStorage.getItem("userName") || "";
  const isWarehouse = userRole === "warehouse-holder";

  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  /* ── auto-fill for warehouse users who already registered ── */
  const [suggestedCode] = useState(() => {
    const stored = sessionStorage.getItem("warehouseCode");
    return stored || generateWarehouseCode();
  });

  useEffect(() => {
    // If the user came from warehouse signup, persist the code
    if (isWarehouse && !sessionStorage.getItem("warehouseCode")) {
      sessionStorage.setItem("warehouseCode", suggestedCode);
    }
  }, [isWarehouse, suggestedCode]);

  /* ── validation ── */
  const validate = (value: string): string => {
    if (!value.trim()) {
      return isWarehouse ? "Warehouse code is required" : "Order ID is required";
    }
    if (isWarehouse && !WH_REGEX.test(value)) {
      return "Invalid format. Use WH-XXXX (e.g. WH-1023)";
    }
    return "";
  };

  /* ── submit ── */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate(inputValue);
    if (err) {
      setError(err);
      return;
    }
    setError("");
    setLoading(true);

    // Simulate brief loading
    setTimeout(() => {
      if (isWarehouse) {
        sessionStorage.setItem("warehouseCode", inputValue);
      } else {
        sessionStorage.setItem("orderId", inputValue);
      }
      setLoading(false);
      setSuccess(true);

      setTimeout(() => {
        navigate(`/dashboard/${userRole}`);
      }, 1200);
    }, 800);
  };

  /* ── role title ── */
  const roleTitle = userRole
    ?.split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  /* ── config based on role ── */
  const config = isWarehouse
    ? {
        icon: Warehouse,
        gradient: "from-blue-500 to-cyan-500",
        glow: "shadow-blue-500/30",
        title: "Warehouse Access Code",
        subtitle: "Use your registered warehouse ID to access your dashboard",
        placeholder: "Enter your Warehouse ID (e.g. WH-1023)",
        buttonText: "Access Warehouse Dashboard",
        quickItems: [suggestedCode, "WH-2048", "WH-3076"],
        quickLabel: "Suggested Codes",
      }
    : {
        icon: Package,
        gradient: "from-violet-500 to-purple-500",
        glow: "shadow-violet-500/30",
        title: "Enter Order ID",
        subtitle: "Access your order details and tracking information",
        placeholder: "e.g., ORD-2026-12345",
        buttonText: "Access Dashboard",
        quickItems: ["ORD-2026-001", "ORD-2026-002", "ORD-2026-003"],
        quickLabel: "Quick Access (Demo)",
      };

  const Icon = config.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center p-4">
      {/* grid bg */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      {/* ambient glow */}
      <div
        className={`absolute w-[28rem] h-[28rem] bg-gradient-to-br ${config.gradient} opacity-[0.07] blur-3xl rounded-full pointer-events-none`}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-2xl z-10"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <div
            className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${config.gradient} p-4 shadow-lg ${config.glow}`}
          >
            <Icon className="w-full h-full text-white" />
          </div>
        </motion.div>

        {/* Card */}
        <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-8 md:p-12 border border-white/10 shadow-2xl overflow-hidden">
          {/* ── Success Overlay ── */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/85 backdrop-blur-sm rounded-2xl gap-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  <CheckCircle2 className="w-20 h-20 text-emerald-400" />
                </motion.div>
                <p className="text-white text-xl font-semibold">
                  {isWarehouse ? "Warehouse Verified!" : "Order Found!"}
                </p>
                <p className="text-blue-200/60 text-sm">Loading your dashboard…</p>
                <div className="flex gap-2 mt-1">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:300ms]" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Header */}
          <div className="text-center mb-8">
            {/* Role badge */}
            {roleTitle && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="flex justify-center mb-4"
              >
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent border border-white/10 rounded-full px-3 py-1`}
                >
                  <Icon className="w-3 h-3 text-blue-400" />
                  {roleTitle}
                </span>
              </motion.div>
            )}

            <h2 className="text-4xl font-bold text-white mb-3">{config.title}</h2>
            <p className="text-blue-200/60 text-lg">{config.subtitle}</p>

            {/* Auto-fill greeting for warehouse */}
            {isWarehouse && userName && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-4 inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300 text-sm">
                  Welcome back, <strong>{userName}</strong>
                </span>
              </motion.div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Label */}
            <div className="space-y-2">
              <Label htmlFor="access-input" className="text-white/80 text-sm flex items-center gap-1.5">
                {isWarehouse ? "Warehouse Code" : "Order ID"}
                {inputValue && !error && !validate(inputValue) && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                )}
              </Label>

              <div className="relative">
                <Input
                  id="access-input"
                  type="text"
                  placeholder={config.placeholder}
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    if (error) setError("");
                  }}
                  disabled={loading || success}
                  className={`h-14 pl-12 pr-4 text-lg transition-all duration-300 ${
                    error
                      ? "bg-white/5 border-rose-500/50 text-white placeholder:text-blue-200/30 focus:border-rose-400/60 focus:ring-rose-400/20"
                      : "bg-white/5 border-white/10 text-white placeholder:text-blue-200/30 focus:border-blue-400/50 focus:ring-blue-400/20"
                  }`}
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-200/30" />
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="flex items-center gap-1.5 text-rose-400 text-sm"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Helper text for warehouse */}
              {isWarehouse && !error && (
                <p className="text-blue-200/30 text-xs">
                  Format: WH-XXXX (e.g. WH-1023, WH-5512)
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading || success}
              className={`w-full bg-gradient-to-r ${config.gradient} hover:brightness-110 text-white h-14 text-lg shadow-lg ${config.glow} transition-all duration-300 font-semibold disabled:opacity-60`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Verifying…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {config.buttonText}
                  <ArrowRight className="w-5 h-5" />
                </span>
              )}
            </Button>
          </form>

          {/* Quick access suggestions */}
          <div className="mt-8 pt-8 border-t border-white/10">
            <p className="text-sm text-blue-200/40 text-center mb-4">{config.quickLabel}</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {config.quickItems.map((id) => (
                <button
                  key={id}
                  onClick={() => {
                    setInputValue(id);
                    setError("");
                  }}
                  disabled={loading || success}
                  className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-blue-200/70 hover:text-blue-200 transition-all text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {id}
                </button>
              ))}
            </div>

            {/* Auto-fill hint */}
            {isWarehouse && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center text-xs text-blue-200/25 mt-4"
              >
                💡 Click your suggested code above to auto-fill
              </motion.p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
