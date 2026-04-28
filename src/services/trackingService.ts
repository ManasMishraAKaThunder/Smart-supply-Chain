/**
 * ══════════════════════════════════════════════
 *  VAMA — Real-time Tracking Service
 *  Spring Boot WebSocket endpoint
 *
 *  Protocol : STOMP over WebSocket (via SockJS)
 *  Topics   : /topic/shipment/{shipmentId}
 *             /topic/driver/{driverId}/location
 *             /topic/notifications/{userId}
 * ══════════════════════════════════════════════
 */

import { Client, IFrame } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const WS_URL =
  import.meta.env.VITE_WS_BASE_URL || "http://localhost:8080/ws";

/* ── Types ──────────────────────────────────── */
export interface LocationUpdate {
  shipmentId: string;
  lat: number;
  lng: number;
  speed: number;
  heading: number;
  timestamp: string;
}

export interface ShipmentUpdate {
  shipmentId: string;
  status: string;
  progress: number;
  eta: string;
  delayReason?: string;
  location?: LocationUpdate;
}

type ShipmentCallback = (update: ShipmentUpdate) => void;
type LocationCallback = (update: LocationUpdate) => void;

let stompClient: Client | null = null;

/** Establish WebSocket connection to the tracking server */
export const connectTracking = (): void => {
  stompClient = new Client({
    webSocketFactory: () => new SockJS(WS_URL) as WebSocket,
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    onStompError: (_frame: IFrame) => {
      // Silently handle STOMP errors — reconnect is automatic
    },
  });
  stompClient.activate();
};

/** Disconnect from tracking server */
export const disconnectTracking = (): void => {
  stompClient?.deactivate();
  stompClient = null;
};

/** Subscribe to real-time shipment status updates */
export const subscribeToShipment = (
  shipmentId: string,
  callback: ShipmentCallback
): (() => void) => {
  const subscription = stompClient?.subscribe(
    `/topic/shipment/${shipmentId}`,
    (message) => {
      const update: ShipmentUpdate = JSON.parse(message.body);
      callback(update);
    }
  );
  return () => subscription?.unsubscribe();
};

/** Subscribe to driver location updates (for map markers) */
export const subscribeToDriverLocation = (
  driverId: string,
  callback: LocationCallback
): (() => void) => {
  const subscription = stompClient?.subscribe(
    `/topic/driver/${driverId}/location`,
    (message) => {
      const update: LocationUpdate = JSON.parse(message.body);
      callback(update);
    }
  );
  return () => subscription?.unsubscribe();
};

/** Send driver's current location to the server */
export const publishDriverLocation = (
  driverId: string,
  lat: number,
  lng: number
): void => {
  stompClient?.publish({
    destination: `/app/driver/${driverId}/location`,
    body: JSON.stringify({ lat, lng, timestamp: new Date().toISOString() }),
  });
};

/** Subscribe to real-time notifications */
export const subscribeToNotifications = (
  userId: string,
  callback: (notification: unknown) => void
): (() => void) => {
  const subscription = stompClient?.subscribe(
    `/topic/notifications/${userId}`,
    (message) => callback(JSON.parse(message.body))
  );
  return () => subscription?.unsubscribe();
};
