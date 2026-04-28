import { motion } from "motion/react";
import { useNavigate, useParams } from "react-router";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { loginUser } from "../../services/authService";

/* ═══ BRAND COLORS ═══ */
const C = {
  primary:     "#8B004A",
  primaryDark: "#6B0039",
  primaryLight:"#C4006A",
  bg:          "#F2EFE7",
  textDark:    "#1a1a1a",
  textMuted:   "#6b6b6b",
  gradientCSS: "linear-gradient(135deg, #8B004A, #C4006A)",
};

/* Role-based redirection mapping */
const roleRoutes: Record<string, string> = {
  warehouse: "/dashboard/warehouse",
  supplier: "/dashboard/supplier",
  receiver: "/dashboard/receiver",
  driver: "/dashboard/driver",
  "delivery-boy": "/dashboard/delivery-boy",
  customer: "/dashboard/customer",
};

export default function Login() {
  const { role } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;

    try {
      setLoading(true);
      setError(null);
      const response = await loginUser({ email, password, role });
      // loginUser already stores token + user data in sessionStorage
      const targetRoute = roleRoutes[response.user.role] || roleRoutes[role] || "/select-role";
      navigate(targetRoute);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  const getRoleTitle = () => {
    return role?.split("-").map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(" ");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Dot pattern */}
      <div className="absolute inset-0 dot-pattern" />

      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] rounded-full blur-[120px] pointer-events-none"
        style={{ background: `${C.primary}08` }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md z-10"
      >
        {/* Back button */}
        <button
          onClick={() => navigate("/")}
          className="absolute -top-12 left-0 flex items-center gap-1.5 text-sm font-medium transition-colors text-muted-foreground"
          onMouseEnter={(e) => (e.currentTarget.style.color = C.primary)}
          onMouseLeave={(e) => (e.currentTarget.style.color = C.textMuted)}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to roles
        </button>

        {/* Card */}
        <div className="bg-card rounded-2xl p-8 shadow-xl"
          style={{ border: `1px solid rgba(139,0,74,0.1)`, boxShadow: `0 8px 48px rgba(139,0,74,0.1)` }}>

          <div className="text-center mb-8">
            {/* VAMA Logo */}
            <div className="flex justify-center mb-5">
              <img
                src="/vama-logo.png"
                alt="VAMA Logo"
                className={`h-[38px] w-auto object-contain transition-all duration-300 ${isDark ? "invert brightness-200" : "mix-blend-multiply"}`}
              />
            </div>

            {/* Role badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4"
              style={{ background: `${C.primary}08`, border: `1px solid ${C.primary}20` }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: C.primary }} />
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: C.primary }}>
                {getRoleTitle()}
              </span>
            </div>

            <h2 className="text-3xl font-bold mb-2 text-foreground">
              Welcome back
            </h2>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to continue
            </p>
          </div>

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="rounded-xl border bg-card"
                style={{ borderColor: "rgba(139,0,74,0.15)" }}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-foreground">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="rounded-xl border bg-card pr-10"
                  style={{ borderColor: "rgba(139,0,74,0.15)" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors text-muted-foreground"
                  onMouseEnter={(e) => (e.currentTarget.style.color = C.primary)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = C.textMuted)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={loading ? {} : { scale: 1.02 }}
              whileTap={loading ? {} : { scale: 0.97 }}
              className="w-full py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-70 flex items-center justify-center gap-2"
              style={{ background: C.gradientCSS, boxShadow: `0 4px 24px ${C.primary}30` }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center space-y-3">
            <a href="#" className="text-sm transition-colors block text-muted-foreground"
              onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.color = C.primary)}
              onMouseLeave={(e) => ((e.target as HTMLAnchorElement).style.color = C.textMuted)}>
              Forgot password?
            </a>
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <button
                onClick={() => navigate(`/register/${role}`)}
                className="font-semibold transition-colors"
                style={{ color: C.primary }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.primaryDark)}
                onMouseLeave={(e) => (e.currentTarget.style.color = C.primary)}
              >
                Register
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
