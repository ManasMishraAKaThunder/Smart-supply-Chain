import { motion } from "motion/react";
import DashboardLayout from "../../components/DashboardLayout";
import StatsCard from "../../components/StatsCard";
import { Navigation, MapPin, Clock, CloudRain, AlertCircle } from "lucide-react";
import { Button } from "../../components/ui/button";

const routes = [
  {
    id: "RT-001",
    destination: "Warehouse District",
    distance: "12.5 km",
    duration: "18 min",
    traffic: "Light",
    recommended: true,
  },
  {
    id: "RT-002",
    destination: "Warehouse District",
    distance: "14.2 km",
    duration: "25 min",
    traffic: "Heavy",
    recommended: false,
  },
  {
    id: "RT-003",
    destination: "Warehouse District",
    distance: "13.8 km",
    duration: "22 min",
    traffic: "Moderate",
    recommended: false,
  },
];

export default function DriverDashboard() {
  const orderId = sessionStorage.getItem("orderId") || "ORD-2026-001";

  return (
    <DashboardLayout role="driver" orderId={orderId}>
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Distance Today"
            value="45.8 km"
            icon={Navigation}
            gradient="from-blue-500 to-cyan-500"
            delay={0}
          />
          <StatsCard
            title="Deliveries Made"
            value="12"
            icon={MapPin}
            gradient="from-emerald-500 to-teal-500"
            delay={0.1}
          />
          <StatsCard
            title="Time on Road"
            value="4.2 hrs"
            icon={Clock}
            gradient="from-violet-500 to-purple-500"
            delay={0.2}
          />
          <StatsCard
            title="Pending Stops"
            value="3"
            icon={AlertCircle}
            gradient="from-amber-500 to-orange-500"
            delay={0.3}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map View */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-2 bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">
                Live Navigation
              </h3>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm">Live</span>
              </div>
            </div>

            {/* Mock Map */}
            <div className="relative h-96 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden border border-white/10">
              {/* Map Grid Background */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-30" />
              
              {/* Route Path */}
              <svg className="absolute inset-0 w-full h-full">
                <motion.path
                  d="M 50 350 Q 150 280, 250 250 T 450 200 T 650 150"
                  stroke="#3b82f6"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray="10 5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, delay: 0.5 }}
                />
              </svg>

              {/* Location Markers */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="absolute top-[85%] left-[8%] w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg"
              >
                <MapPin className="w-5 h-5 text-white" />
              </motion.div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                className="absolute top-[35%] right-[15%] w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg"
              >
                <MapPin className="w-5 h-5 text-white" />
              </motion.div>

              {/* Info Overlay */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-900/90 backdrop-blur-xl border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold">Warehouse District</p>
                    <p className="text-blue-200/70 text-sm">12.5 km • 18 min away</p>
                  </div>
                  <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                    Start Navigation
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Route Options & Conditions */}
          <div className="space-y-6">
            {/* Weather & Traffic */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
            >
              <h3 className="text-xl font-semibold text-white mb-4">
                Conditions
              </h3>
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
                  <div className="flex items-center gap-3 mb-2">
                    <CloudRain className="w-5 h-5 text-blue-400" />
                    <span className="text-white font-medium">Weather</span>
                  </div>
                  <p className="text-blue-200/70 text-sm">Partly Cloudy, 22°C</p>
                </div>
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                  <div className="flex items-center gap-3 mb-2">
                    <Navigation className="w-5 h-5 text-emerald-400" />
                    <span className="text-white font-medium">Traffic</span>
                  </div>
                  <p className="text-blue-200/70 text-sm">Light traffic on route</p>
                </div>
              </div>
            </motion.div>

            {/* Next Stop */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
            >
              <h3 className="text-xl font-semibold text-white mb-4">
                Next Stop
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-blue-200/70">Destination</span>
                  <span className="text-white">Warehouse A</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-200/70">ETA</span>
                  <span className="text-white">18 min</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-200/70">Distance</span>
                  <span className="text-white">12.5 km</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Route Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
        >
          <h3 className="text-xl font-semibold text-white mb-6">
            AI-Optimized Routes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {routes.map((route, index) => (
              <motion.div
                key={route.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                className={`p-5 rounded-xl border transition-all ${
                  route.recommended
                    ? "bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-400/50"
                    : "bg-white/5 border-white/10 hover:border-white/20"
                }`}
              >
                {route.recommended && (
                  <span className="inline-block px-3 py-1 mb-3 rounded-full bg-blue-500 text-white text-xs font-medium">
                    Recommended
                  </span>
                )}
                <h4 className="text-white font-semibold mb-3">{route.id}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-200/70">Distance</span>
                    <span className="text-white">{route.distance}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200/70">Duration</span>
                    <span className="text-white">{route.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200/70">Traffic</span>
                    <span
                      className={
                        route.traffic === "Light"
                          ? "text-emerald-400"
                          : route.traffic === "Moderate"
                          ? "text-amber-400"
                          : "text-red-400"
                      }
                    >
                      {route.traffic}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
