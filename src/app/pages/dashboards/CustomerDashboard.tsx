import { motion } from "motion/react";
import DashboardLayout from "../../components/DashboardLayout";
import { Package, Truck, Navigation, CheckCircle2, Clock } from "lucide-react";

const trackingSteps = [
  {
    id: 1,
    title: "Order Placed",
    description: "Your order has been confirmed",
    time: "Mar 27, 9:30 AM",
    status: "completed",
    icon: Package,
  },
  {
    id: 2,
    title: "Warehouse Processing",
    description: "Items being prepared for shipment",
    time: "Mar 27, 10:45 AM",
    status: "completed",
    icon: Package,
  },
  {
    id: 3,
    title: "In Transit",
    description: "Package is on its way",
    time: "Mar 27, 2:15 PM",
    status: "active",
    icon: Truck,
  },
  {
    id: 4,
    title: "Out for Delivery",
    description: "Package will arrive soon",
    time: "Expected: 5:30 PM",
    status: "pending",
    icon: Navigation,
  },
  {
    id: 5,
    title: "Delivered",
    description: "Package successfully delivered",
    time: "Pending",
    status: "pending",
    icon: CheckCircle2,
  },
];

const orderDetails = {
  orderId: "ORD-2026-001",
  items: [
    { name: "Wireless Headphones", quantity: 1, price: 129.99 },
    { name: "USB-C Cable", quantity: 2, price: 19.99 },
  ],
  subtotal: 169.97,
  shipping: 9.99,
  total: 179.96,
  estimatedDelivery: "Today, 5:30 PM",
};

export default function CustomerDashboard() {
  const orderId = sessionStorage.getItem("orderId") || "ORD-2026-001";

  return (
    <DashboardLayout role="customer" orderId={orderId}>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-2">Track Your Order</h2>
          <p className="text-blue-200/70">
            Estimated Delivery: <span className="text-white font-semibold">{orderDetails.estimatedDelivery}</span>
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10"
        >
          <div className="flex justify-between items-center mb-4">
            <span className="text-blue-200/70">Order Progress</span>
            <span className="text-white font-semibold">60%</span>
          </div>
          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "60%" }}
              transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500 rounded-full relative"
            >
              <motion.div
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-white/30"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Tracking Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10"
        >
          <h3 className="text-2xl font-semibold text-white mb-8">Tracking Timeline</h3>
          
          <div className="space-y-8">
            {trackingSteps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="flex gap-6"
              >
                {/* Timeline Line & Icon */}
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                    className={`relative w-14 h-14 rounded-full flex items-center justify-center z-10 ${
                      step.status === "completed"
                        ? "bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/30"
                        : step.status === "active"
                        ? "bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/30 animate-pulse"
                        : "bg-white/10 border-2 border-white/20"
                    }`}
                  >
                    <step.icon className={`w-7 h-7 ${
                      step.status === "pending" ? "text-blue-200/40" : "text-white"
                    }`} />
                    
                    {/* Pulse effect for active status */}
                    {step.status === "active" && (
                      <motion.div
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.5, 0, 0.5],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="absolute inset-0 rounded-full bg-blue-400"
                      />
                    )}
                  </motion.div>
                  
                  {/* Connecting Line */}
                  {index < trackingSteps.length - 1 && (
                    <div
                      className={`w-0.5 h-20 mt-2 ${
                        step.status === "completed"
                          ? "bg-gradient-to-b from-emerald-500 to-emerald-500/50"
                          : "bg-white/10"
                      }`}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-8">
                  <div className={`p-5 rounded-xl border transition-all ${
                    step.status === "active"
                      ? "bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-400/50"
                      : step.status === "completed"
                      ? "bg-white/5 border-emerald-500/30"
                      : "bg-white/5 border-white/10"
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-xl font-semibold text-white">{step.title}</h4>
                      {step.status === "active" && (
                        <span className="px-3 py-1 rounded-full bg-blue-500 text-white text-xs font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          In Progress
                        </span>
                      )}
                    </div>
                    <p className="text-blue-200/70 mb-2">{step.description}</p>
                    <p className="text-blue-200/50 text-sm">{step.time}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Order Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
          >
            <h3 className="text-xl font-semibold text-white mb-6">Order Details</h3>
            <div className="space-y-4">
              {orderDetails.items.map((item, index) => (
                <div key={index} className="flex justify-between items-start p-3 rounded-lg bg-white/5">
                  <div>
                    <p className="text-white font-medium">{item.name}</p>
                    <p className="text-blue-200/60 text-sm">Quantity: {item.quantity}</p>
                  </div>
                  <p className="text-white font-semibold">${item.price}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
              <div className="flex justify-between text-blue-200/70">
                <span>Subtotal</span>
                <span>${orderDetails.subtotal}</span>
              </div>
              <div className="flex justify-between text-blue-200/70">
                <span>Shipping</span>
                <span>${orderDetails.shipping}</span>
              </div>
              <div className="flex justify-between text-white font-semibold text-lg pt-3 border-t border-white/10">
                <span>Total</span>
                <span>${orderDetails.total}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
          >
            <h3 className="text-xl font-semibold text-white mb-6">Delivery Information</h3>
            <div className="space-y-4">
              <div>
                <p className="text-blue-200/60 text-sm mb-1">Delivery Address</p>
                <p className="text-white">123 Main Street, Apt 4B</p>
                <p className="text-white">New York, NY 10001</p>
              </div>
              <div>
                <p className="text-blue-200/60 text-sm mb-1">Contact Number</p>
                <p className="text-white">+1 (555) 123-4567</p>
              </div>
              <div>
                <p className="text-blue-200/60 text-sm mb-1">Delivery Instructions</p>
                <p className="text-white">Leave package at front door</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/10">
              <button className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium transition-all">
                Contact Support
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
