import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { User, Mail, Phone, MapPin, BadgeCheck, Loader2 } from "lucide-react";
import { getUserProfile } from "../../../../services/userService";

/* ── default customer data (fallback) ── */
const defaultCustomer = {
  name:   sessionStorage.getItem("userName")  || "Customer",
  email:  sessionStorage.getItem("userEmail") || "customer@email.com",
  phone:  "Not specified",
  address: "Not specified",
  avatar: (sessionStorage.getItem("userName") || "C").substring(0, 2).toUpperCase(),
  avatarGradient: "from-violet-500 to-pink-400",
};

function InfoRow({
  icon: Icon, label, value,
}: {
  icon: React.ElementType; label: string; value: string;
}) {
  return (
    <div className="flex items-start gap-4 py-4 border-b border-[#E5E5E5] last:border-0">
      <div className="w-9 h-9 rounded-lg bg-white border border-[#E5E5E5] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
        <Icon className="w-4 h-4 text-[#8B004A]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-[#555555] uppercase tracking-wider mb-0.5 font-bold">{label}</p>
        <p className="text-[#1a1a1a] text-sm font-semibold leading-snug break-words">{value}</p>
      </div>
    </div>
  );
}

export default function CustomerProfilePage() {
  const [customer, setCustomer] = useState<any>(defaultCustomer);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserProfile()
      .then((data: any) => {
        if (data) setCustomer({ ...defaultCustomer, ...data, avatar: (data.fullName || defaultCustomer.name).substring(0, 2).toUpperCase() });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#8B004A]" /></div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* ── HERO CARD ── */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative bg-[#F9F7F2] backdrop-blur-xl rounded-2xl border border-[rgba(139,0,74,0.1)] overflow-hidden"
      >
        {/* Gradient banner */}
        <div className="h-24 bg-gradient-to-r from-violet-600/40 via-pink-500/30 to-cyan-600/30 relative">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4c1d95_1px,transparent_1px),linear-gradient(to_bottom,#4c1d95_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-20" />
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
              <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${customer.avatarGradient} border-4 border-white flex items-center justify-center shadow-xl`}>
                <span className="text-white text-3xl font-black">{customer.avatar}</span>
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white bg-emerald-400 shadow-sm" />
            </motion.div>

            {/* Name & badges */}
            <div className="flex-1 pb-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h2 className="text-2xl font-black text-[#1a1a1a]">{customer.name}</h2>
                  <p className="text-[#9ca3af] text-sm">{customer.email}</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-emerald-500/25 bg-emerald-50 text-[#1F8A4C] text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-[#1F8A4C] animate-pulse" />
                    Active
                  </span>
                  <span className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-blue-500/25 bg-blue-50 text-[#8B004A] text-xs font-bold">
                    <BadgeCheck className="w-3.5 h-3.5" /> Verified
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── PROFILE DETAILS CARD ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
        className="bg-[#F9F7F2] backdrop-blur-xl rounded-2xl border border-[rgba(139,0,74,0.1)] overflow-hidden"
      >
        <div className="flex items-center gap-3 px-6 pt-5 pb-4 border-b border-white/[0.06]">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
            <User className="w-5 h-5 text-[#1a1a1a]" />
          </div>
          <h3 className="text-base font-semibold text-[#1a1a1a]">Profile Details</h3>
        </div>
        <div className="px-6 py-2">
          <InfoRow icon={User}  label="Full Name"       value={customer.name} />
          <InfoRow icon={Mail}  label="Email Address"   value={customer.email} />
          <InfoRow icon={Phone} label="Phone Number"    value={customer.phone} />
          <InfoRow icon={MapPin} label="Delivery Address" value={customer.address} />
        </div>
      </motion.div>
    </div>
  );
}
