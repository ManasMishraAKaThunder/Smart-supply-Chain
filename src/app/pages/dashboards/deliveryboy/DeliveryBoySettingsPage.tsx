import { useState } from "react";
import { motion } from "motion/react";
import {
  User, Lock, Phone, MapPin, Bike, Bell, Clock,
  Save, Eye, EyeOff, CheckCircle2, AlertCircle, ChevronDown, LogOut,
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
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
        state === "saved" ? "bg-emerald-500 text-white" :
        state === "error" ? "bg-red-500 text-white" :
        "bg-gradient-to-r from-[#8B004A] to-[#C4006A] hover:from-[#6B0039] hover:to-[#8B004A] text-white shadow-md shadow-[#8B004A]/20"
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

function SectionCard({ title, icon: Icon, iconGradient, children, delay = 0 }: {
  title: string; icon: React.ElementType; iconGradient: string;
  children: React.ReactNode; delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden shadow-sm"
    >
      <div className="flex items-center gap-3 px-6 pt-5 pb-4 border-b border-[#E5E5E5]/50">
        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${iconGradient} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-[#1a1a1a]" />
        </div>
        <h3 className="text-base font-bold text-[#1a1a1a]">{title}</h3>
      </div>
      <div className="px-6 py-5 space-y-4">{children}</div>
    </motion.div>
  );
}

function Field({ label, icon: Icon, type = "text", value, onChange, placeholder = "", required = false, error = "" }: {
  label: string; icon?: React.ElementType; type?: string; value: string;
  onChange: (v: string) => void; placeholder?: string; required?: boolean; error?: string;
}) {
  return (
    <div>
      <label className="block text-xs text-[#555555] mb-1.5 font-bold uppercase tracking-wider">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B004A] pointer-events-none" />}
        <input
          type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          className={`w-full ${Icon ? "pl-10" : "pl-4"} pr-4 py-2.5 rounded-xl bg-white border text-[#1a1a1a] text-sm placeholder-[#888888] outline-none transition-all focus:bg-gray-50 focus:border-[#8B004A]/60 ${error ? "border-red-500/50" : "border-[#E5E5E5]"}`}
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{error}</p>}
    </div>
  );
}

function SelectField({ label, value, onChange, options, icon: Icon }: {
  label: string; value: string; onChange: (v: string) => void; options: string[]; icon?: React.ElementType;
}) {
  return (
    <div>
      <label className="block text-xs text-[#555555] mb-1.5 font-bold uppercase tracking-wider">{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B004A] pointer-events-none z-10" />}
        <select
          value={value} onChange={(e) => onChange(e.target.value)}
          className={`w-full ${Icon ? "pl-10" : "pl-4"} pr-8 py-2.5 rounded-xl bg-white border border-[#E5E5E5] text-[#1a1a1a] text-sm outline-none appearance-none cursor-pointer focus:border-[#8B004A]/60 focus:bg-gray-50 transition-all`}
        >
          {options.map((o) => <option key={o} value={o} className="text-[#1a1a1a]">{o}</option>)}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888] pointer-events-none" />
      </div>
    </div>
  );
}

/* ── SECTION: Personal Details ── */
function PersonalDetails() {
  const [form, setForm] = useState({
    name: sessionStorage.getItem("userName") || "Rohan Desai",
    phone: "+91 90123 45678",
    address: "B-12, Parel Colony, Mumbai – 400012",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { state, trigger } = useSaveState();

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (form.phone.length < 10) e.phone = "Enter a valid phone number";
    if (!form.address.trim()) e.address = "Address is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <SectionCard title="Personal Details" icon={User} iconGradient="from-blue-500 to-cyan-400" delay={0.05}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Full Name" icon={User} value={form.name} onChange={(v) => setForm({ ...form, name: v })} required placeholder="Your full name" error={errors.name} />
        <Field label="Phone Number" icon={Phone} value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required placeholder="+91 XXXXX XXXXX" error={errors.phone} />
        <div className="sm:col-span-2">
          <Field label="Home Address" icon={MapPin} value={form.address} onChange={(v) => setForm({ ...form, address: v })} required placeholder="Street, City, Pincode" error={errors.address} />
        </div>
      </div>
      <div className="flex justify-end pt-1">
        <SaveButton state={state} onClick={() => trigger(validate())} />
      </div>
    </SectionCard>
  );
}

/* ── SECTION: Vehicle Details ── */
function VehicleDetails() {
  const [form, setForm] = useState({ vehicleNo: "MH-01-EB-4892", vehicleType: "Electric Bike" });
  const { state, trigger } = useSaveState();

  return (
    <SectionCard title="Vehicle Details" icon={Bike} iconGradient="from-emerald-500 to-teal-400" delay={0.1}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Vehicle Number" icon={Bike} value={form.vehicleNo} onChange={(v) => setForm({ ...form, vehicleNo: v })} required placeholder="e.g. MH-01-EB-4892" />
        <SelectField label="Vehicle Type" icon={Bike} value={form.vehicleType} onChange={(v) => setForm({ ...form, vehicleType: v })}
          options={["Electric Bike", "Petrol Bike", "Bicycle", "Electric Scooter", "Motorcycle"]}
        />
      </div>
      <div className="flex justify-end pt-1">
        <SaveButton state={state} onClick={() => trigger(true)} />
      </div>
    </SectionCard>
  );
}

/* ── SECTION: Shift Preferences ── */
function ShiftPreferences() {
  const [shift, setShift] = useState("Morning Shift (6 AM – 2 PM)");
  const [zone, setZone] = useState("South Mumbai – Zone 3");
  const { state, trigger } = useSaveState();

  const shifts = [
    "Morning Shift (6 AM – 2 PM)",
    "Afternoon Shift (2 PM – 10 PM)",
    "Night Shift (10 PM – 6 AM)",
    "Full Day (8 AM – 8 PM)",
  ];
  const zones = [
    "South Mumbai – Zone 1",
    "South Mumbai – Zone 2",
    "South Mumbai – Zone 3",
    "Central Mumbai – Zone A",
    "Western Suburbs – Zone B",
    "Eastern Suburbs – Zone C",
  ];

  return (
    <SectionCard title="Shift & Zone Preferences" icon={Clock} iconGradient="from-violet-500 to-purple-400" delay={0.15}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectField label="Preferred Shift" icon={Clock} value={shift} onChange={setShift} options={shifts} />
        <SelectField label="Preferred Zone" icon={MapPin} value={zone} onChange={setZone} options={zones} />
      </div>
      <p className="text-xs text-[#888888] font-semibold -mt-1">Note: Zone assignments are subject to manager approval.</p>
      <div className="flex justify-end pt-1">
        <SaveButton state={state} onClick={() => trigger(true)} />
      </div>
    </SectionCard>
  );
}

/* ── SECTION: Change Password ── */
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

  const strength = form.next.length === 0 ? 0 : form.next.length < 6 ? 1 : form.next.length < 10 ? 2 : /[A-Z]/.test(form.next) && /[0-9]/.test(form.next) ? 4 : 3;
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthColor = ["", "#ef4444", "#f59e0b", "#3b82f6", "#10b981"];

  const PwdField = ({ id, label, field }: { id: "current" | "next" | "confirm"; label: string; field: string }) => (
    <div>
      <label className="block text-xs text-[#555555] mb-1.5 font-bold uppercase tracking-wider">
        {label}<span className="text-red-500 ml-0.5">*</span>
      </label>
      <div className="relative">
        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B004A]" />
        <input
          type={show[id] ? "text" : "password"} value={field}
          onChange={(e) => setForm({ ...form, [id]: e.target.value })} placeholder="••••••••"
          className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-white border text-[#1a1a1a] text-sm placeholder-[#888888] outline-none focus:bg-gray-50 focus:border-[#8B004A]/60 transition-all ${errors[id] ? "border-red-500/50" : "border-[#E5E5E5]"}`}
        />
        <button type="button" onClick={() => setShow({ ...show, [id]: !show[id] })} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] hover:text-[#8B004A] transition-colors">
          {show[id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {errors[id] && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors[id]}</p>}
    </div>
  );

  return (
    <SectionCard title="Change Password" icon={Lock} iconGradient="from-rose-500 to-pink-400" delay={0.2}>
      <div className="space-y-4">
        <PwdField id="current" label="Current Password" field={form.current} />
        <PwdField id="next" label="New Password" field={form.next} />
        {form.next.length > 0 && (
          <div className="space-y-1">
            <div className="flex gap-1">{[1, 2, 3, 4].map((s) => <div key={s} className="flex-1 h-1 rounded-full transition-all duration-300" style={{ background: s <= strength ? strengthColor[strength] : "rgba(0,0,0,0.05)" }} />)}</div>
            <p className="text-xs font-bold" style={{ color: strengthColor[strength] }}>{strengthLabel[strength]}</p>
          </div>
        )}
        <PwdField id="confirm" label="Confirm New Password" field={form.confirm} />
      </div>
      <div className="flex justify-end pt-1">
        <SaveButton state={state} onClick={() => trigger(validate())} />
      </div>
    </SectionCard>
  );
}

/* ── SECTION: Notification Preferences ── */
function NotificationPrefs() {
  const [prefs, setPrefs] = useState({
    newOrder: true, deliveryUpdate: true, routeChange: true, systemUpdates: false, promotions: false,
  });
  const toggle = (k: keyof typeof prefs) => setPrefs((p) => ({ ...p, [k]: !p[k] }));
  const items: { key: keyof typeof prefs; label: string; desc: string }[] = [
    { key: "newOrder", label: "New Order Assigned", desc: "Get notified when a new delivery is assigned to you" },
    { key: "deliveryUpdate", label: "Delivery Status", desc: "Confirmations and live delivery status changes" },
    { key: "routeChange", label: "Route / Zone Updates", desc: "Alerts for route optimization or zone reassignment" },
    { key: "systemUpdates", label: "System Updates", desc: "Platform maintenance and app updates" },
    { key: "promotions", label: "Bonuses & Rewards", desc: "Performance bonuses and incentive notifications" },
  ];

  return (
    <SectionCard title="Notification Preferences" icon={Bell} iconGradient="from-amber-500 to-orange-400" delay={0.25}>
      <div className="space-y-1">
        {items.map((item) => (
          <div key={item.key} className="flex items-center justify-between py-3 border-b border-[#E5E5E5]/50 last:border-0">
            <div>
              <p className="text-sm font-bold text-[#1a1a1a]">{item.label}</p>
              <p className="text-xs text-[#555555] font-medium mt-0.5">{item.desc}</p>
            </div>
            <button
              onClick={() => toggle(item.key)}
              className={`relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0 ml-4 ${prefs[item.key] ? "bg-emerald-500" : "bg-[#EDE9E1]"}`}
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

/* ── MAIN COMPONENT ── */
export default function DeliveryBoySettingsPage({ onLogout }: { onLogout?: () => void }) {
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h2 className="text-2xl font-black text-[#1a1a1a]">Account Settings</h2>
        <p className="text-[#555555] text-sm font-medium mt-0.5">Manage your personal info, vehicle details, shift preferences and more</p>
      </motion.div>

      <PersonalDetails />
      <VehicleDetails />
      <ShiftPreferences />
      <ChangePassword />
      <NotificationPrefs />

      {/* Danger zone */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}
        className="bg-red-50 rounded-2xl border border-red-200 p-6 shadow-sm"
      >
        <h3 className="text-base font-bold text-red-700 mb-1">Danger Zone</h3>
        <p className="text-sm text-red-600/70 mb-4 font-medium">Sign out of your delivery account on this device.</p>
        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }} onClick={onLogout}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-red-50 border border-red-300 text-red-600 hover:text-red-700 text-sm font-bold transition-all shadow-sm"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </motion.button>
      </motion.div>
    </div>
  );
}
