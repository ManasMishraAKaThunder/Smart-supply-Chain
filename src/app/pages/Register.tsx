import { motion, AnimatePresence } from "motion/react";
import { useNavigate, useParams } from "react-router";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  ArrowLeft,
  Warehouse,
  Truck,
  PackageCheck,
  Navigation,
  Bike,
  User,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";

/* ─────────────── role metadata ─────────────── */
const roleConfig: Record<
  string,
  {
    label: string;
    icon: React.ElementType;
    gradient: string;
    glow: string;
    extraFields: { id: string; label: string; placeholder: string; type: string }[];
  }
> = {
  "warehouse-holder": {
    label: "Warehouse Holder",
    icon: Warehouse,
    gradient: "from-blue-500 to-cyan-500",
    glow: "shadow-blue-500/30",
    extraFields: [
      { id: "warehouseName", label: "Warehouse Name", placeholder: "e.g. Central Storage Hub", type: "text" },
      { id: "warehouseAddress", label: "Warehouse Address", placeholder: "Full address", type: "text" },
      { id: "capacity", label: "Storage Capacity (sq ft)", placeholder: "e.g. 5000", type: "number" },
    ],
  },
  supplier: {
    label: "Supplier",
    icon: Truck,
    gradient: "from-violet-500 to-purple-500",
    glow: "shadow-violet-500/30",
    extraFields: [
      { id: "companyName", label: "Company Name", placeholder: "Your company name", type: "text" },
      { id: "gstNumber", label: "GST / Tax ID", placeholder: "e.g. 22AAAAA0000A1Z5", type: "text" },
      { id: "contactNumber", label: "Contact Number", placeholder: "+91 XXXXX XXXXX", type: "tel" },
    ],
  },
  receiver: {
    label: "Receiver",
    icon: PackageCheck,
    gradient: "from-emerald-500 to-teal-500",
    glow: "shadow-emerald-500/30",
    extraFields: [
      { id: "organizationName", label: "Organization Name", placeholder: "Receiving organization", type: "text" },
      { id: "receivingAddress", label: "Receiving Address", placeholder: "Default delivery address", type: "text" },
      { id: "contactNumber", label: "Contact Number", placeholder: "+91 XXXXX XXXXX", type: "tel" },
    ],
  },
  driver: {
    label: "Driver",
    icon: Navigation,
    gradient: "from-amber-500 to-orange-500",
    glow: "shadow-amber-500/30",
    extraFields: [
      { id: "licenseNumber", label: "Driving License No.", placeholder: "e.g. MH0120210012345", type: "text" },
      { id: "vehicleNumber", label: "Vehicle Number", placeholder: "e.g. MH 12 AB 1234", type: "text" },
      { id: "contactNumber", label: "Contact Number", placeholder: "+91 XXXXX XXXXX", type: "tel" },
    ],
  },
  "delivery-boy": {
    label: "Delivery Boy",
    icon: Bike,
    gradient: "from-pink-500 to-rose-500",
    glow: "shadow-pink-500/30",
    extraFields: [
      { id: "vehicleType", label: "Vehicle Type", placeholder: "e.g. Bicycle, Scooter", type: "text" },
      { id: "serviceArea", label: "Service Area / Zone", placeholder: "e.g. Zone A – Bandra", type: "text" },
      { id: "contactNumber", label: "Contact Number", placeholder: "+91 XXXXX XXXXX", type: "tel" },
    ],
  },
  customer: {
    label: "Customer",
    icon: User,
    gradient: "from-indigo-500 to-blue-500",
    glow: "shadow-indigo-500/30",
    extraFields: [
      { id: "phone", label: "Phone Number", placeholder: "+91 XXXXX XXXXX", type: "tel" },
      { id: "deliveryAddress", label: "Default Delivery Address", placeholder: "Your address", type: "text" },
    ],
  },
};

/* ─────────────── small helpers ─────────────── */
function inputCls(hasError: boolean) {
  return `bg-white/5 border-white/10 text-white placeholder:text-blue-200/40 focus:border-blue-400/50 focus:ring-blue-400/20 ${
    hasError ? "border-rose-500/60 focus:border-rose-500/80" : ""
  }`;
}

function FieldGroup({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor} className="text-white/80 text-sm">
        {label}
      </Label>
      {children}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-rose-400 text-xs"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}

/* ─────────────── main component ─────────────── */
export default function Register() {
  const { role } = useParams<{ role: string }>();
  const navigate = useNavigate();

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

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = "Full name is required";
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = "Enter a valid email";
    if (password.length < 8) errs.password = "Password must be at least 8 characters";
    if (password !== confirmPassword) errs.confirmPassword = "Passwords do not match";
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    sessionStorage.setItem("userRole", role || "");
    sessionStorage.setItem("userName", fullName);
    setSubmitted(true);
    setTimeout(() => navigate(`/login/${role}`), 2200);
  };

  const setExtra = (id: string, value: string) =>
    setExtraValues((prev) => ({ ...prev, [id]: value }));

  if (!config) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center text-white">
        <p className="text-xl">
          Unknown role.{" "}
          <button className="underline text-blue-400" onClick={() => navigate("/")}>
            Go back
          </button>
        </p>
      </div>
    );
  }

  const Icon = config.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center p-4">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      {/* Ambient glow */}
      <div
        className={`absolute w-96 h-96 bg-gradient-to-br ${config.gradient} opacity-10 blur-3xl rounded-full pointer-events-none`}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-lg z-10"
      >
        {/* Back button */}
        <button
          onClick={() => navigate(`/login/${role}`)}
          className="absolute -top-12 left-0 flex items-center text-blue-200/80 hover:text-blue-200 transition-colors gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </button>

        {/* Card */}
        <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div
              className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${config.gradient} p-3.5 mb-4 shadow-lg ${config.glow}`}
            >
              <Icon className="w-full h-full text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-1">Create Account</h2>
            <p className="text-blue-200/60 text-sm">
              Registering as{" "}
              <span
                className={`font-semibold bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}
              >
                {config.label}
              </span>
            </p>
          </div>

          {/* Success overlay */}
          <AnimatePresence>
            {submitted && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-slate-950/85 backdrop-blur-sm z-20 gap-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  <CheckCircle2 className="w-20 h-20 text-emerald-400" />
                </motion.div>
                <p className="text-white text-xl font-semibold">Account Created!</p>
                <p className="text-blue-200/60 text-sm">Redirecting to login…</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Full Name */}
            <FieldGroup label="Full Name" htmlFor="fullName" error={errors.fullName}>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={inputCls(!!errors.fullName)}
              />
            </FieldGroup>

            {/* Email */}
            <FieldGroup label="Email Address" htmlFor="reg-email" error={errors.email}>
              <Input
                id="reg-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputCls(!!errors.email)}
              />
            </FieldGroup>

            {/* Password row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FieldGroup label="Password" htmlFor="reg-password" error={errors.password}>
                <div className="relative">
                  <Input
                    id="reg-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${inputCls(!!errors.password)} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-200/40 hover:text-blue-200/80 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </FieldGroup>

              <FieldGroup label="Confirm Password" htmlFor="reg-confirm" error={errors.confirmPassword}>
                <div className="relative">
                  <Input
                    id="reg-confirm"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`${inputCls(!!errors.confirmPassword)} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-200/40 hover:text-blue-200/80 transition-colors"
                    tabIndex={-1}
                  >
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
                    <div className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-slate-950 px-2 text-blue-200/40 tracking-wider">
                      {config.label} Details
                    </span>
                  </div>
                </div>

                {config.extraFields.map((field) => (
                  <FieldGroup key={field.id} label={field.label} htmlFor={field.id}>
                    <Input
                      id={field.id}
                      type={field.type}
                      placeholder={field.placeholder}
                      value={extraValues[field.id] ?? ""}
                      onChange={(e) => setExtra(field.id, e.target.value)}
                      className={inputCls(false)}
                    />
                  </FieldGroup>
                ))}
              </>
            )}

            {/* Submit */}
            <Button
              type="submit"
              className={`w-full mt-2 bg-gradient-to-r ${config.gradient} hover:brightness-110 text-white shadow-lg ${config.glow} transition-all duration-300 font-semibold`}
            >
              Create Account
            </Button>
          </form>

          {/* Link to login */}
          <p className="mt-6 text-center text-sm text-blue-200/50">
            Already have an account?{" "}
            <button
              onClick={() => navigate(`/login/${role}`)}
              className="text-blue-300 hover:text-blue-200 font-medium transition-colors"
            >
              Sign in
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
