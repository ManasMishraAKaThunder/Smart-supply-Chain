import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  ArrowLeft,
  Warehouse,
  User,
  FileText,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  CheckCircle2,
  Building2,
} from "lucide-react";

/* ────────── field config ────────── */
const fields = [
  { id: "warehouseName", label: "Warehouse Name", placeholder: "e.g. Central Storage Hub", icon: Building2, type: "text" },
  { id: "ownerName", label: "Owner Name", placeholder: "Full name", icon: User, type: "text" },
  { id: "gstNumber", label: "GST Number", placeholder: "e.g. 22AAAAA0000A1Z5", icon: FileText, type: "text" },
  { id: "phone", label: "Phone Number", placeholder: "+91 XXXXX XXXXX", icon: Phone, type: "tel" },
  { id: "email", label: "Email Address", placeholder: "you@example.com", icon: Mail, type: "email" },
  { id: "address", label: "Location / Address", placeholder: "Full warehouse address", icon: MapPin, type: "text" },
] as const;

/* ────────── helper ────────── */
const inputCls =
  "bg-white/5 border-white/10 text-white placeholder:text-blue-200/30 focus:border-blue-400/50 focus:ring-blue-400/20 pl-10";

const errorInputCls =
  "bg-white/5 border-rose-500/50 text-white placeholder:text-blue-200/30 focus:border-rose-400/60 focus:ring-rose-400/20 pl-10";

export default function WarehouseSignup() {
  const navigate = useNavigate();

  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());

  /* ── validation ── */
  const validate = () => {
    const errs: Record<string, string> = {};
    if (!values.warehouseName?.trim()) errs.warehouseName = "Required";
    if (!values.ownerName?.trim()) errs.ownerName = "Required";
    if (!values.gstNumber?.trim()) errs.gstNumber = "Required";
    if (!values.phone?.trim()) errs.phone = "Required";
    if (!values.email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = "Enter a valid email";
    if (!values.address?.trim()) errs.address = "Required";
    return errs;
  };

  const handleChange = (id: string, v: string) => {
    setValues((p) => ({ ...p, [id]: v }));
    if (touched.has(id)) {
      // clear error on re-type
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }
  };

  const handleBlur = (id: string) => {
    setTouched((p) => new Set(p).add(id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setTouched(new Set(fields.map((f) => f.id)));
      return;
    }
    // store data for next step
    sessionStorage.setItem("warehouseData", JSON.stringify(values));
    navigate("/warehouse/inventory-setup");
  };

  /* ── progress indicator ── */
  const filledCount = fields.filter((f) => (values[f.id] ?? "").trim().length > 0).length;
  const progress = Math.round((filledCount / fields.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center p-4">
      {/* grid bg */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      {/* ambient glow */}
      <div className="absolute w-[28rem] h-[28rem] bg-gradient-to-br from-blue-500 to-cyan-500 opacity-[0.07] blur-3xl rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55 }}
        className="relative w-full max-w-xl z-10"
      >
        {/* back */}
        <button
          onClick={() => navigate("/")}
          className="absolute -top-12 left-0 flex items-center gap-1.5 text-blue-200/70 hover:text-blue-200 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to roles
        </button>

        {/* step chips */}
        <div className="flex items-center gap-3 mb-6">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1">
            <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold">1</span>
            Warehouse Details
          </span>
          <span className="h-px flex-1 bg-white/10" />
          <span className="flex items-center gap-1.5 text-xs font-medium text-blue-200/30 rounded-full px-3 py-1">
            <span className="w-5 h-5 rounded-full bg-white/10 text-white/30 flex items-center justify-center text-[10px] font-bold">2</span>
            Inventory Setup
          </span>
        </div>

        {/* card */}
        <div className="bg-white/[0.04] backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
          {/* progress bar across top */}
          <div className="h-1 bg-white/5">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-r-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>

          <div className="p-8">
            {/* header */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 p-3.5 mb-4 shadow-lg shadow-blue-500/25">
                <Warehouse className="w-full h-full text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-1">Register Your Warehouse</h1>
              <p className="text-blue-200/50 text-sm">Enter your warehouse and business details to get started</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* 2-col grid for first 4, then full-width */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {fields.slice(0, 4).map((f, i) => {
                  const Icon = f.icon;
                  const hasErr = !!errors[f.id];
                  return (
                    <motion.div
                      key={f.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: 0.1 + i * 0.06 }}
                      className="space-y-1.5"
                    >
                      <Label htmlFor={f.id} className="text-white/80 text-sm flex items-center gap-1">
                        {f.label}
                        {(values[f.id] ?? "").trim() && !hasErr && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                      </Label>
                      <div className="relative">
                        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-200/30" />
                        <Input
                          id={f.id}
                          type={f.type}
                          placeholder={f.placeholder}
                          value={values[f.id] ?? ""}
                          onChange={(e) => handleChange(f.id, e.target.value)}
                          onBlur={() => handleBlur(f.id)}
                          className={hasErr ? errorInputCls : inputCls}
                        />
                      </div>
                      {hasErr && (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-rose-400 text-xs">
                          {errors[f.id]}
                        </motion.p>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* email + address full width */}
              {fields.slice(4).map((f, i) => {
                const Icon = f.icon;
                const hasErr = !!errors[f.id];
                return (
                  <motion.div
                    key={f.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.4 + i * 0.06 }}
                    className="space-y-1.5"
                  >
                    <Label htmlFor={f.id} className="text-white/80 text-sm flex items-center gap-1">
                      {f.label}
                      {(values[f.id] ?? "").trim() && !hasErr && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                    </Label>
                    <div className="relative">
                      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-200/30" />
                      <Input
                        id={f.id}
                        type={f.type}
                        placeholder={f.placeholder}
                        value={values[f.id] ?? ""}
                        onChange={(e) => handleChange(f.id, e.target.value)}
                        onBlur={() => handleBlur(f.id)}
                        className={hasErr ? errorInputCls : inputCls}
                      />
                    </div>
                    {hasErr && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-rose-400 text-xs">
                        {errors[f.id]}
                      </motion.p>
                    )}
                  </motion.div>
                );
              })}

              {/* submit */}
              <Button
                type="submit"
                className="w-full mt-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/20 transition-all duration-300 font-semibold h-11"
              >
                Next – Setup Inventory
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </form>

            {/* already registered */}
            <p className="mt-5 text-center text-sm text-blue-200/40">
              Already registered?{" "}
              <button
                onClick={() => navigate("/login/warehouse-holder")}
                className="text-blue-300 hover:text-blue-200 font-medium transition-colors"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
