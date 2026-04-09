import { motion } from "motion/react";
import DashboardLayout from "../../components/DashboardLayout";
import StatsCard from "../../components/StatsCard";
import { Bike, MapPin, Package, CheckCircle2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useState } from "react";

const deliveries = [
  {
    id: "DEL-001",
    customer: "John Doe",
    address: "123 Main St, Apt 4B",
    items: "2 packages",
    status: "picked",
    distance: "2.3 km",
  },
  {
    id: "DEL-002",
    customer: "Sarah Smith",
    address: "456 Oak Avenue",
    items: "1 package",
    status: "pending",
    distance: "3.1 km",
  },
  {
    id: "DEL-003",
    customer: "Mike Johnson",
    address: "789 Pine Road, Unit 12",
    items: "3 packages",
    status: "pending",
    distance: "1.8 km",
  },
];

export default function DeliveryBoyDashboard() {
  const orderId = sessionStorage.getItem("orderId") || "ORD-2026-001";
  const [deliveryList, setDeliveryList] = useState(deliveries);

  const updateStatus = (id: string, newStatus: string) => {
    setDeliveryList(
      deliveryList.map((delivery) =>
        delivery.id === id ? { ...delivery, status: newStatus } : delivery
      )
    );
  };

  return (
    <DashboardLayout role="delivery-boy" orderId={orderId}>
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Delivered Today"
            value="18"
            icon={CheckCircle2}
            trend="+6"
            trendUp={true}
            gradient="from-emerald-500 to-teal-500"
            delay={0}
          />
          <StatsCard
            title="Out for Delivery"
            value="5"
            icon={Bike}
            gradient="from-blue-500 to-cyan-500"
            delay={0.1}
          />
          <StatsCard
            title="Pending Pickup"
            value="8"
            icon={Package}
            gradient="from-amber-500 to-orange-500"
            delay={0.2}
          />
          <StatsCard
            title="Total Distance"
            value="32.5 km"
            icon={MapPin}
            gradient="from-violet-500 to-purple-500"
            delay={0.3}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Delivery List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-2 bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
          >
            <h3 className="text-xl font-semibold text-white mb-6">
              Today's Deliveries
            </h3>
            <div className="space-y-4">
              {deliveryList.map((delivery, index) => (
                <motion.div
                  key={delivery.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                  className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-white font-semibold">{delivery.id}</h4>
                        <span
                          className={`px-3 py-1 rounded-full text-xs ${
                            delivery.status === "delivered"
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : delivery.status === "out-for-delivery"
                              ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                              : delivery.status === "picked"
                              ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                              : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          }`}
                        >
                          {delivery.status === "delivered"
                            ? "Delivered"
                            : delivery.status === "out-for-delivery"
                            ? "Out for Delivery"
                            : delivery.status === "picked"
                            ? "Picked"
                            : "Pending"}
                        </span>
                      </div>
                      <p className="text-white font-medium mb-1">{delivery.customer}</p>
                      <p className="text-blue-200/70 text-sm mb-1">{delivery.address}</p>
                      <div className="flex items-center gap-4 text-sm text-blue-200/60">
                        <span>{delivery.items}</span>
                        <span>•</span>
                        <span>{delivery.distance}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4 border-t border-white/10">
                    {delivery.status === "pending" && (
                      <Button
                        onClick={() => updateStatus(delivery.id, "picked")}
                        className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                      >
                        Mark as Picked
                      </Button>
                    )}
                    {delivery.status === "picked" && (
                      <Button
                        onClick={() => updateStatus(delivery.id, "out-for-delivery")}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600"
                      >
                        Out for Delivery
                      </Button>
                    )}
                    {delivery.status === "out-for-delivery" && (
                      <Button
                        onClick={() => updateStatus(delivery.id, "delivered")}
                        className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                      >
                        Mark as Delivered
                      </Button>
                    )}
                    {delivery.status === "delivered" && (
                      <div className="flex-1 flex items-center justify-center gap-2 text-emerald-400">
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Completed</span>
                      </div>
                    )}
                    <Button variant="outline" className="px-4 border-white/10 text-white hover:bg-white/5">
                      View Map
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Customer Location Map & Info */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
            >
              <h3 className="text-xl font-semibold text-white mb-4">
                Current Location
              </h3>
              
              {/* Mini Map */}
              <div className="relative h-48 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden border border-white/10 mb-4">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] opacity-30" />
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/50"
                >
                  <Bike className="w-6 h-6 text-white" />
                </motion.div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-200/70">Next Stop</span>
                  <span className="text-white">2.3 km away</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-200/70">ETA</span>
                  <span className="text-white">8 minutes</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
            >
              <h3 className="text-xl font-semibold text-white mb-4">
                Performance
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2 text-sm">
                    <span className="text-blue-200/70">Daily Target</span>
                    <span className="text-white">72%</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "72%" }}
                      transition={{ duration: 1, delay: 0.7 }}
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-lg bg-white/5">
                    <p className="text-blue-200/60 text-xs mb-1">On-Time</p>
                    <p className="text-white font-semibold">96%</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5">
                    <p className="text-blue-200/60 text-xs mb-1">Rating</p>
                    <p className="text-white font-semibold">4.8 ⭐</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
