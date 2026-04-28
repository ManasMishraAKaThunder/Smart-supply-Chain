import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  User, Mail, Phone, MapPin, Bike, BadgeCheck,
  Clock, Star, TrendingUp, TrendingDown, Package,
  ShieldCheck, Calendar, Navigation, Loader2,
} from "lucide-react";
import { getUserProfile } from "../../../../services/userService";

/* ── default delivery boy data (fallback when API returns empty) ── */
const defaultProfile = {
  name:        sessionStorage.getItem("userName")      || "Delivery Agent",
  email:       sessionStorage.getItem("userEmail")     || "agent@vamalogistics.in",
  employeeId:  sessionStorage.getItem("deliveryBoyId") || "DB-000",
  phone:       "+91 00000 00000",
  address:     "Not specified",
  avatar:      (sessionStorage.getItem("userName") || "D").substring(0, 2).toUpperCase(),
  avatarGradient: "from-emerald-500 to-cyan-400",
  verified:    true,
  experience:  "N/A",
  work: {
    zone:        "Not assigned",
    vehicleType: "N/A",
    vehicleNo:   "N/A",
    joiningDate: "2025-01-01",
    shift:       "N/A",
  },
  performance: {
    totalDeliveries: 0,
    rating: 0,
    onTime: 0,
  },
};

/* ── reusable components ── */
function InfoRow({ icon: Icon, label, value, valueClass = "text-[#1a1a1a]" }: {
  icon: React.ElementType; label: string; value: string; valueClass?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-[#E5E5E5] last:border-0">
      <div className="flex items-center gap-2.5 text-[#555555] shrink-0 font-bold">
        <Icon className="w-4 h-4 text-[#8B004A]" />
        <span className="text-sm">{label}</span>
      </div>
      <span className={`text-sm font-bold text-right max-w-[55%] ${valueClass}`}>{value}</span>
    </div>
  );
}

function SectionCard({ title, icon: Icon, iconGradient, children, delay = 0 }: {
  title: string; icon: React.ElementType; iconGradient: string;
  children: React.ReactNode; delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
      className="bg-[#F9F7F2] backdrop-blur-xl rounded-2xl border border-[rgba(139,0,74,0.1)] overflow-hidden"
    >
      <div className="flex items-center gap-3 px-6 pt-5 pb-4 border-b border-white/[0.07]">
        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${iconGradient} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-[#1a1a1a]" />
        </div>
        <h3 className="text-base font-semibold text-[#1a1a1a]">{title}</h3>
      </div>
      <div className="px-6 py-2">{children}</div>
    </motion.div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(rating) ? "text-amber-500 fill-amber-500" : "text-gray-200"}`} />
      ))}
      <span className="text-sm font-bold text-[#1a1a1a] ml-1">{rating}</span>
    </div>
  );
}

export default function DeliveryBoyProfilePage() {
  const [deliveryBoy, setDeliveryBoy] = useState<any>(defaultProfile);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserProfile()
      .then((data: any) => {
        if (data) setDeliveryBoy({ ...defaultProfile, ...data, avatar: (data.fullName || defaultProfile.name).substring(0, 2).toUpperCase() });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#8B004A]" /></div>;

  const perf = deliveryBoy.performance || defaultProfile.performance;
  const delayRate = (100 - perf.onTime).toFixed(1);

  return (
    <div className="space-y-6 max-w-5xl">

      {/* ── HERO CARD ── */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative bg-[#F9F7F2] backdrop-blur-xl rounded-2xl border border-[rgba(139,0,74,0.1)] overflow-hidden"
      >
        {/* Banner */}
        <div className="h-24 bg-gradient-to-r from-emerald-600/40 via-cyan-500/30 to-blue-600/30 relative">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#064e3b_1px,transparent_1px),linear-gradient(to_bottom,#064e3b_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-20" />
        </div>

        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
            {/* Avatar */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="relative shrink-0"
            >
              <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${deliveryBoy.avatarGradient} border-4 border-white flex items-center justify-center shadow-xl`}>
                <span className="text-white text-3xl font-black">{deliveryBoy.avatar}</span>
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white bg-emerald-400 shadow-sm" />
            </motion.div>

            {/* Name / meta */}
            <div className="flex-1 pb-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-black text-[#1a1a1a]">{deliveryBoy.name}</h2>
                  <p className="text-[#555555] text-sm font-bold">{deliveryBoy.email}</p>
                  <p className="text-xs font-mono text-[#8B004A] font-bold mt-0.5 tracking-wide">
                    {deliveryBoy.employeeId}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-emerald-500/25 bg-emerald-50 text-[#1F8A4C] text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-[#1F8A4C] animate-pulse" />
                    Active
                  </span>
                  {deliveryBoy.verified && (
                    <span className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-blue-500/25 bg-blue-50 text-[#8B004A] text-xs font-bold">
                      <BadgeCheck className="w-3.5 h-3.5" /> Verified
                    </span>
                  )}
                </div>
              </div>
              <div className="mt-2">
                <StarRating rating={perf.rating} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── INFO GRID: Personal + Work ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Personal Info */}
        <SectionCard title="Personal Information" icon={User} iconGradient="from-blue-500 to-cyan-400" delay={0.1}>
          <InfoRow icon={User}       label="Full Name"    value={deliveryBoy.name} />
          <InfoRow icon={BadgeCheck} label="Employee ID"  value={deliveryBoy.employeeId} valueClass="font-mono text-[#8B004A] font-bold tracking-wide" />
          <InfoRow icon={Mail}       label="Email"        value={deliveryBoy.email} />
          <InfoRow icon={Phone}      label="Phone"        value={deliveryBoy.phone} />
          <InfoRow icon={MapPin}     label="Address"      value={deliveryBoy.address} />
        </SectionCard>

        {/* Work Info */}
        <SectionCard title="Work Information" icon={Bike} iconGradient="from-emerald-500 to-teal-400" delay={0.15}>
          <InfoRow icon={Navigation}  label="Assigned Zone"  value={deliveryBoy.work.zone} />
          <InfoRow icon={Bike}        label="Vehicle Type"   value={deliveryBoy.work.vehicleType} />
          <InfoRow icon={ShieldCheck} label="Vehicle No."    value={deliveryBoy.work.vehicleNo} valueClass="font-mono text-[#8B004A] text-xs font-bold" />
          <InfoRow icon={Calendar}    label="Joining Date"   value={new Date(deliveryBoy.work.joiningDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })} />
          <InfoRow icon={Clock}       label="Shift"          value={deliveryBoy.work.shift} />
        </SectionCard>
      </div>

      {/* ── PERFORMANCE SECTION ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.25 }}
        className="bg-[#F9F7F2] backdrop-blur-xl rounded-2xl border border-[rgba(139,0,74,0.1)] overflow-hidden"
      >
        <div className="flex items-center gap-3 px-6 pt-5 pb-4 border-b border-[#E5E5E5]/50">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-400 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-[#1a1a1a]" />
          </div>
          <h3 className="text-base font-semibold text-[#1a1a1a]">Performance Overview</h3>
        </div>

        <div className="p-6 space-y-6">
          {/* Stat tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Total Deliveries",  value: perf.totalDeliveries.toLocaleString(), color: "#3B82F6", icon: Package },
              { label: "Average Rating",    value: `${perf.rating} / 5`,                 color: "#D97706", icon: Star    },
              { label: "On-Time Delivery",  value: `${perf.onTime}%`,                    color: "#059669", icon: TrendingUp },
            ].map((s) => (
              <div key={s.label} className="p-4 rounded-xl bg-white border border-[#E5E5E5] text-center space-y-1 shadow-sm">
                <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
                <p className="text-xs text-[#555555] font-bold">{s.label}</p>
              </div>
            ))}
          </div>

          {/* On-Time progress bar */}
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="flex items-center gap-1 text-[#555555] font-bold">
                  <TrendingUp className="w-3 h-3" /> On-Time Delivery Rate
                </span>
                <span className="text-[#1F8A4C] font-black">{perf.onTime}%</span>
              </div>
              <div className="h-2.5 rounded-full bg-white border border-[#E5E5E5] overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${perf.onTime}%` }}
                  transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="flex items-center gap-1 text-[#555555] font-bold">
                  <TrendingDown className="w-3 h-3" /> Delay Rate
                </span>
                <span className="text-amber-600 font-black">{delayRate}%</span>
              </div>
              <div className="h-2.5 rounded-full bg-white border border-[#E5E5E5] overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${delayRate}%` }}
                  transition={{ duration: 1.2, delay: 0.65, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>

          {/* Verification + Experience badges */}
          <div className="flex flex-wrap gap-3 pt-1">
            {deliveryBoy.verified && (
              <span className="flex items-center gap-2 px-4 py-2 rounded-xl border border-blue-500/25 bg-blue-50 text-[#8B004A] text-sm font-bold">
                <BadgeCheck className="w-4 h-4" /> Identity Verified
              </span>
            )}
            <span className="flex items-center gap-2 px-4 py-2 rounded-xl border border-violet-500/25 bg-violet-50 text-violet-700 text-sm font-bold">
              <Clock className="w-4 h-4" /> Experience: {deliveryBoy.experience}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
