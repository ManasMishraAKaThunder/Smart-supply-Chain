import { ReactNode, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import {
  Bell, User, LogOut, Home, Package, Settings, BarChart3, Menu, X,
  Warehouse, AlertTriangle, Truck, PackageCheck, ShoppingCart, PlusCircle,
  ChevronDown, Mail, Clock, Check, Boxes, Users, ShoppingBag,
} from "lucide-react";
import { Button } from "./ui/button";

/* ═══ TYPES ═══ */
interface DashboardLayoutProps {
  children: ReactNode;
  role: string;
  orderId?: string;
  activeMenu?: string;
  onMenuClick?: (id: string) => void;
}

interface Notification {
  id: string; title: string; message: string; time: string;
  icon: React.ElementType; iconColor: string; read: boolean;
}

/* ═══ NOTIFICATIONS ═══ */
const warehouseNotifications: Notification[] = [
  { id: "1", title: "Low Stock Alert", message: "Clothing stock dropped below 30 units. Consider restocking.", time: "2 min ago", icon: AlertTriangle, iconColor: "text-amber-400 bg-amber-500/15", read: false },
  { id: "2", title: "New Shipment Arrived", message: "Shipment #SHP-4082 with 250 units of Electronics has arrived.", time: "18 min ago", icon: Truck, iconColor: "text-blue-400 bg-blue-500/15", read: false },
  { id: "3", title: "Supplier Response", message: "Supplier MedCorp confirmed restocking of Medical Supplies.", time: "1 hour ago", icon: PackageCheck, iconColor: "text-emerald-400 bg-emerald-500/15", read: false },
  { id: "4", title: "Inventory Update", message: "Monthly inventory audit completed. 3 discrepancies found.", time: "3 hours ago", icon: Boxes, iconColor: "text-violet-400 bg-violet-500/15", read: true },
  { id: "5", title: "Order Dispatched", message: "Order #ORD-2026-089 dispatched to Receiver station B.", time: "5 hours ago", icon: ShoppingCart, iconColor: "text-cyan-400 bg-cyan-500/15", read: true },
];
const defaultNotifications: Notification[] = [
  { id: "1", title: "Order Update", message: "Your order status has been updated.", time: "5 min ago", icon: Package, iconColor: "text-blue-400 bg-blue-500/15", read: false },
  { id: "2", title: "System Notice", message: "Scheduled maintenance tonight at 2:00 AM.", time: "1 hour ago", icon: Settings, iconColor: "text-amber-400 bg-amber-500/15", read: true },
];

/* ═══ SIDEBAR MENUS ═══ */
const warehouseMenu = [
  { icon: Home, label: "Dashboard", id: "dashboard" },
  { icon: Boxes, label: "Inventory", id: "inventory" },
  { icon: AlertTriangle, label: "Low Stock Alerts", id: "low-stock" },
  { icon: Users, label: "Suppliers", id: "suppliers" },
  { icon: ShoppingCart, label: "Orders / Shipments", id: "orders" },
  { icon: BarChart3, label: "Analytics", id: "analytics" },
];
const supplierMenu = [
  { icon: Home, label: "Dashboard", id: "dashboard" },
  { icon: Warehouse, label: "Warehouses", id: "warehouses" },
  { icon: Users, label: "Receivers", id: "receivers" },
];
const receiverMenu = [
  { icon: Home, label: "Dashboard", id: "dashboard" },
  { icon: Warehouse, label: "Warehouses", id: "warehouses" },
  { icon: ShoppingBag, label: "Suppliers", id: "suppliers" },
];
const defaultMenu = [
  { icon: Home, label: "Dashboard", id: "dashboard" },
  { icon: Package, label: "Orders", id: "orders" },
  { icon: BarChart3, label: "Analytics", id: "analytics" },
  { icon: Settings, label: "Settings", id: "settings" },
];

/* ═══ HOOK ═══ */
function useClickOutside(ref: React.RefObject<HTMLElement | null>, handler: () => void) {
  useEffect(() => {
    const fn = (e: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(e.target as Node)) return;
      handler();
    };
    document.addEventListener("mousedown", fn);
    document.addEventListener("touchstart", fn);
    return () => { document.removeEventListener("mousedown", fn); document.removeEventListener("touchstart", fn); };
  }, [ref, handler]);
}

/* ═══════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════ */
export default function DashboardLayout({ children, role, orderId, activeMenu: controlledMenu, onMenuClick }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const isWarehouse = role === "warehouse-holder";
  const userName = sessionStorage.getItem("userName") || "Admin User";
  const userEmail = sessionStorage.getItem("userEmail") || "admin@supplychain.com";
  const warehouseCode = sessionStorage.getItem("warehouseCode") || "";

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);
  const [internalMenu, setInternalMenu] = useState("dashboard");
  const [notifications, setNotifications] = useState<Notification[]>(isWarehouse ? warehouseNotifications : defaultNotifications);

  const activeMenu = controlledMenu ?? internalMenu;
  const handleMenuClick = (id: string) => {
    if (onMenuClick) onMenuClick(id);
    else setInternalMenu(id);
    setSidebarOpen(false);
  };

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  useClickOutside(profileRef, () => setProfileOpen(false));
  useClickOutside(notifRef, () => setNotifOpen(false));

  const unreadCount = notifications.filter((n) => !n.read).length;
  const menuItems = isWarehouse ? warehouseMenu : role === "supplier" ? supplierMenu : role === "receiver" ? receiverMenu : defaultMenu;

  const getRoleTitle = () => role.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  const handleLogout = () => { sessionStorage.clear(); navigate("/"); };
  const markAllRead = () => setNotifications((p) => p.map((n) => ({ ...n, read: true })));
  const markRead = (id: string) => setNotifications((p) => p.map((n) => (n.id === id ? { ...n, read: true } : n)));

  /* ── page title from active menu ── */
  const currentItem = menuItems.find((m) => m.id === activeMenu);
  const pageTitle = activeMenu === "profile" ? "Profile" : activeMenu === "settings" ? "Account Settings" : currentItem?.label || "Dashboard";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />

      {/* ═══ SIDEBAR ═══ */}
      <aside className={`fixed left-0 top-0 h-full w-64 bg-slate-900/90 backdrop-blur-2xl border-r border-white/10 z-50 transition-transform duration-300 ease-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 p-2 shadow-lg shadow-blue-500/20">
                <Warehouse className="w-full h-full text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white leading-tight">Supply Chain</h2>
                <p className="text-xs text-blue-200/50">{getRoleTitle()}</p>
              </div>
            </div>
            {isWarehouse && warehouseCode && (
              <div className="mt-3 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/15">
                <p className="text-[10px] text-blue-200/40 uppercase tracking-wider">Warehouse ID</p>
                <p className="text-sm text-blue-300 font-mono font-semibold">{warehouseCode}</p>
              </div>
            )}
          </div>

          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            <p className="text-[10px] text-blue-200/30 uppercase tracking-wider px-3 mb-2 mt-1">Navigation</p>
            {menuItems.map((item) => {
              const isActive = activeMenu === item.id;
              return (
                <button key={item.id} onClick={() => handleMenuClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${isActive ? "bg-gradient-to-r from-blue-500/20 to-cyan-500/10 text-white border border-blue-400/25 shadow-sm shadow-blue-500/10" : "text-blue-200/60 hover:bg-white/[0.04] hover:text-white"}`}>
                  <item.icon className={`w-[18px] h-[18px] transition-transform duration-200 group-hover:scale-110 ${isActive ? "text-blue-400" : ""}`} />
                  <span className="text-sm font-medium">{item.label}</span>
                  {item.id === "low-stock" && isWarehouse && (
                    <span className="ml-auto text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/25 rounded-full px-2 py-0.5 font-semibold">3</span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="p-3 border-t border-white/10">
            <button onClick={() => setLogoutModal(true)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400/70 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 group">
              <LogOut className="w-[18px] h-[18px] group-hover:scale-110 transition-transform duration-200" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>

        <button onClick={() => setSidebarOpen(false)} className="lg:hidden absolute top-5 right-4 p-1 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-all">
          <X className="w-5 h-5" />
        </button>
      </aside>

      {/* ═══ MAIN ═══ */}
      <div className="lg:ml-64">
        {/* ═══ NAVBAR ═══ */}
        <motion.header initial={{ y: -100 }} animate={{ y: 0 }} className="sticky top-0 z-40 bg-slate-900/70 backdrop-blur-2xl border-b border-white/10">
          <div className="flex items-center justify-between px-4 md:px-6 h-16">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-white/5 text-blue-200/70 hover:text-white transition-all active:scale-95">
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-white leading-tight">{pageTitle}</h1>
                {isWarehouse && warehouseCode ? (
                  <p className="text-xs text-blue-200/40 font-mono">{warehouseCode}</p>
                ) : orderId ? (
                  <p className="text-xs text-blue-200/40">Order: {orderId}</p>
                ) : null}
              </div>
            </div>

            <div className="flex items-center gap-1 md:gap-2">
              {/* BELL */}
              <div ref={notifRef} className="relative">
                <button onClick={() => { setNotifOpen((v) => !v); setProfileOpen(false); }} className="relative p-2.5 rounded-xl hover:bg-white/5 text-blue-200/70 hover:text-white transition-all active:scale-95">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1 shadow-lg shadow-red-500/40">{unreadCount}</motion.span>
                  )}
                </button>
                <AnimatePresence>
                  {notifOpen && (
                    <motion.div initial={{ opacity: 0, y: 8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.96 }} transition={{ duration: 0.2 }} className="absolute right-0 top-full mt-2 w-80 md:w-96 bg-slate-900/95 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl shadow-black/40 overflow-hidden">
                      <div className="flex items-center justify-between p-4 border-b border-white/10">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-white">Notifications</h3>
                          {unreadCount > 0 && <span className="text-[10px] bg-red-500/20 text-red-400 rounded-full px-2 py-0.5 font-semibold">{unreadCount} new</span>}
                        </div>
                        {unreadCount > 0 && <button onClick={markAllRead} className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"><Check className="w-3 h-3" /> Mark all read</button>}
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.map((n) => {
                          const NI = n.icon; return (
                            <button key={n.id} onClick={() => markRead(n.id)} className={`w-full flex items-start gap-3 p-4 hover:bg-white/[0.03] transition-all text-left border-b border-white/5 last:border-0 ${!n.read ? "bg-blue-500/[0.04]" : ""}`}>
                              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${n.iconColor}`}><NI className="w-4 h-4" /></div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2"><p className={`text-sm font-medium truncate ${n.read ? "text-white/70" : "text-white"}`}>{n.title}</p>{!n.read && <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />}</div>
                                <p className="text-xs text-blue-200/40 mt-0.5 line-clamp-2">{n.message}</p>
                                <div className="flex items-center gap-1 mt-1"><Clock className="w-3 h-3 text-blue-200/25" /><span className="text-[10px] text-blue-200/25">{n.time}</span></div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                      <div className="p-3 border-t border-white/10"><button className="w-full text-center text-xs text-blue-400 hover:text-blue-300 transition-colors py-1.5 rounded-lg hover:bg-white/[0.03]">View all notifications</button></div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* PROFILE */}
              <div ref={profileRef} className="relative">
                <button onClick={() => { setProfileOpen((v) => !v); setNotifOpen(false); }} className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-white/5 transition-all active:scale-[0.97]">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-md shadow-blue-500/20"><User className="w-4 h-4 text-white" /></div>
                  <span className="text-sm text-white/80 hidden md:block font-medium max-w-[100px] truncate">{userName}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-blue-200/40 hidden md:block transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div initial={{ opacity: 0, y: 8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.96 }} transition={{ duration: 0.2 }} className="absolute right-0 top-full mt-2 w-72 bg-slate-900/95 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl shadow-black/40 overflow-hidden">
                      <div className="p-4 border-b border-white/10">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/25"><User className="w-6 h-6 text-white" /></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{userName}</p>
                            <div className="flex items-center gap-1 mt-0.5"><Mail className="w-3 h-3 text-blue-200/30" /><p className="text-xs text-blue-200/40 truncate">{userEmail}</p></div>
                            <span className="inline-block mt-1.5 text-[10px] font-semibold bg-gradient-to-r from-blue-500/15 to-cyan-500/15 text-blue-300 border border-blue-500/20 rounded-full px-2 py-0.5">{getRoleTitle()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-2">
                        <button onClick={() => { handleMenuClick("profile"); setProfileOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-blue-200/70 hover:bg-white/[0.04] hover:text-white transition-all text-sm"><User className="w-4 h-4" />View Profile</button>
                        <button onClick={() => { handleMenuClick("settings"); setProfileOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-blue-200/70 hover:bg-white/[0.04] hover:text-white transition-all text-sm"><Settings className="w-4 h-4" />Account Settings</button>
                      </div>
                      <div className="p-2 border-t border-white/10">
                        <button onClick={() => { setProfileOpen(false); setLogoutModal(true); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400/70 hover:bg-red-500/10 hover:text-red-400 transition-all text-sm"><LogOut className="w-4 h-4" />Sign Out</button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.header>

        <main className="relative z-10 p-4 md:p-6">{children}</main>
      </div>

      {/* MOBILE OVERLAY */}
      <AnimatePresence>{sidebarOpen && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSidebarOpen(false)} className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />)}</AnimatePresence>

      {/* LOGOUT MODAL */}
      <AnimatePresence>
        {logoutModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setLogoutModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} transition={{ duration: 0.25, type: "spring", stiffness: 300, damping: 30 }} onClick={(e) => e.stopPropagation()} className="bg-slate-900/95 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl w-full max-w-sm overflow-hidden">
              <div className="p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4"><LogOut className="w-7 h-7 text-red-400" /></div>
                <h3 className="text-xl font-semibold text-white mb-2">Sign Out?</h3>
                <p className="text-blue-200/50 text-sm">Are you sure you want to sign out of your {getRoleTitle()} dashboard?</p>
              </div>
              <div className="flex gap-3 p-4 pt-0">
                <Button onClick={() => setLogoutModal(false)} variant="outline" className="flex-1 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white">Cancel</Button>
                <Button onClick={handleLogout} className="flex-1 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white shadow-lg shadow-red-500/20">Sign Out</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
