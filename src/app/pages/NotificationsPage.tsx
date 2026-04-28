

import React from "react"
import { motion, AnimatePresence } from "motion/react"
import { Bell, Check, Trash2, Clock, Inbox } from "lucide-react"
import DashboardLayout from "../components/DashboardLayout"
import { useNotifications } from "../context/NotificationContext"
import { cn } from "../components/ui/utils"

export default function NotificationsPage() {
  const { notifications, markRead, markAllRead, clearAll } = useNotifications()
  const role = sessionStorage.getItem("userRole") || "guest"

  return (
    <DashboardLayout role={role} activeMenu="notifications">
      <div className="max-w-4xl mx-auto py-12 px-6">
        {/* Background Decorative Elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[100px]" />
        </div>

        {/* Header */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">Notifications</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter">
              Inbox <span className="text-primary">Center</span>
            </h1>
            <p className="text-muted-foreground mt-3 text-lg font-medium">Keep track of your supply chain events and system updates.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={markAllRead}
              className="px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-bold hover:bg-primary/20 transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Mark all read
            </button>
            <button
              onClick={clearAll}
              className="px-4 py-2 rounded-xl bg-red-500/10 text-red-500 text-sm font-bold hover:bg-red-500/20 transition-all flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear all
            </button>
          </div>
        </div>

        {/* List */}
        <div className="relative z-10 space-y-4">
          <AnimatePresence mode="popLayout">
            {notifications.length > 0 ? (
              notifications.map((notif, i) => (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ delay: i * 0.05, type: "spring", damping: 25 }}
                  className={cn(
                    "relative group bg-card/40 backdrop-blur-sm border border-border rounded-[2rem] p-8 transition-all hover:shadow-2xl hover:bg-card hover:border-primary/30",
                    !notif.read && "shadow-[0_8px_30px_rgb(139,0,74,0.08)] border-primary/20"
                  )}
                >
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className={cn(
                      "w-16 h-16 rounded-[1.25rem] flex items-center justify-center shrink-0 shadow-lg transform transition-transform group-hover:scale-110 group-hover:rotate-3",
                      notif.iconColor
                    )}>
                      <notif.icon className="w-7 h-7" />
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                        <h3 className={cn(
                          "text-xl font-bold tracking-tight",
                          notif.read ? "text-foreground/50" : "text-foreground"
                        )}>
                          {notif.title}
                        </h3>
                        <div className="flex items-center gap-4">
                          <span className="text-xs font-bold text-muted-foreground/60 flex items-center gap-1.5 uppercase tracking-wider">
                            <Clock className="w-3.5 h-3.5" />
                            {notif.time}
                          </span>
                        </div>
                      </div>
                      <p className={cn(
                        "text-base leading-relaxed max-w-2xl",
                        notif.read ? "text-muted-foreground/50 font-medium" : "text-muted-foreground font-semibold"
                      )}>
                        {notif.message}
                      </p>
                      
                      <div className="mt-6 flex items-center gap-4">
                        {!notif.read && (
                          <button 
                            onClick={() => markRead(notif.id)}
                            className="px-4 py-2 rounded-xl bg-primary text-[10px] font-black uppercase tracking-widest text-white hover:bg-primary/90 transition-all shadow-md active:scale-95"
                          >
                            Mark Read
                          </button>
                        )}
                        <button 
                          className="p-2 rounded-xl hover:bg-accent transition-colors text-muted-foreground hover:text-red-500"
                          title="Delete notification"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-20 text-center bg-card border border-dashed border-border rounded-[2.5rem]"
              >
                <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center mx-auto mb-6">
                  <Inbox className="w-10 h-10 text-muted-foreground/40" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Your inbox is clear!</h3>
                <p className="text-muted-foreground">You don't have any notifications at the moment.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  )
}
