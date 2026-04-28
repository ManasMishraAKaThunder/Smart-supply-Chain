import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  User, Lock, Truck, CreditCard, UploadCloud, Bell,
  Wifi, WifiOff, LogOut, Save, Eye, EyeOff, CheckCircle2,
  ChevronDown, AlertCircle, Activity, Phone, Mail,
  ShieldCheck, Fuel, Gauge, FileText,
} from "lucide-react";

/* ────────────────────────
   TYPES & HELPERS
   ──────────────────────── */
type SaveState = "idle" | "saving" | "saved" | "error";

function useSaveState() {
  const [state, setState] = useState<SaveState>("idle");
  const trigger = (isValid = true) => {
    if (!isValid) { setState("error"); setTimeout(() => setState("idle"), 2500); return; }
    setState("saving");
    setTimeout(() => { setState("saved"); setTimeout(() => setState("idle"), 2000); }, 900);
  };
  return { state, trigger };
}

function SaveButton({ state, onClick }: { state: SaveState; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
        state === "saved"
          ? "bg-emerald-500 text-[#1a1a1a]"
          : state === "error"
          ? "bg-red-500/80 text-[#1a1a1a]"
          : "bg-gradient-to-r from-[#8B004A] to-[#C4006A] hover:from-[#6B0039] hover:to-[#8B004A] text-white shadow-md shadow-[#8B004A]/20"
      }`}
    >
      {state === "saving" && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
      {state === "saved" && <CheckCircle2 className="w-4 h-4" />}
      {state === "error" && <AlertCircle className="w-4 h-4" />}
      {state === "idle" && <Save className="w-4 h-4" />}
      {state === "saving" ? "Saving…" : state === "saved" ? "Saved!" : state === "error" ? "Fix errors" : "Save Changes"}
    </motion.button>
  );
}

function SectionCard({
  title, icon: Icon, iconGradient, children, delay = 0,
}: {
  title: string; icon: React.ElementType; iconGradient: string;
  children: React.ReactNode; delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-[#F9F7F2] backdrop-blur-xl rounded-2xl border border-[rgba(139,0,74,0.1)] overflow-hidden"
    >
      <div className="flex items-center gap-3 px-6 pt-5 pb-4 border-b border-white/8">
        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${iconGradient} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-[#1a1a1a]" />
        </div>
        <h3 className="text-base font-semibold text-[#1a1a1a]">{title}</h3>
      </div>
      <div className="px-6 py-5 space-y-4">{children}</div>
    </motion.div>
  );
}

function Field({
  label, icon: Icon, type = "text", value, onChange, placeholder = "", required = false, error = "",
}: {
  label: string; icon?: React.ElementType; type?: string; value: string;
  onChange: (v: string) => void; placeholder?: string; required?: boolean; error?: string;
}) {
  return (
    <div>
      <label className="block text-xs text-[#9ca3af] mb-1.5 font-medium uppercase tracking-wider">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B004A]/50 pointer-events-none" />}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full ${Icon ? "pl-10" : "pl-4"} pr-4 py-2.5 rounded-xl bg-white border text-white text-sm placeholder-blue-200/25 outline-none transition-all focus:bg-white/8 focus:border-blue-500/60 ${
            error ? "border-red-500/50 focus:border-red-500" : "border-[rgba(139,0,74,0.1)]"
          }`}
        />
      </div>
      {error && (
        <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />{error}
        </p>
      )}
    </div>
  );
}

function SelectField({
  label, value, onChange, options, icon: Icon,
}: {
  label: string; value: string; onChange: (v: string) => void;
  options: string[]; icon?: React.ElementType;
}) {
  return (
    <div>
      <label className="block text-xs text-[#9ca3af] mb-1.5 font-medium uppercase tracking-wider">{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B004A]/50 pointer-events-none z-10" />}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full ${Icon ? "pl-10" : "pl-4"} pr-8 py-2.5 rounded-xl bg-white border border-[rgba(139,0,74,0.1)] text-white text-sm outline-none appearance-none cursor-pointer focus:border-blue-500/60 focus:bg-white/8 transition-all`}
        >
          {options.map((o) => (
            <option key={o} value={o} className="bg-slate-900">{o}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af] pointer-events-none" />
      </div>
    </div>
  );
}

/* ────────────────────────
   SECTION: PERSONAL DETAILS
   ──────────────────────── */
function PersonalDetails() {
  const [form, setForm] = useState({ name: "Arjun Kapoor", email: "arjun.kapoor@vamalogistics.in", phone: "+91 98201 77654", emergency: "+91 91234 56789" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { state, trigger } = useSaveState();

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.includes("@")) e.email = "Enter a valid email";
    if (form.phone.length < 10) e.phone = "Enter a valid phone number";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <SectionCard title="Edit Personal Details" icon={User} iconGradient="from-blue-500 to-cyan-400" delay={0.05}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Full Name"         icon={User}  value={form.name}      onChange={(v) => setForm({ ...form, name: v })}      required placeholder="Driver full name" error={errors.name} />
        <Field label="Email Address"     icon={Mail}  value={form.email}     onChange={(v) => setForm({ ...form, email: v })}     required placeholder="email@domain.com"   error={errors.email} type="email" />
        <Field label="Phone Number"      icon={Phone} value={form.phone}     onChange={(v) => setForm({ ...form, phone: v })}     required placeholder="+91 XXXXX XXXXX"   error={errors.phone} />
        <Field label="Emergency Contact" icon={Phone} value={form.emergency} onChange={(v) => setForm({ ...form, emergency: v })}          placeholder="+91 XXXXX XXXXX" />
      </div>
      <div className="flex justify-end">
        <SaveButton state={state} onClick={() => trigger(validate())} />
      </div>
    </SectionCard>
  );
}

/* ────────────────────────
   SECTION: CHANGE PASSWORD
   ──────────────────────── */
function ChangePassword() {
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [show, setShow] = useState({ current: false, next: false, confirm: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { state, trigger } = useSaveState();

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.current) e.current = "Current password required";
    if (form.next.length < 8) e.next = "Minimum 8 characters";
    if (form.next !== form.confirm) e.confirm = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const PasswordField = ({ id, label, field }: { id: "current" | "next" | "confirm"; label: string; field: string }) => (
    <div>
      <label className="block text-xs text-[#9ca3af] mb-1.5 font-medium uppercase tracking-wider">{label}<span className="text-red-400 ml-0.5">*</span></label>
      <div className="relative">
        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B004A]/50" />
        <input
          type={show[id] ? "text" : "password"}
          value={field}
          onChange={(e) => setForm({ ...form, [id]: e.target.value })}
          className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-white border text-white text-sm placeholder-blue-200/25 outline-none focus:bg-white/8 focus:border-blue-500/60 transition-all ${errors[id] ? "border-red-500/50" : "border-[rgba(139,0,74,0.1)]"}`}
          placeholder="••••••••"
        />
        <button type="button" onClick={() => setShow({ ...show, [id]: !show[id] })} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b0a8b0] hover:text-blue-200/70 transition-colors">
          {show[id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {errors[id] && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors[id]}</p>}
    </div>
  );

  /* Password strength */
  const strength = form.next.length === 0 ? 0 : form.next.length < 6 ? 1 : form.next.length < 10 ? 2 : /[A-Z]/.test(form.next) && /[0-9]/.test(form.next) ? 4 : 3;
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthColor = ["", "#ef4444", "#f59e0b", "#3b82f6", "#10b981"];

  return (
    <SectionCard title="Change Password" icon={Lock} iconGradient="from-rose-500 to-pink-400" delay={0.1}>
      <div className="space-y-4">
        <PasswordField id="current" label="Current Password" field={form.current} />
        <PasswordField id="next"    label="New Password"     field={form.next} />
        {form.next.length > 0 && (
          <div className="space-y-1">
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex-1 h-1 rounded-full transition-all duration-300" style={{ background: s <= strength ? strengthColor[strength] : "rgba(255,255,255,0.08)" }} />
              ))}
            </div>
            <p className="text-xs font-semibold" style={{ color: strengthColor[strength] }}>{strengthLabel[strength]}</p>
          </div>
        )}
        <PasswordField id="confirm" label="Confirm New Password" field={form.confirm} />
      </div>
      <div className="flex justify-end">
        <SaveButton state={state} onClick={() => trigger(validate())} />
      </div>
    </SectionCard>
  );
}

/* ────────────────────────
   SECTION: VEHICLE INFO
   ──────────────────────── */
function VehicleInfo() {
  const [form, setForm] = useState({ reg: "MH 12 AB 3456", type: "Heavy Truck", capacity: "10 Tonnes", fuel: "Diesel" });
  const { state, trigger } = useSaveState();

  return (
    <SectionCard title="Update Vehicle Information" icon={Truck} iconGradient="from-emerald-500 to-teal-400" delay={0.15}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field      label="Registration No."  icon={Truck}  value={form.reg}      onChange={(v) => setForm({ ...form, reg: v })}      required placeholder="MH XX AB XXXX" />
        <SelectField label="Vehicle Type"      icon={Truck}  value={form.type}     onChange={(v) => setForm({ ...form, type: v })}     options={["Heavy Truck", "Light Truck", "Mini Truck", "Container", "Tanker", "Motorcycle"]} />
        <Field      label="Capacity (Tonnes)" icon={Gauge}  value={form.capacity} onChange={(v) => setForm({ ...form, capacity: v })} placeholder="e.g. 10 Tonnes" />
        <SelectField label="Fuel Type"         icon={Fuel}   value={form.fuel}     onChange={(v) => setForm({ ...form, fuel: v })}     options={["Diesel", "Petrol", "CNG", "Electric", "Hybrid"]} />
      </div>
      <div className="flex justify-end">
        <SaveButton state={state} onClick={() => trigger(true)} />
      </div>
    </SectionCard>
  );
}

/* ────────────────────────
   SECTION: LICENSE DETAILS
   ──────────────────────── */
function LicenseDetails() {
  const [form, setForm] = useState({ number: "MH-12-20180045632", expiry: "2028-06-30", class: "Heavy Motor Vehicle" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { state, trigger } = useSaveState();

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.number.trim()) e.number = "License number required";
    if (!form.expiry) e.expiry = "Expiry date required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <SectionCard title="Update License Details" icon={CreditCard} iconGradient="from-violet-500 to-purple-400" delay={0.2}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="License Number" icon={CreditCard} value={form.number} onChange={(v) => setForm({ ...form, number: v })} required placeholder="MH-XX-XXXXXXXX" error={errors.number} />
        <Field label="Expiry Date"    icon={ShieldCheck} value={form.expiry} onChange={(v) => setForm({ ...form, expiry: v })} type="date" required error={errors.expiry} />
        <SelectField label="License Class" value={form.class} onChange={(v) => setForm({ ...form, class: v })} options={["Heavy Motor Vehicle", "Light Motor Vehicle", "Transport Vehicle", "Two Wheeler"]} />
      </div>
      <div className="flex justify-end">
        <SaveButton state={state} onClick={() => trigger(validate())} />
      </div>
    </SectionCard>
  );
}

/* ────────────────────────
   SECTION: UPLOAD DOCUMENTS
   ──────────────────────── */
function UploadDocuments() {
  const [uploads, setUploads] = useState<Record<string, string>>({});
  const docs = [
    { id: "license", label: "Driving License", icon: CreditCard },
    { id: "rc",      label: "Vehicle RC",       icon: FileText },
    { id: "insurance", label: "Insurance Certificate", icon: ShieldCheck },
    { id: "police",  label: "Police Verification", icon: ShieldCheck },
  ];

  return (
    <SectionCard title="Upload Documents" icon={UploadCloud} iconGradient="from-cyan-500 to-sky-400" delay={0.25}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {docs.map((doc) => (
          <div key={doc.id} className="relative">
            <label
              htmlFor={`doc-${doc.id}`}
              className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-[rgba(139,0,74,0.1)] hover:border-blue-500/40 hover:bg-white/[0.02] transition-all cursor-pointer text-center group"
            >
              <doc.icon className="w-6 h-6 text-[#8B004A]/50 group-hover:text-[#8B004A] transition-colors" />
              <div>
                <p className="text-xs font-semibold text-white/60 group-hover:text-white/80 transition-colors">{doc.label}</p>
                {uploads[doc.id]
                  ? <p className="text-[10px] text-emerald-400 mt-0.5">✓ {uploads[doc.id]}</p>
                  : <p className="text-[10px] text-[#b0a8b0] mt-0.5">Click to upload · PDF / JPG</p>
                }
              </div>
            </label>
            <input
              id={`doc-${doc.id}`}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setUploads((u) => ({ ...u, [doc.id]: f.name }));
              }}
            />
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

/* ────────────────────────
   SECTION: NOTIFICATIONS
   ──────────────────────── */
function NotificationPrefs() {
  const [prefs, setPrefs] = useState({
    newOrder: true, routeChange: true, deliveryStatus: true,
    weatherAlert: true, systemUpdates: false, promotions: false,
  });

  const toggle = (key: keyof typeof prefs) => setPrefs((p) => ({ ...p, [key]: !p[key] }));

  const items: { key: keyof typeof prefs; label: string; desc: string }[] = [
    { key: "newOrder",       label: "New Order Assigned",   desc: "Notify when a new delivery is assigned" },
    { key: "routeChange",    label: "Route Changes",        desc: "Notify on route optimization updates" },
    { key: "deliveryStatus", label: "Delivery Status",      desc: "Confirmations and status updates" },
    { key: "weatherAlert",   label: "Weather Alerts",       desc: "Severe weather on your route" },
    { key: "systemUpdates",  label: "System Updates",       desc: "Platform maintenance and updates" },
    { key: "promotions",     label: "Promotions",           desc: "Bonuses and performance rewards" },
  ];

  return (
    <SectionCard title="Notification Preferences" icon={Bell} iconGradient="from-amber-500 to-orange-400" delay={0.3}>
      <div className="space-y-1">
        {items.map((item) => (
          <div key={item.key} className="flex items-center justify-between py-3 border-b border-[rgba(139,0,74,0.07)] last:border-0">
            <div>
              <p className="text-sm font-medium text-[#1a1a1a]">{item.label}</p>
              <p className="text-xs text-[#9ca3af] mt-0.5">{item.desc}</p>
            </div>
            <button
              onClick={() => toggle(item.key)}
              className={`relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0 ${prefs[item.key] ? "bg-blue-500" : "bg-[#EDE9E1]"}`}
            >
              <motion.span
                animate={{ x: prefs[item.key] ? 22 : 2 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-md"
              />
            </button>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

/* ────────────────────────
   SECTION: AVAILABILITY
   ──────────────────────── */
function AvailabilityToggle() {
  const [status, setStatus] = useState<"Online" | "Offline" | "Busy">("Online");
  const options = [
    { value: "Online" as const,  color: "from-emerald-500 to-teal-400",  dot: "bg-emerald-400", icon: Wifi },
    { value: "Busy"   as const,  color: "from-amber-500 to-orange-400",  dot: "bg-amber-400",   icon: Activity },
    { value: "Offline"as const,  color: "from-red-500 to-rose-400",      dot: "bg-red-400",     icon: WifiOff },
  ];

  return (
    <SectionCard title="Availability Status" icon={Activity} iconGradient="from-rose-500 to-pink-400" delay={0.35}>
      <p className="text-sm text-[#9ca3af] -mt-1 mb-4">Set your current availability for new delivery assignments.</p>
      <div className="grid grid-cols-3 gap-3">
        {options.map((opt) => (
          <motion.button
            key={opt.value}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setStatus(opt.value)}
            className={`relative flex flex-col items-center gap-2 py-4 rounded-xl border transition-all ${
              status === opt.value
                ? `bg-gradient-to-br ${opt.color} border-transparent shadow-lg`
                : "bg-[#F9F7F2] border-[rgba(139,0,74,0.1)] hover:border-[rgba(139,0,74,0.2)]"
            }`}
          >
            <span className={`w-3 h-3 rounded-full ${opt.dot} ${status === opt.value ? "animate-pulse" : "opacity-30"}`} />
            <span className="text-sm font-semibold text-[#1a1a1a]">{opt.value}</span>
          </motion.button>
        ))}
      </div>
      <AnimatePresence>
        {status !== "Online" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/25"
          >
            <p className="text-xs text-amber-300 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              {status === "Busy" ? "No new orders will be assigned while Busy." : "You are invisible to the system while Offline."}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </SectionCard>
  );
}

/* ────────────────────────
   MAIN COMPONENT
   ──────────────────────── */
export default function DriverSettingsPage({ onLogout }: { onLogout?: () => void }) {
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-[#1a1a1a]">Account Settings</h2>
        <p className="text-[#9ca3af] text-sm mt-0.5">Manage your driver profile, vehicle details, and preferences</p>
      </motion.div>

      <PersonalDetails />
      <ChangePassword />
      <VehicleInfo />
      <LicenseDetails />
      <UploadDocuments />
      <NotificationPrefs />
      <AvailabilityToggle />

      {/* Danger zone */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="bg-red-500/5 backdrop-blur-xl rounded-2xl border border-red-500/20 p-6"
      >
        <h3 className="text-base font-semibold text-red-400 mb-1">Danger Zone</h3>
        <p className="text-sm text-[#9ca3af] mb-4">Sign out of your driver account on this device.</p>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          onClick={onLogout}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400 hover:text-red-300 text-sm font-semibold transition-all"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </motion.button>
      </motion.div>
    </div>
  );
}
