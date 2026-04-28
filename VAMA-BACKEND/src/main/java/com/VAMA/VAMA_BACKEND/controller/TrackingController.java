package com.VAMA.VAMA_BACKEND.controller;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class TrackingController {

    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/driver/{driverId}/location")
    public void updateDriverLocation(
            @DestinationVariable String driverId,
            LocationUpdate location) {
        messagingTemplate.convertAndSend(
                "/topic/driver/" + driverId + "/location", location);
    }

    public void broadcastShipmentUpdate(String shipmentId, Object update) {
        messagingTemplate.convertAndSend(
                "/topic/shipment/" + shipmentId, update);
    }

    public void sendNotification(String userId, Object notification) {
        messagingTemplate.convertAndSend(
                "/topic/notifications/" + userId, notification);
    }

    @Data
    public static class LocationUpdate {
        private double lat;
        private double lng;
        private long timestamp;
    }
}