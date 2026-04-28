import { ReactNode, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import {
  Bell, User, LogOut, Settings, Menu, X,
  ChevronDown, Mail, Sun, Moon,
} from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "../context/ThemeContext";
import { NotificationPanel } from "./ui/NotificationPanel";
import { useNotifications } from "../context/NotificationContext";
import { useClickOutside } from "../../hooks";
import { getMenuForRole } from "../../data/menuConfig";

// ===== TYPES =====
interface DashboardLayoutProps {
  children: ReactNode;
  role: string;
  orderId?: string;
  activeMenu?: string;
  onMenuClick?: (id: string) => void;
}

// ===== COMPONENT =====
export default function DashboardLayout({ children, role, orderId, activeMenu: controlledMenu, onMenuClick }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const { theme, toggleTheme, isDark } = useTheme();

  // ===== SESSION DATA =====
  const isWarehouse = role === "warehouse";
  const userName = sessionStorage.getItem("userName") || "Admin User";
  const userEmail = sessionStorage.getItem("userEmail") || "admin@supplychain.com";
  const warehouseCode = sessionStorage.getItem("warehouseCode") || "";

  // ===== THEME-REACTIVE BRAND COLORS =====
  const C = {
    primary:       isDark ? "#E8739E" : "#8B004A",
    primaryDark:   isDark ? "#C4006A" : "#6B0039",
    primaryLight:  isDark ? "#F5AEC8" : "#C4006A",
    bg:            isDark ? "#0F0F10" : "#F2EFE7",
    bgWhite:       isDark ? "#1A1A1D" : "#FFFFFF",
    textDark:      isDark ? "#F0F0F0" : "#1a1a1a",
    textMuted:     isDark ? "#9CA3AF" : "#6b6b6b",
    border:        isDark ? "rgba(255,255,255,0.08)" : "rgba(139,0,74,0.10)",
    gradientCSS:   "linear-gradient(135deg, #8B004A, #C4006A)",
  };

  // ===== STATE =====
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);
  const [internalMenu, setInternalMenu] = useState("dashboard");
  const { notifications, unreadCount, markRead, markAllRead, clearAll } = useNotifications();

  // ===== MENU NAVIGATION =====
  const activeMenu = controlledMenu ?? internalMenu;
  const handleMenuClick = (id: string) => {
    if (onMenuClick) onMenuClick(id);
    else {
      if (id === "notifications") navigate("/notifications");
      else setInternalMenu(id);
    }
    setSidebarOpen(false);
  };

  // ===== CLICK-OUTSIDE REFS =====
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  useClickOutside(profileRef, () => setProfileOpen(false));
  useClickOutside(notifRef, () => setNotifOpen(false));

  // ===== MENU ITEMS (from shared config) =====
  const menuItems = getMenuForRole(role);

  // ===== HELPERS =====
  const getRoleTitle = () => role.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  const handleLogout = () => { sessionStorage.clear(); navigate("/"); };
  const handleViewAll = () => { setNotifOpen(false); navigate("/notifications"); };

  const currentItem = menuItems.find((m) => m.id === activeMenu);
  const pageTitle = activeMenu === "profile" ? "Profile" : activeMenu === "settings" ? "Account Settings" : currentItem?.label || "Dashboard";

  // ===== UI =====
  return (
    <div className="min-h-screen transition-colors duration-300" style={{ background: C.bg }}>

      {/* ===== SIDEBAR ===== */}
      <aside className={`fixed left-0 top-0 h-full w-64 z-50 transition-transform duration-300 ease-out sidebar-light ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        style={{ background: C.bgWhite, borderRight: `1px solid ${C.border}`, boxShadow: isDark ? "2px 0 20px rgba(0,0,0,0.4)" : "2px 0 20px rgba(139,0,74,0.06)" }}>
        <div className="flex flex-col h-full">

          {/* Logo + role */}
          <div className="p-6" style={{ borderBottom: `1px solid ${C.border}` }}>
            <div className="flex items-center gap-3">
              <img 
                src="/vama-logo.png" 
                alt="VAMA Logo" 
                className={`h-9 w-auto object-contain transition-all duration-300 ${isDark ? "invert brightness-200" : "mix-blend-multiply"}`} 
              />
              <div>
                <p className="text-xs font-medium" style={{ color: C.textMuted }}>{getRoleTitle()}</p>
              </div>
            </div>
            {isWarehouse && warehouseCode && (
              <div className="mt-3 px-3 py-1.5 rounded-lg" style={{ background: `${C.primary}12`, border: `1px solid ${C.primary}20` }}>
                <p className="text-[10px] uppercase tracking-wider" style={{ color: C.textMuted }}>Warehouse ID</p>
                <p className="text-sm font-mono font-semibold" style={{ color: C.primary }}>{warehouseCode}</p>
              </div>
            )}
          </div>

          {/* Nav items */}
          <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
            <p className="text-[10px] uppercase tracking-wider px-3 mb-2 mt-1 font-semibold" style={{ color: C.textMuted + "80" }}>Navigation</p>
            {menuItems.map((item) => {
              const isActive = activeMenu === item.id;
              return (
                <button key={item.id} onClick={() => handleMenuClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group`}
                  style={{
                    background: isActive ? C.gradientCSS : "transparent",
                    color: isActive ? "#FFFFFF" : C.textMuted,
                    boxShadow: isActive ? `0 4px 16px ${C.primary}25` : "none",
                  }}
                  onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = `${C.primary}12`; e.currentTarget.style.color = C.primary; } }}
                  onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.textMuted; } }}
                >
                  <item.icon className="w-[18px] h-[18px] transition-transform duration-200 group-hover:scale-110" />
                  <span className="text-sm font-medium">{item.label}</span>
                  {item.id === "low-stock" && isWarehouse && (
                    <span className="ml-auto text-[10px] rounded-full px-2 py-0.5 font-bold"
                      style={{ background: "#FEF3C7", color: "#D97706" }}>3</span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-3" style={{ borderTop: `1px solid ${C.border}` }}>
            <button onClick={() => setLogoutModal(true)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group text-red-500/70 hover:bg-red-50 hover:text-red-500"
              style={{ ...(isDark && { color: "#FC8181" }) }}>
              <LogOut className="w-[18px] h-[18px] group-hover:scale-110 transition-transform duration-200" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>

        <button onClick={() => setSidebarOpen(false)} className="lg:hidden absolute top-5 right-4 p-1 rounded-lg transition-all"
          style={{ color: C.textMuted }}>
          <X className="w-5 h-5" />
        </button>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <div className="lg:ml-64">

        {/* ===== TOP NAVBAR ===== */}
        <motion.header initial={{ y: -100 }} animate={{ y: 0 }}
          className="sticky top-0 z-40 transition-colors duration-300"
          style={{ background: C.bgWhite.replace(")", ", 0.92)").replace("rgb", "rgba").replace("#1A1A1D", "rgba(26,26,29,0.92)").replace("#FFFFFF", "rgba(255,255,255,0.88)"), backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderBottom: `1px solid ${C.border}` }}>
          <div className="flex items-center justify-between px-4 md:px-6 h-16">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl transition-all active:scale-95"
                style={{ color: C.textMuted }}
                onMouseEnter={(e) => (e.currentTarget.style.background = `${C.primary}12`)}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-lg font-semibold leading-tight" style={{ color: C.textDark }}>{pageTitle}</h1>
                {isWarehouse && warehouseCode ? (
                  <p className="text-xs font-mono" style={{ color: C.textMuted }}>{warehouseCode}</p>
                ) : orderId ? (
                  <p className="text-xs" style={{ color: C.textMuted }}>Order: {orderId}</p>
                ) : null}
              </div>
            </div>

            <div className="flex items-center gap-1 md:gap-2">

              {/* ── Theme Toggle ── */}
              <motion.button
                onClick={toggleTheme}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                className="relative p-2.5 rounded-xl transition-all active:scale-95 overflow-hidden"
                style={{ color: C.textMuted }}
                onMouseEnter={(e) => { e.currentTarget.style.background = `${C.primary}12`; e.currentTarget.style.color = C.primary; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.textMuted; }}
              >
                <AnimatePresence mode="wait">
                  {isDark ? (
                    <motion.span key="sun"
                      initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                      animate={{ opacity: 1, rotate: 0, scale: 1 }}
                      exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                      transition={{ duration: 0.2 }}
                      className="block"
                    >
                      <Sun className="w-5 h-5" />
                    </motion.span>
                  ) : (
                    <motion.span key="moon"
                      initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
                      animate={{ opacity: 1, rotate: 0, scale: 1 }}
                      exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
                      transition={{ duration: 0.2 }}
                      className="block"
                    >
                      <Moon className="w-5 h-5" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* ── Notification Bell ── */}
              <div ref={notifRef} className="relative">
                <button
                  onClick={() => { setNotifOpen((v) => !v); setProfileOpen(false); }}
                  className="relative p-2.5 rounded-xl transition-all active:scale-95"
                  style={{ color: C.textMuted }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = `${C.primary}12`; e.currentTarget.style.color = C.primary; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.textMuted; }}
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] flex items-center justify-center text-white text-[10px] font-bold rounded-full px-1"
                      style={{ background: "#8B004A" }}>
                      {unreadCount}
                    </motion.span>
                  )}
                </button>

                <AnimatePresence>
                  {notifOpen && (
                    <NotificationPanel 
                      notifications={notifications}
                      onMarkAllRead={markAllRead}
                      onClearAll={clearAll}
                      onMarkRead={markRead}
                      onViewAll={handleViewAll}
                      onClose={() => setNotifOpen(false)}
                      isDark={isDark}
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* ── Profile Dropdown ── */}
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => { setProfileOpen((v) => !v); setNotifOpen(false); }}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-xl transition-all active:scale-[0.97]"
                  onMouseEnter={(e) => (e.currentTarget.style.background = `#8B004A08`)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-md"
                    style={{ background: C.gradientCSS }}>
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm hidden md:block font-medium max-w-[100px] truncate" style={{ color: C.textDark }}>{userName}</span>
                  <ChevronDown className={`w-3.5 h-3.5 hidden md:block transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} style={{ color: C.textMuted }} />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div initial={{ opacity: 0, y: 8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.96 }} transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-2 w-72 rounded-2xl overflow-hidden"
                      style={{ background: C.bgWhite, border: `1px solid ${C.border}`, boxShadow: isDark ? "0 16px 48px rgba(0,0,0,0.5)" : "0 16px 48px rgba(139,0,74,0.1), 0 2px 8px rgba(0,0,0,0.05)" }}>

                      {/* Profile header */}
                      <div className="p-4" style={{ borderBottom: `1px solid ${C.border}` }}>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                            style={{ background: C.gradientCSS }}>
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate" style={{ color: C.textDark }}>{userName}</p>
                            <div className="flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3" style={{ color: C.textMuted }} />
                              <p className="text-xs truncate" style={{ color: C.textMuted }}>{userEmail}</p>
                            </div>
                            <span className="inline-block mt-1.5 text-[10px] font-semibold rounded-full px-2 py-0.5"
                              style={{ background: `#8B004A10`, color: "#8B004A", border: "1px solid #8B004A20" }}>
                              {getRoleTitle()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Profile actions */}
                      <div className="p-2">
                        <button onClick={() => { handleMenuClick("profile"); setProfileOpen(false); }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm"
                          style={{ color: C.textMuted }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = `#8B004A08`; e.currentTarget.style.color = "#8B004A"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.textMuted; }}>
                          <User className="w-4 h-4" />View Profile
                        </button>
                        <button onClick={() => { handleMenuClick("settings"); setProfileOpen(false); }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm"
                          style={{ color: C.textMuted }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = `#8B004A08`; e.currentTarget.style.color = "#8B004A"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.textMuted; }}>
                          <Settings className="w-4 h-4" />Account Settings
                        </button>

                        {/* Theme toggle inside profile menu */}
                        <button onClick={toggleTheme}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm"
                          style={{ color: C.textMuted }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = `#8B004A08`; e.currentTarget.style.color = "#8B004A"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.textMuted; }}>
                          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                          {isDark ? "Light Mode" : "Dark Mode"}
                        </button>
                      </div>

                      {/* Sign out */}
                      <div className="p-2" style={{ borderTop: `1px solid ${C.border}` }}>
                        <button onClick={() => { setProfileOpen(false); setLogoutModal(true); }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm"
                          style={{ color: isDark ? "#FC8181" : "#ef4444" }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.08)")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                          <LogOut className="w-4 h-4" />Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.header>

        {/* ===== PAGE CONTENT ===== */}
        <main className="relative z-10 p-4 md:p-6">
          <div className={`dashboard ${isDark ? "dark-theme" : "light-theme"}`}>
            {children}
          </div>
        </main>
      </div>

      {/* ===== MOBILE SIDEBAR OVERLAY ===== */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40" />
        )}
      </AnimatePresence>

      {/* ===== LOGOUT CONFIRMATION MODAL ===== */}
      <AnimatePresence>
        {logoutModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/25 backdrop-blur-sm"
            onClick={() => setLogoutModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.25, type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
              style={{ background: C.bgWhite, border: `1px solid ${C.border}` }}>
              <div className="p-6 text-center">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.2)" }}>
                  <LogOut className="w-7 h-7 text-red-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: C.textDark }}>Sign Out?</h3>
                <p className="text-sm" style={{ color: C.textMuted }}>
                  Are you sure you want to sign out of your {getRoleTitle()} dashboard?
                </p>
              </div>
              <div className="flex gap-3 p-4 pt-0">
                <Button onClick={() => setLogoutModal(false)} variant="outline" className="flex-1 rounded-xl"
                  style={{ borderColor: C.border, color: C.textDark, background: "transparent" }}>
                  Cancel
                </Button>
                <Button onClick={handleLogout} className="flex-1 rounded-xl text-white"
                  style={{ background: "linear-gradient(135deg, #dc2626, #ef4444)", boxShadow: "0 4px 16px rgba(220,38,38,0.25)" }}>
                  Sign Out
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
