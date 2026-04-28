import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { AlertTriangle, Truck, PackageCheck, Boxes, ShoppingCart, Package, Settings, Info } from "lucide-react"
// TODO: uncomment when backend is ready
// import { subscribeToNotifications, connectTracking } from "../../services/trackingService";

export interface Notification {
  id: string
  title: string
  message: string
  time: string
  icon: any // React.ElementType
  iconColor: string
  read: boolean
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  markRead: (id: string) => void
  markAllRead: () => void
  clearAll: () => void
  addNotification: (notif: Omit<Notification, "id" | "time" | "read">) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

// TODO: replace with backend API
// Endpoint: GET /api/notifications (initial load)
// WebSocket: /topic/notifications/{userId} (real-time)
const WAREHOUSE_NOTIFS: Notification[] = [
  { 
    id: "1", 
    title: "Low Stock Alert", 
    message: "Critical Warning: 3 items need restocking in A-Block (Furniture, Electronics, Apparel).", 
    time: "2 min ago", 
    icon: AlertTriangle, 
    iconColor: "text-amber-600 bg-amber-50", 
    read: false 
  },
  { 
    id: "2", 
    title: "Inbound Shipment", 
    message: "Shipment #VMA-402 is expected today at 4:00 PM with 120 units.", 
    time: "45 min ago", 
    icon: Truck, 
    iconColor: "text-blue-600 bg-blue-50", 
    read: false 
  },
  { 
    id: "3", 
    title: "Quality Check", 
    message: "Batch #QC-889 has passed inspection. 480 units moved to active inventory.", 
    time: "2 hours ago", 
    icon: PackageCheck, 
    iconColor: "text-emerald-600 bg-emerald-50", 
    read: false 
  },
  { 
    id: "4", 
    title: "System Update", 
    message: "New feature: Automated sorting logic is now active for all incoming pallets.", 
    time: "5 hours ago", 
    icon: Info, 
    iconColor: "text-violet-600 bg-violet-50", 
    read: true 
  },
  { 
    id: "5", 
    title: "Dispatch confirmed", 
    message: "Order #VMA-2024-XP has been successfully loaded for delivery.", 
    time: "Yesterday", 
    icon: ShoppingCart, 
    iconColor: "text-cyan-600 bg-cyan-50", 
    read: true 
  },
]

const DEFAULT_NOTIFS: Notification[] = [
  { id: "1", title: "Welcome to VAMA", message: "Start by exploring your fresh new dashboard.", time: "10 min ago", icon: Info, iconColor: "text-primary bg-primary/10", read: false },
  { id: "2", title: "Security Notice", message: "New login detected from Mumbai, India.", time: "3 hours ago", icon: Settings, iconColor: "text-amber-600 bg-amber-50", read: true },
]

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    const role = sessionStorage.getItem("userRole")
    setNotifications(role === "warehouse" ? WAREHOUSE_NOTIFS : DEFAULT_NOTIFS)

    // TODO: connect to WebSocket for real-time notifications
    // const userId = sessionStorage.getItem("userId");
    // if (userId) {
    //   connectTracking();
    //   const unsubscribe = subscribeToNotifications(userId, (notif) => {
    //     addNotification(notif);
    //   });
    //   return () => unsubscribe();
    // }
  }, [])

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const clearAll = () => {
    setNotifications([])
  }

  const addNotification = (notif: Omit<Notification, "id" | "time" | "read">) => {
    const newNotif: Notification = {
      ...notif,
      id: Math.random().toString(36).substr(2, 9),
      time: "Just now",
      read: false
    }
    setNotifications(prev => [newNotif, ...prev])
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markRead, markAllRead, clearAll, addNotification }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}
