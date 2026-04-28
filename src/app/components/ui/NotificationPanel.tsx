import React from "react"
import { motion, AnimatePresence } from "motion/react"
import { Check, Clock, Eye, Trash2 } from "lucide-react"
import { cn } from "./utils"

interface Notification {
  id: string
  title: string
  message: string
  time: string
  icon: React.ElementType
  iconColor: string
  read: boolean
}

interface NotificationPanelProps {
  notifications: Notification[]
  onMarkAllRead: () => void
  onClearAll: () => void
  onMarkRead: (id: string) => void
  onViewAll: () => void
  onClose: () => void
  isDark?: boolean
}

export const NotificationPanel = ({
  notifications,
  onMarkAllRead,
  onClearAll,
  onMarkRead,
  onViewAll,
  onClose,
  isDark = true,
}: NotificationPanelProps) => {
  const unreadCount = notifications.filter((n) => !n.read).length

  const containerVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300,
        staggerChildren: 0.05,
      },
    },
    exit: { opacity: 0, y: 10, scale: 0.95, transition: { duration: 0.2 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 10, transition: { duration: 0.2 } },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={cn(
        "absolute right-0 top-full mt-3 w-80 md:w-[400px] rounded-[2rem] overflow-hidden shadow-[0_20px_60px_-10px_rgba(0,0,0,0.5)] z-[100]",
        isDark 
          ? "bg-[#1A1A1D] border border-white/10" 
          : "bg-white border border-black/5"
      )}
    >
      {/* Header */}
      <div className="p-6 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-2">
          <h3 className={cn("text-lg font-bold", isDark ? "text-white" : "text-gray-900")}>
            Notifications
          </h3>
          {unreadCount > 0 && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-2.5 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-black uppercase tracking-wider"
            >
              {unreadCount} new
            </motion.span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={onMarkAllRead}
            className="flex items-center gap-1.5 text-xs font-bold text-primary/80 hover:text-primary transition-all group"
          >
            <Check className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Mark all read</span>
          </button>
          <button
            onClick={onClearAll}
            className="p-1 px-2.5 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.1em] text-red-500/60 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>
        </div>
      </div>

      {/* List Area */}
      <div className="max-h-[440px] overflow-y-auto custom-scrollbar bg-transparent">
        <AnimatePresence mode="popLayout" initial={false}>
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <motion.div
                key={notif.id}
                variants={itemVariants}
                layout
                className={cn(
                  "p-6 flex gap-5 transition-all cursor-pointer group relative border-b border-white/5 last:border-0",
                  !notif.read ? "bg-primary/[0.03]" : "hover:bg-white/[0.02]"
                )}
                onClick={() => onMarkRead(notif.id)}
              >
                {/* Icon Circle */}
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg transition-transform group-hover:scale-105",
                  notif.iconColor
                )}>
                  <notif.icon className="w-6 h-6" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <h4 className={cn(
                      "text-base font-bold truncate",
                      isDark ? "text-white/90" : "text-gray-800"
                    )}>
                      {notif.title}
                    </h4>
                    {!notif.read && (
                      <span className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_12px_rgba(139,0,74,0.6)]" />
                    )}
                  </div>
                  <p className={cn(
                    "text-xs leading-relaxed line-clamp-2 font-medium",
                    isDark ? "text-white/40" : "text-gray-500"
                  )}>
                    {notif.message}
                  </p>
                  <div className="mt-3 flex items-center gap-2 opacity-50">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{notif.time}</span>
                  </div>
                </div>

                {/* Hover Action Indicator */}
                <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
                   <button 
                    onClick={(e) => { e.stopPropagation(); onMarkRead(notif.id); }}
                    className="p-3 rounded-2xl bg-primary/10 hover:bg-primary/20 transition-colors"
                   >
                    <Eye className="w-5 h-5 text-primary" />
                   </button>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-16 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-white/10" />
              </div>
              <p className="text-sm text-white/20 font-bold uppercase tracking-widest">Inbox is clear</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-6 border-t border-white/5 bg-transparent">
          <button 
            onClick={onViewAll}
            className="w-full py-4 rounded-full text-sm font-black text-white bg-primary hover:bg-primary/90 shadow-[0_8px_20px_-5px_rgba(139,0,74,0.4)] transition-all flex items-center justify-center gap-2 group active:scale-[0.98]"
          >
            View all notifications
            <motion.span 
              animate={{ x: [0, 4, 0] }} 
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              →
            </motion.span>
          </button>
        </div>
      )}
    </motion.div>
  )
}
