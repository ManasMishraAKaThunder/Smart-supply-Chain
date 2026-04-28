import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Truck, Bike, User, Warehouse, AlertCircle } from "lucide-react";

interface RoleEntryModalProps {
  role: "warehouse" | "driver" | "delivery-boy" | "customer";
  onSave: (id: string) => void;
  isOpen: boolean;
}

const roleConfigs = {
  warehouse: {
    title: "Warehouse Access",
    description: "Please enter your Warehouse ID to access the inventory and operations dashboard.",
    label: "Warehouse ID",
    placeholder: "e.g., WH-IND-001",
    icon: Warehouse,
    storageKey: "warehouseId",
  },
  driver: {
    title: "Vehicle Verification",
    description: "Enter your registered vehicle number to start tracking your routes and deliveries.",
    label: "Vehicle Number",
    placeholder: "e.g., MH-12-AB-1234",
    icon: Truck,
    storageKey: "vehicleNumber",
  },
  "delivery-boy": {
    title: "Delivery Boy ID",
    description: "Enter your unique ID in the format DB-[AreaCode]-[XXX] to access your delivery list.",
    label: "Delivery Boy ID",
    placeholder: "e.g., DB-MUM-001",
    icon: Bike,
    storageKey: "deliveryBoyId",
    validation: (val: string) => /^DB-[A-Z]{3}-\d{3}$/.test(val),
    errorMessage: "Invalid format. Please use DB-[AreaCode]-[XXX] (e.g., DB-MUM-001).",
  },
  customer: {
    title: "Track Your Order",
    description: "Enter your Order ID to view real-time tracking and delivery status.",
    label: "Order ID",
    placeholder: "e.g., ORD-2026-001",
    icon: User,
    storageKey: "orderId",
  },
};

export default function RoleEntryModal({ role, onSave, isOpen }: RoleEntryModalProps) {
  const config = roleConfigs[role];
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!value.trim()) {
      setError(`${config.label} is required.`);
      return;
    }

    if (config.validation && !config.validation(value)) {
      setError(config.errorMessage || "Invalid format.");
      return;
    }

    sessionStorage.setItem(config.storageKey, value.trim());
    onSave(value.trim());
  };

  const Icon = config.icon;

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[425px] bg-white border-[rgba(139,0,74,0.1)] p-0 overflow-hidden rounded-2xl">
        <div className="relative p-8">
          {/* Subtle background glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#8B004A] opacity-[0.03] blur-[80px] rounded-full" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#8B004A] opacity-[0.03] blur-[80px] rounded-full" />

          <DialogHeader className="relative z-10 flex flex-col items-center text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, type: "spring" }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8B004A] to-[#C4006A] flex items-center justify-center shadow-lg shadow-[#8B004A]/20 mb-6"
            >
              <Icon className="w-8 h-8 text-white" />
            </motion.div>
            <DialogTitle className="text-2xl font-bold text-[#1a1a1a] mb-2">
              {config.title}
            </DialogTitle>
            <DialogDescription className="text-[#6b6b6b] leading-relaxed">
              {config.description}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6 relative z-10">
            <div className="space-y-2">
              <Label htmlFor="entry-id" className="text-sm font-semibold text-[#1a1a1a] ml-1">
                {config.label}
              </Label>
              <div className="relative">
                <Input
                  id="entry-id"
                  placeholder={config.placeholder}
                  value={value}
                  onChange={(e) => setValue(e.target.value.toUpperCase())}
                  className={`h-12 bg-[#F9F7F2] border-[rgba(139,0,74,0.1)] focus:border-[#8B004A] focus:ring-2 focus:ring-[#8B004A]/10 rounded-xl transition-all ${
                    error ? "border-red-500" : ""
                  }`}
                  autoFocus
                />
              </div>
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-500 text-xs flex items-center gap-1 mt-1 ml-1"
                  >
                    <AlertCircle className="w-3 h-3" /> {error}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-[#8B004A] to-[#C4006A] hover:from-[#6B0039] hover:to-[#8B004A] text-white font-bold rounded-xl shadow-lg shadow-[#8B004A]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Access Dashboard
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
