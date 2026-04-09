import { motion } from "motion/react";
import DashboardLayout from "../../components/DashboardLayout";
import StatsCard from "../../components/StatsCard";
import { PackageCheck, Clock, TrendingUp, AlertTriangle } from "lucide-react";

const incomingShipments = [
  {
    id: "SHP-101",
    supplier: "Tech Supplies Co.",
    items: "Electronics - 450 units",
    status: "Arriving Today",
    eta: "2:30 PM",
    priority: "high",
  },
  {
    id: "SHP-102",
    supplier: "Fashion Wholesale Ltd.",
    items: "Clothing - 200 units",
    status: "In Transit",
    eta: "Tomorrow, 10:00 AM",
    priority: "medium",
  },
  {
    id: "SHP-103",
    supplier: "Medical Supplies Inc.",
    items: "Medical Equipment - 150 units",
    status: "Arriving Today",
    eta: "4:45 PM",
    priority: "high",
  },
  {
    id: "SHP-104",
    supplier: "Book Distributors",
    items: "Books - 320 units",
    status: "In Transit",
    eta: "Mar 29, 9:00 AM",
    priority: "low",
  },
];

export default function ReceiverDashboard() {
  const orderId = sessionStorage.getItem("orderId") || "ORD-2026-001";

  return (
    <DashboardLayout role="receiver" orderId={orderId}>
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Arriving Today"
            value="8"
            icon={PackageCheck}
            gradient="from-blue-500 to-cyan-500"
            delay={0}
          />
          <StatsCard
            title="In Transit"
            value="24"
            icon={Clock}
            gradient="from-violet-500 to-purple-500"
            delay={0.1}
          />
          <StatsCard
            title="Received This Week"
            value="156"
            icon={TrendingUp}
            trend="+15.8%"
            trendUp={true}
            gradient="from-emerald-500 to-teal-500"
            delay={0.2}
          />
          <StatsCard
            title="Priority Items"
            value="12"
            icon={AlertTriangle}
            gradient="from-amber-500 to-orange-500"
            delay={0.3}
          />
        </div>

        {/* Incoming Shipments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">
              Incoming Shipments
            </h3>
            <select className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-blue-400/50 focus:ring-0 outline-none">
              <option>All Shipments</option>
              <option>Arriving Today</option>
              <option>High Priority</option>
            </select>
          </div>

          <div className="space-y-4">
            {incomingShipments.map((shipment, index) => (
              <motion.div
                key={shipment.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                className="group p-5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-white font-semibold text-lg">
                        {shipment.id}
                      </h4>
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          shipment.priority === "high"
                            ? "bg-red-500/20 text-red-400 border border-red-500/30"
                            : shipment.priority === "medium"
                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                            : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                        }`}
                      >
                        {shipment.priority.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-blue-200/70 mb-1">
                      Supplier: {shipment.supplier}
                    </p>
                    <p className="text-blue-200/60 text-sm">{shipment.items}</p>
                  </div>
                  <span
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      shipment.status === "Arriving Today"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    }`}
                  >
                    {shipment.status}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 text-blue-200/70">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">ETA: {shipment.eta}</span>
                  </div>
                  <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-sm transition-all opacity-0 group-hover:opacity-100">
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Delivery Schedule */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
          >
            <h3 className="text-xl font-semibold text-white mb-6">
              Today's Schedule
            </h3>
            <div className="space-y-3">
              {[
                { time: "09:00 AM", item: "Electronics Delivery" },
                { time: "11:30 AM", item: "Food Items Delivery" },
                { time: "02:30 PM", item: "Medical Equipment" },
                { time: "04:45 PM", item: "Office Supplies" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5"
                >
                  <span className="text-white">{item.item}</span>
                  <span className="text-blue-200/60 text-sm">{item.time}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
          >
            <h3 className="text-xl font-semibold text-white mb-6">
              Receiving Capacity
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-blue-200/70">Current Capacity</span>
                  <span className="text-white font-semibold">68%</span>
                </div>
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "68%" }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-3 rounded-lg bg-white/5">
                  <p className="text-blue-200/60 text-sm mb-1">Available Space</p>
                  <p className="text-white font-semibold">32%</p>
                </div>
                <div className="p-3 rounded-lg bg-white/5">
                  <p className="text-blue-200/60 text-sm mb-1">In Use</p>
                  <p className="text-white font-semibold">68%</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
