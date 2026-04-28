import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import DashboardLayout from "../../components/DashboardLayout";
import RoleEntryModal from "../../components/RoleEntryModal";
import StatsCard from "../../components/StatsCard";
import { Navigation, MapPin, Clock, AlertCircle, CloudRain, Loader2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { getActiveShipments } from "../../../services/shipmentService";
import WarehousesPage from "./driver/WarehousesPage";
import SuppliersPage from "./driver/SuppliersPage";
import ReceiversPage from "./driver/ReceiversPage";
import DriverProfilePage from "./driver/DriverProfilePage";
import DriverSettingsPage from "./driver/DriverSettingsPage";


// ===== DASHBOARD HOME =====
function DashboardHome() {
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActiveShipments()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setRoutes(data);
        } else {
          // Fallback: provide empty array, UI handles gracefully
          setRoutes([]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
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
          className="lg:col-span-2 bg-white rounded-2xl p-6 border border-[rgba(139,0,74,0.08)]"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-[#1a1a1a]">Live Navigation</h3>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 text-[#1F8A4C] border border-emerald-200">
              <div className="w-2 h-2 rounded-full bg-[#1F8A4C] animate-pulse" />
              <span className="text-sm font-semibold">Live Tracking</span>
            </div>
          </div>

          {/* Mock Map */}
          {/* TODO: replace with Google Maps API component */}
          {/* TODO: update marker using real-time backend location from WebSocket */}
          {/* TODO: use publishDriverLocation() to send GPS coordinates to backend */}
          <div className="relative h-96 bg-[#F8F6F2] rounded-xl overflow-hidden border border-[#E5E5E5]">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#E5E5E5_1px,transparent_1px),linear-gradient(to_bottom,#E5E5E5_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-30" />

            <svg className="absolute inset-0 w-full h-full">
              <motion.path
                d="M 50 350 Q 150 280, 250 250 T 450 200 T 650 150"
                stroke="#8B004A"
                strokeWidth="4"
                fill="none"
                strokeDasharray="10 5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: 0.5 }}
              />
            </svg>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="absolute top-[85%] left-[8%] w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg"
            >
              <MapPin className="w-5 h-5 text-[#1a1a1a]" />
            </motion.div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="absolute top-[35%] right-[15%] w-8 h-8 rounded-full bg-gradient-to-br from-[#8B004A] to-[#C4006A] flex items-center justify-center shadow-lg"
            >
              <MapPin className="w-5 h-5 text-[#1a1a1a]" />
            </motion.div>

            <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-white/90 backdrop-blur-xl border border-[#E5E5E5] shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#1a1a1a] font-semibold text-lg">Warehouse District</p>
                  <p className="text-[#555555] text-sm font-medium">12.5 km • 18 min away</p>
                </div>
                <Button className="bg-gradient-to-r from-[#8B004A] to-[#C4006A] hover:from-[#6B0039] hover:to-[#8B004A] shadow-md shadow-[#8B004A]/20">
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
            className="bg-white rounded-2xl p-6 border border-[#E5E5E5]"
          >
            <h3 className="text-xl font-semibold text-[#1a1a1a] mb-4">Conditions</h3>
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                <div className="flex items-center gap-3 mb-2">
                  <CloudRain className="w-5 h-5 text-[#8B004A]" />
                  <span className="text-[#1a1a1a] font-semibold">Weather</span>
                </div>
                <p className="text-[#555555] text-sm">Partly Cloudy, 22°C</p>
              </div>
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                <div className="flex items-center gap-3 mb-2">
                  <Navigation className="w-5 h-5 text-[#1F8A4C]" />
                  <span className="text-[#1a1a1a] font-semibold">Traffic</span>
                </div>
                <p className="text-[#555555] text-sm">Light traffic on route</p>
              </div>
            </div>
          </motion.div>

          {/* Next Stop */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-white rounded-2xl p-6 border border-[#E5E5E5]"
          >
            <h3 className="text-xl font-semibold text-[#1a1a1a] mb-4">Next Stop</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[#555555] font-medium">Destination</span>
                <span className="text-[#1a1a1a] font-semibold">Warehouse A</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#555555] font-medium">ETA</span>
                <span className="text-[#1a1a1a] font-semibold">18 min</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#555555] font-medium">Distance</span>
                <span className="text-[#1a1a1a] font-semibold">12.5 km</span>
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
        className="bg-white rounded-2xl p-6 border border-[rgba(139,0,74,0.08)]"
      >
        <h3 className="text-xl font-semibold text-white mb-6">AI-Optimized Routes</h3>
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
                  : "bg-white border-[rgba(139,0,74,0.1)] hover:border-[rgba(139,0,74,0.2)]"
              }`}
            >
              {route.recommended && (
                <span className="inline-block px-3 py-1 mb-3 rounded-full bg-blue-500 text-white text-xs font-medium">
                  Recommended
                </span>
              )}
              <h4 className="text-[#1a1a1a] font-bold mb-3">{route.id}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#555555] font-medium">Distance</span>
                  <span className="text-[#1a1a1a] font-semibold">{route.distance}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#555555] font-medium">Duration</span>
                  <span className="text-[#1a1a1a] font-semibold">{route.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#555555] font-medium">Traffic</span>
                  <span
                    className={
                      route.traffic === "Light"
                        ? "text-[#1F8A4C] font-bold"
                        : route.traffic === "Moderate"
                        ? "text-amber-600 font-bold"
                        : "text-red-600 font-bold"
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
  );
}

// ===== ROOT COMPONENT =====
export default function DriverDashboard() {
  // ===== STATE =====
  const [vehicleNumber, setVehicleNumber] = useState<string | null>(sessionStorage.getItem("vehicleNumber"));
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const navigate = useNavigate();

  // ===== HANDLERS =====
  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  const renderPage = () => {
    switch (activeMenu) {
      case "warehouses":
        return <WarehousesPage />;
      case "suppliers":
        return <SuppliersPage />;
      case "receivers":
        return <ReceiversPage />;
      case "profile":
        return <DriverProfilePage />;
      case "settings":
        return <DriverSettingsPage onLogout={handleLogout} />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <>
      <RoleEntryModal
        isOpen={!vehicleNumber}
        role="driver"
        onSave={(id) => setVehicleNumber(id)}
      />
      <DashboardLayout
        role="driver"
        orderId={vehicleNumber || ""}
        activeMenu={activeMenu}
        onMenuClick={setActiveMenu}
      >
        {renderPage()}
      </DashboardLayout>
    </>
  );
}
