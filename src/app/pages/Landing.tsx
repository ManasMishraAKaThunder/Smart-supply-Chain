import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { 
  Warehouse, 
  Truck, 
  PackageCheck, 
  Navigation, 
  Bike, 
  User 
} from "lucide-react";

const roles = [
  {
    id: "warehouse-holder",
    title: "Warehouse Holder",
    description: "Manage inventory, track stock levels, and optimize warehouse operations",
    icon: Warehouse,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: "supplier",
    title: "Supplier",
    description: "Track shipments, manage deliveries, and monitor dispatch status",
    icon: Truck,
    gradient: "from-violet-500 to-purple-500",
  },
  {
    id: "receiver",
    title: "Receiver",
    description: "Monitor incoming shipments and manage delivery schedules",
    icon: PackageCheck,
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    id: "driver",
    title: "Driver",
    description: "Access optimized routes, traffic updates, and delivery navigation",
    icon: Navigation,
    gradient: "from-amber-500 to-orange-500",
  },
  {
    id: "delivery-boy",
    title: "Delivery Boy",
    description: "Manage local deliveries and update delivery status in real-time",
    icon: Bike,
    gradient: "from-pink-500 to-rose-500",
  },
  {
    id: "customer",
    title: "Customer",
    description: "Track your orders and view real-time delivery progress",
    icon: User,
    gradient: "from-indigo-500 to-blue-500",
  },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      
      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Smart Supply Chain System
          </h1>
          <p className="text-xl md:text-2xl text-blue-200/80 max-w-3xl mx-auto">
            Track, manage, and optimize your entire supply chain in one place
          </p>
        </motion.div>

        {/* Role Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {roles.map((role, index) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              onClick={() => navigate(role.id === "warehouse-holder" ? "/warehouse/signup" : `/login/${role.id}`)}
              className="group relative cursor-pointer"
            >
              {/* Glassmorphism card */}
              <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 h-full">
                {/* Gradient glow on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${role.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`} />
                
                {/* Icon */}
                <div className={`relative w-16 h-16 rounded-xl bg-gradient-to-br ${role.gradient} p-3 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <role.icon className="w-full h-full text-white" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-semibold text-white mb-3">
                  {role.title}
                </h3>
                <p className="text-blue-200/70 leading-relaxed">
                  {role.description}
                </p>

                {/* Arrow indicator */}
                <div className="mt-6 flex items-center text-blue-400 group-hover:text-blue-300 transition-colors">
                  <span className="text-sm font-medium">Get Started</span>
                  <svg
                    className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>

              {/* Gradient border effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${role.gradient} opacity-0 group-hover:opacity-20 rounded-2xl blur-xl transition-opacity duration-300 -z-10`} />
            </motion.div>
          ))}
        </div>

        {/* Footer info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <p className="text-blue-200/60">
            Select your role to access the supply chain management dashboard
          </p>
        </motion.div>
      </div>
    </div>
  );
}
