/**
 * ══════════════════════════════════════════════
 *  VAMA — Service Layer (barrel export)
 *
 *  Usage example:
 *    import { loginUser, getActiveShipments, connectTracking } from "@/services";
 * ══════════════════════════════════════════════
 */

export { default as api } from "./api";

export {
  loginUser,
  registerUser,
  logoutUser,
  verifyToken,
  refreshToken,
} from "./authService";

export {
  getUserProfile,
  updateUserProfile,
  changePassword,
  getUsersByRole,
} from "./userService";

export {
  getShipmentByOrderId,
  getActiveShipments,
  updateShipmentStatus,
  getOrders,
  getOrderById,
  getWarehouses,
  getSuppliers,
  getReceivers,
  getInventory,
  updateInventoryItem,
  addInventoryItem,
  deleteInventoryItem,
} from "./shipmentService";

export {
  connectTracking,
  disconnectTracking,
  subscribeToShipment,
  subscribeToDriverLocation,
  publishDriverLocation,
  subscribeToNotifications,
} from "./trackingService";
