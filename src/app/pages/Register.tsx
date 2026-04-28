import { motion, AnimatePresence } from "motion/react";
import { useNavigate, useParams } from "react-router";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  ArrowLeft, Warehouse, Truck, PackageCheck,
  Navigation, Bike, User, Eye, EyeOff, CheckCircle2, Loader2,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { registerUser } from "../../services/authService";

/* ═══ BRAND COLORS ═══ */
const C = {
  primary:     "#8B004A",
  primaryDark: "#6B0039",
  bg:          "#F2EFE7",
  textDark:    "#1a1a1a",
  textMuted:   "#6b6b6b",
  gradientCSS: "linear-gradient(135deg, #8B004A, #C4006A)",
};

/* ─────────────── role icons ─────────────── */
const roleConfig: Record<string, { label: string; icon: React.ElementType; extraFields: { id: string; label: string; placeholder: string; type: string }[] }> = {
  warehouse: {
    label: "Warehouse Holder", icon: Warehouse,
    extraFields: [
      { id: "warehouseName",    label: "Warehouse Name",            placeholder: "e.g. Central Storage Hub", type: "text" },
      { id: "warehouseAddress", label: "Warehouse Address",         placeholder: "Full address",              type: "text" },
      { id: "capacity",         label: "Storage Capacity (sq ft)",  placeholder: "e.g. 5000",                type: "number" },
    ],
  },
  supplier: {
    label: "Supplier", icon: Truck,
    extraFields: [
      { id: "companyName",    label: "Company Name",   placeholder: "Your company name",  type: "text" },
      { id: "gstNumber",      label: "GST / Tax ID",   placeholder: "e.g. 22AAAAA0000A1Z5", type: "text" },
      { id: "contactNumber",  label: "Contact Number", placeholder: "+91 XXXXX XXXXX",    type: "tel" },
    ],
  },
  receiver: {
    label: "Receiver", icon: PackageCheck,
    extraFields: [
      { id: "organizationName", label: "Organization Name",   placeholder: "Receiving organization", type: "text" },
      { id: "receivingAddress", label: "Receiving Address",   placeholder: "Default delivery address", type: "text" },
      { id: "contactNumber",    label: "Contact Number",      placeholder: "+91 XXXXX XXXXX",        type: "tel" },
    ],
  },
  driver: {
    label: "Driver", icon: Navigation,
    extraFields: [
      { id: "licenseNumber",  label: "Driving License No.", placeholder: "e.g. MH0120210012345", type: "text" },
      { id: "vehicleNumber",  label: "Vehicle Number",      placeholder: "e.g. MH 12 AB 1234",   type: "text" },
      { id: "contactNumber",  label: "Contact Number",      placeholder: "+91 XXXXX XXXXX",       type: "tel" },
    ],
  },
  "delivery-boy": {
    label: "Delivery Boy", icon: Bike,
    extraFields: [
      { id: "vehicleType",    label: "Vehicle Type",        placeholder: "e.g. Bicycle, Scooter", type: "text" },
      { id: "serviceArea",    label: "Service Area / Zone", placeholder: "e.g. Zone A – Bandra",  type: "text" },
      { id: "contactNumber",  label: "Contact Number",      placeholder: "+91 XXXXX XXXXX",        type: "tel" },
    ],
  },
  customer: {
    label: "Customer", icon: User,
    extraFields: [
      { id: "phone",           label: "Phone Number",             placeholder: "+91 XXXXX XXXXX", type: "tel" },
      { id: "deliveryAddress", label: "Default Delivery Address", placeholder: "Your address",     type: "text" },
    ],
  },
};

/* ─────────────── helpers ─────────────── */
function inputCls(hasError: boolean) {
  return `rounded-xl border bg-card text-foreground placeholder:text-[#9ca3af] ${
    hasError
      ? "border-red-400 focus:border-red-500"
      : "border-[rgba(139,0,74,0.15)] focus:border-primary/40"
  }`;
}

function FieldGroup({ label, htmlFor, error, children }: { label: string; htmlFor: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor} className="text-sm font-medium text-foreground">{label}</Label>
      {children}
      {error && (
        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-xs">{error}</motion.p>
      )}
    </div>
  );
}

/* ─────────────── main component ─────────────── */
export default function Register() {
  const { role } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const config = role && roleConfig[role] ? roleConfig[role] : null;

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [extraValues, setExtraValues] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = "Full name is required";
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = "Enter a valid email";
    if (password.length < 8) errs.password = "Password must be at least 8 characters";
    if (password !== confirmPassword) errs.confirmPassword = "Passwords do not match";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});

    try {
      setLoading(true);
      setApiError(null);
      await registerUser({ fullName, email, password, role: role || "", extraFields: extraValues });
      setSubmitted(true);
      setTimeout(() => navigate(`/login/${role}`), 2200);
    } catch (err: any) {
      setApiError(
        err.response?.data?.message ||
        err.message ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const setExtra = (id: string, value: string) => setExtraValues((prev) => ({ ...prev, [id]: value }));

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-xl text-foreground">
          Unknown role.{" "}
          <button className="underline font-semibold" style={{ color: C.primary }} onClick={() => navigate("/")}>Go back</button>
        </p>
      </div>
    );
  }

  const Icon = config.icon;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Dot pattern */}
      <div className="absolute inset-0 dot-pattern" />
      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] rounded-full blur-[130px] pointer-events-none"
        style={{ background: `${C.primary}08` }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-lg z-10"
      >
        {/* Back button */}
        <button
          onClick={() => navigate(`/login/${role}`)}
          className="absolute -top-12 left-0 flex items-center gap-1.5 text-sm font-medium transition-colors text-muted-foreground"
          onMouseEnter={(e) => (e.currentTarget.style.color = C.primary)}
          onMouseLeave={(e) => (e.currentTarget.style.color = C.textMuted)}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </button>

        {/* Card */}
        <div className="relative bg-card rounded-2xl p-8 overflow-hidden"
          style={{ border: `1px solid rgba(139,0,74,0.1)`, boxShadow: "0 8px 48px rgba(139,0,74,0.1)" }}>

          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex justify-center mb-4">
              <img src="/vama-logo.png" alt="VAMA Logo" className={`h-[34px] w-auto object-contain transition-all duration-300 ${isDark ? "invert brightness-200" : "mix-blend-multiply"}`} />
            </div>
            <div className="w-14 h-14 rounded-2xl p-3 mb-3 shadow-lg flex items-center justify-center"
              style={{ background: C.gradientCSS, boxShadow: `0 8px 24px ${C.primary}30` }}>
              <Icon className="w-full h-full text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-1 text-foreground">Create Account</h2>
            <p className="text-sm text-muted-foreground">
              Registering as{" "}
              <span className="font-semibold" style={{ color: C.primary }}>{config.label}</span>
            </p>
          </div>

          {/* Success overlay */}
          <AnimatePresence>
            {submitted && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl z-20 gap-4 bg-card/95 backdrop-blur-sm"
              >
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 20 }}>
                  <CheckCircle2 className="w-20 h-20 text-emerald-500" />
                </motion.div>
                <p className="text-xl font-semibold text-foreground">Account Created!</p>
                <p className="text-sm text-muted-foreground">Redirecting to login…</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* API Error message */}
          {apiError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center"
            >
              {apiError}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Full Name */}
            <FieldGroup label="Full Name" htmlFor="fullName" error={errors.fullName}>
              <Input id="fullName" type="text" placeholder="John Doe" value={fullName}
                onChange={(e) => setFullName(e.target.value)} disabled={loading} className={inputCls(!!errors.fullName)} />
            </FieldGroup>

            {/* Email */}
            <FieldGroup label="Email Address" htmlFor="reg-email" error={errors.email}>
              <Input id="reg-email" type="email" placeholder="you@example.com" value={email}
                onChange={(e) => setEmail(e.target.value)} disabled={loading} className={inputCls(!!errors.email)} />
            </FieldGroup>

            {/* Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FieldGroup label="Password" htmlFor="reg-password" error={errors.password}>
                <div className="relative">
                  <Input id="reg-password" type={showPassword ? "text" : "password"} placeholder="Min 8 characters"
                    value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} className={`${inputCls(!!errors.password)} pr-10`} />
                  <button type="button" onClick={() => setShowPassword((v) => !v)} tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors text-muted-foreground"
                    onMouseEnter={(e) => (e.currentTarget.style.color = C.primary)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = C.textMuted)}>
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </FieldGroup>

              <FieldGroup label="Confirm Password" htmlFor="reg-confirm" error={errors.confirmPassword}>
                <div className="relative">
                  <Input id="reg-confirm" type={showConfirm ? "text" : "password"} placeholder="Repeat password"
                    value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={loading} className={`${inputCls(!!errors.confirmPassword)} pr-10`} />
                  <button type="button" onClick={() => setShowConfirm((v) => !v)} tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors text-muted-foreground"
                    onMouseEnter={(e) => (e.currentTarget.style.color = C.primary)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = C.textMuted)}>
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </FieldGroup>
            </div>

            {/* Role-specific fields */}
            {config.extraFields.length > 0 && (
              <>
                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t" style={{ borderColor: "rgba(139,0,74,0.1)" }} />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="px-2 font-semibold tracking-wider bg-card">
                      {config.label} Details
                    </span>
                  </div>
                </div>

                {config.extraFields.map((field) => (
                  <FieldGroup key={field.id} label={field.label} htmlFor={field.id}>
                    <Input id={field.id} type={field.type} placeholder={field.placeholder}
                      value={extraValues[field.id] ?? ""}
                      onChange={(e) => setExtra(field.id, e.target.value)}
                      disabled={loading}
                      className={inputCls(false)} />
                  </FieldGroup>
                ))}
              </>
            )}

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={loading ? {} : { scale: 1.02 }}
              whileTap={loading ? {} : { scale: 0.97 }}
              className="w-full mt-2 py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-70 flex items-center justify-center gap-2"
              style={{ background: C.gradientCSS, boxShadow: `0 4px 24px ${C.primary}30` }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <button onClick={() => navigate(`/login/${role}`)} className="font-semibold transition-colors" style={{ color: C.primary }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.primaryDark)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.primary)}>
              Sign in
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
