import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  User, Phone, Mail, AlertCircle, CreditCard, Calendar,
  Star, Truck, Gauge, Fuel, ShieldCheck, Package,
  Clock, TrendingUp, TrendingDown, Wifi, WifiOff,
  Activity, MapPin, BadgeCheck, PhoneCall, Loader2,
} from "lucide-react";
import { getUserProfile } from "../../../../services/userService";

/* ─── Default driver data (used as fallback when API returns empty) ─── */
const defaultDriver = {
  name: sessionStorage.getItem("userName") || "Driver",
  email: sessionStorage.getItem("userEmail") || "driver@vamalogistics.in",
  phone: "+91 98201 77654",
  emergency: "+91 91234 56789",
  avatar: (sessionStorage.getItem("userName") || "D").substring(0, 2).toUpperCase(),
  avatarGradient: "from-blue-500 to-cyan-400",
  license: "MH-12-20180045632",
  licenseExpiry: "2028-06-30",
  experience: 6,
  driverRating: 4.8,
  vehicle: {
    registration: "MH 12 AB 3456",
    type: "Heavy Truck",
    capacity: "10 Tonnes",
    fuel: "Diesel",
    insuranceStatus: "Active",
    insuranceExpiry: "2025-12-31",
  },
  performance: {
    totalDeliveries: 0,
    onTime: 0,
    delayRate: 0,
    customerRating: 0,
  },
  status: "Online" as "Online" | "Offline" | "Busy",
  currentRoute: "Not assigned",
  assignedOrder: "N/A",
};

/* ─── Helpers ─── */
function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < Math.floor(rating)
              ? "text-amber-400 fill-amber-400"
              : i < rating
              ? "text-amber-400 fill-amber-400/40"
              : "text-gray-200"
          }`}
        />
      ))}
      <span className="text-sm font-bold text-white ml-1">{rating}</span>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  valueClass = "text-white",
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-[rgba(139,0,74,0.07)] last:border-0">
      <div className="flex items-center gap-2.5 text-[#9ca3af] min-w-0">
        <Icon className="w-4 h-4 flex-shrink-0 text-[#8B004A]/60" />
        <span className="text-sm">{label}</span>
      </div>
      <span className={`text-sm font-semibold text-right ${valueClass}`}>{value}</span>
    </div>
  );
}

function SectionCard({
  title,
  icon: Icon,
  iconGradient,
  children,
  delay = 0,
}: {
  title: string;
  icon: React.ElementType;
  iconGradient: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
      className="bg-[#F9F7F2] backdrop-blur-xl rounded-2xl border border-[rgba(139,0,74,0.1)] overflow-hidden"
    >
      <div className="flex items-center gap-3 px-6 pt-5 pb-4 border-b border-white/8">
        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${iconGradient} flex items-center justify-center`}>
          <Icon className="w-4.5 h-4.5 text-white w-5 h-5" />
        </div>
        <h3 className="text-base font-semibold text-[#1a1a1a]">{title}</h3>
      </div>
      <div className="px-6 py-2">{children}</div>
    </motion.div>
  );
}

const statusConfig = {
  Online: { color: "text-emerald-400", bg: "bg-emerald-500/15 border-emerald-500/25", dot: "bg-emerald-400", icon: Wifi },
  Offline: { color: "text-red-400", bg: "bg-red-500/15 border-red-500/25", dot: "bg-red-400", icon: WifiOff },
  Busy: { color: "text-amber-400", bg: "bg-amber-500/15 border-amber-500/25", dot: "bg-amber-400", icon: Activity },
};

export default function DriverProfilePage() {
  const [driver, setDriver] = useState<any>(defaultDriver);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserProfile()
      .then((data: any) => {
        if (data) setDriver({ ...defaultDriver, ...data, avatar: (data.fullName || defaultDriver.name).substring(0, 2).toUpperCase() });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#8B004A]" /></div>;

  const status = statusConfig[driver.status as keyof typeof statusConfig] || statusConfig.Online;
  const licenseExpiry = new Date(driver.vehicle.insuranceExpiry);
  const today = new Date();
  const daysLeft = Math.ceil((licenseExpiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="space-y-6 max-w-6xl">
      {/* ── HERO PROFILE CARD ── */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative bg-[#F9F7F2] backdrop-blur-xl rounded-2xl border border-[rgba(139,0,74,0.1)] overflow-hidden"
      >
        {/* Gradient banner */}
        <div className="h-28 bg-gradient-to-r from-blue-600/40 via-cyan-500/30 to-violet-600/30 relative">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e3a8a_1px,transparent_1px),linear-gradient(to_bottom,#1e3a8a_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-20" />
        </div>

        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
            {/* Avatar */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="relative flex-shrink-0"
            >
              <div
                className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${driver.avatarGradient} border-4 border-slate-900 flex items-center justify-center shadow-xl`}
              >
                <span className="text-white text-3xl font-black">{driver.avatar}</span>
              </div>
              {/* online dot */}
              <span
                className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-slate-900 ${status.dot}`}
              />
            </motion.div>

            {/* Name & meta */}
            <div className="flex-1 pb-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-black text-[#1a1a1a]">{driver.name}</h2>
                  <p className="text-[#9ca3af] text-sm">{driver.email}</p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  {/* Status badge */}
                  <span
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-semibold ${status.bg} ${status.color}`}
                  >
                    <span className={`w-2 h-2 rounded-full ${status.dot} animate-pulse`} />
                    {driver.status}
                  </span>
                  {/* Verified */}
                  <span className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-blue-500/25 bg-blue-500/10 text-[#8B004A] text-xs font-semibold">
                    <BadgeCheck className="w-3.5 h-3.5" /> Verified Driver
                  </span>
                </div>
              </div>
              {/* Star rating */}
              <div className="mt-2">
                <StarRating rating={driver.driverRating} />
              </div>
            </div>
          </div>

          {/* Current route banner */}
          <div className="mt-5 flex flex-col sm:flex-row items-start sm:items-center gap-2 p-3.5 rounded-xl bg-blue-500/8 border border-blue-500/20">
            <MapPin className="w-4 h-4 text-[#8B004A] flex-shrink-0 mt-0.5 sm:mt-0" />
            <div className="flex-1 min-w-0">
              <span className="text-xs text-[#9ca3af] uppercase tracking-wider">Current Route</span>
              <p className="text-sm text-blue-200 font-medium truncate">{driver.currentRoute}</p>
            </div>
            <span className="text-xs font-mono bg-[rgba(139,0,74,0.1)] text-[#8B004A] border border-blue-500/20 px-2.5 py-1 rounded-lg flex-shrink-0">
              {driver.assignedOrder}
            </span>
          </div>
        </div>
      </motion.div>

      {/* ── GRID SECTIONS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Info */}
        <SectionCard title="Personal Information" icon={User} iconGradient="from-blue-500 to-cyan-400" delay={0.1}>
          <InfoRow icon={User}      label="Full Name"         value={driver.name} />
          <InfoRow icon={Mail}      label="Email"             value={driver.email} />
          <InfoRow icon={Phone}     label="Phone Number"      value={driver.phone} />
          <InfoRow icon={PhoneCall} label="Emergency Contact" value={driver.emergency} valueClass="text-amber-300" />
        </SectionCard>

        {/* Driving Details */}
        <SectionCard title="Driving Details" icon={CreditCard} iconGradient="from-violet-500 to-purple-400" delay={0.15}>
          <InfoRow icon={CreditCard} label="License Number"     value={driver.license} valueClass="text-white font-mono text-xs" />
          <InfoRow icon={Calendar}   label="License Expiry"     value={new Date(driver.licenseExpiry).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })} />
          <InfoRow icon={Clock}      label="Experience"         value={`${driver.experience} Years`} />
          <div className="py-3">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2.5 text-[#9ca3af]">
                <Star className="w-4 h-4 text-[#8B004A]/60" />
                <span className="text-sm">Driver Rating</span>
              </div>
              <StarRating rating={driver.driverRating} />
            </div>
          </div>
        </SectionCard>

        {/* Vehicle Details */}
        <SectionCard title="Vehicle Details" icon={Truck} iconGradient="from-emerald-500 to-teal-400" delay={0.2}>
          <InfoRow icon={Truck}        label="Registration"    value={driver.vehicle.registration} valueClass="font-mono text-cyan-300" />
          <InfoRow icon={Truck}        label="Vehicle Type"    value={driver.vehicle.type} />
          <InfoRow icon={Gauge}        label="Capacity"        value={driver.vehicle.capacity} />
          <InfoRow icon={Fuel}         label="Fuel Type"       value={driver.vehicle.fuel} />
          <InfoRow
            icon={ShieldCheck}
            label="Insurance"
            value={driver.vehicle.insuranceStatus}
            valueClass={driver.vehicle.insuranceStatus === "Active" ? "text-emerald-400" : "text-red-400"}
          />
          <InfoRow
            icon={Calendar}
            label="Ins. Expiry"
            value={new Date(driver.vehicle.insuranceExpiry).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
            valueClass={daysLeft < 60 ? "text-amber-400" : "text-white"}
          />
        </SectionCard>

        {/* Delivery Performance */}
        <SectionCard title="Delivery Performance" icon={TrendingUp} iconGradient="from-amber-500 to-orange-400" delay={0.25}>
          {/* Big numbers */}
          <div className="grid grid-cols-2 gap-3 pt-3 pb-4">
            {[
              { label: "Total Deliveries", value: driver.performance.totalDeliveries.toLocaleString(), color: "#60a5fa" },
              { label: "On-Time %", value: `${driver.performance.onTime}%`, color: "#34d399" },
              { label: "Delay Rate", value: `${driver.performance.delayRate}%`, color: "#f59e0b" },
              { label: "Customer Rating", value: `${driver.performance.customerRating}/5`, color: "#a78bfa" },
            ].map((s) => (
              <div key={s.label} className="p-3 rounded-xl bg-[#F9F7F2] border border-white/8 text-center">
                <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
                <p className="text-xs text-[#9ca3af] mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* On-Time Progress bar */}
          <div className="pb-3 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="flex items-center gap-1 text-[#9ca3af]"><TrendingUp className="w-3 h-3" /> On-Time Rate</span>
              <span className="text-emerald-400 font-bold">{driver.performance.onTime}%</span>
            </div>
            <div className="h-2 rounded-full bg-white overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                initial={{ width: 0 }}
                animate={{ width: `${driver.performance.onTime}%` }}
                transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
              />
            </div>
            <div className="flex justify-between text-xs">
              <span className="flex items-center gap-1 text-[#9ca3af]"><TrendingDown className="w-3 h-3" /> Delay Rate</span>
              <span className="text-amber-400 font-bold">{driver.performance.delayRate}%</span>
            </div>
            <div className="h-2 rounded-full bg-white overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-400"
                initial={{ width: 0 }}
                animate={{ width: `${driver.performance.delayRate}%` }}
                transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
              />
            </div>
          </div>
        </SectionCard>
      </div>

      {/* ── STATUS CARD ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.3 }}
        className="bg-[#F9F7F2] backdrop-blur-xl rounded-2xl border border-[rgba(139,0,74,0.1)] p-6"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-pink-400 flex items-center justify-center">
            <Activity className="w-5 h-5 text-[#1a1a1a]" />
          </div>
          <h3 className="text-base font-semibold text-[#1a1a1a]">Current Status</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {(["Online", "Offline", "Busy"] as const).map((s) => {
            const cfg = statusConfig[s];
            const isActive = driver.status === s;
            return (
              <div
                key={s}
                className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                  isActive ? `${cfg.bg} ${cfg.color} border-current/30` : "bg-white/[0.02] border-white/8 text-[#b0a8b0]"
                }`}
              >
                <span className={`w-3 h-3 rounded-full ${cfg.dot} ${isActive ? "animate-pulse" : "opacity-30"}`} />
                <span className="font-semibold text-sm">{s}</span>
                {isActive && <span className="ml-auto text-xs font-bold opacity-70">Active</span>}
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
