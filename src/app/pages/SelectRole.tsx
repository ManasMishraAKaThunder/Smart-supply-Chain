import { motion } from "motion/react";
import { useNavigate } from "react-router";
import {
  Warehouse,
  Truck,
  PackageCheck,
  Navigation,
  Bike,
  User,
  ArrowRight,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

/* ═══ BRAND COLORS — Light Theme ═══ */
const C = {
  primary:     "#8B004A", // For icon gradient
  primaryLight:"#C4006A", // For icon gradient
  bg:          "#F8F6F2",
  bgCard:      "#FFFFFF",
  textDark:    "#1A1A1A",
  textMuted:   "#666666",
  accent:      "#D7340B",
  gradientCSS: "linear-gradient(135deg, #8B004A, #C4006A)",
  border:      "#E5E5E5",
};

const roles = [
  {
    id: "warehouse",
    title: "Warehouse Holder",
    description: "Manage inventory, track stock levels, and optimize warehouse operations",
    icon: Warehouse,
  },
  {
    id: "supplier",
    title: "Supplier",
    description: "Track shipments, manage deliveries, and monitor dispatch status",
    icon: Truck,
  },
  {
    id: "receiver",
    title: "Receiver",
    description: "Monitor incoming shipments and manage delivery schedules",
    icon: PackageCheck,
  },
  {
    id: "driver",
    title: "Driver",
    description: "Access optimized routes, traffic updates, and delivery navigation",
    icon: Navigation,
  },
  {
    id: "delivery-boy",
    title: "Delivery Boy",
    description: "Manage local deliveries and update delivery status in real-time",
    icon: Bike,
  },
  {
    id: "customer",
    title: "Customer",
    description: "Track your orders and view real-time delivery progress",
    icon: User,
  },
];

export default function SelectRole() {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  return (
    <div className="min-h-screen overflow-hidden relative bg-background">
      {/* Dot grid pattern (Clean SaaS style) */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none" 
        style={{
          backgroundImage: "radial-gradient(#000 2px, transparent 2px)",
          backgroundSize: "32px 32px"
        }}
      />

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Back navigation */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => navigate("/")}
          className="absolute top-10 left-4 md:left-10 text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 text-sm font-bold uppercase tracking-widest"
        >
          &larr; Back to Home
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20 mt-10 md:mt-0"
        >
          {/* VAMA Logo branding */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col items-center justify-center mb-8"
          >
             <img 
               src="/vama-logo.png" 
               alt="VAMA Logo" 
               className={`h-12 w-auto object-contain transition-all duration-300 ${isDark ? "invert brightness-200" : "mix-blend-multiply"} aspect-auto`} 
             />
             <span className="text-[10px] uppercase tracking-[0.3em] font-bold mt-4" style={{ color: C.primary }}>Personalize Your Experience</span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight text-foreground">
            Select Your{" "}
            <span style={{ color: C.primary, fontWeight: 900 }}>
              Role
            </span>
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed px-4" style={{ color: C.textMuted }}>
            Access your dedicated workspace optimized for your specific supply chain function
          </p>
        </motion.div>

        {/* Role Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {roles.map((role, index) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ scale: 1.02, y: -6 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/login/${role.id}`)}
              className="group relative cursor-pointer"
            >
              <div className="relative p-8 md:p-10 bg-card rounded-2xl h-full transition-all duration-300 overflow-hidden flex flex-col"
                style={{
                  border: `1px solid ${C.border}`,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                }}>
                
                {/* Icon (maintaining gradient for brand consistency) */}
                <div className="w-14 h-14 rounded-[1.25rem] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 shadow-sm"
                  style={{ background: C.gradientCSS }}>
                  <role.icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-4 text-foreground">
                  {role.title}
                </h3>
                <p className="leading-relaxed text-sm flex-grow text-muted-foreground">
                  {role.description}
                </p>

                <div className="mt-10 flex items-center gap-2 font-bold text-sm tracking-wide transition-colors group-hover:brightness-90"
                  style={{ color: C.accent }}>
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
