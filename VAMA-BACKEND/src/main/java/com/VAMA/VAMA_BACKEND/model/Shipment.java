package com.VAMA.VAMA_BACKEND.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Document(collection = "shipments")
public class Shipment {

    @Id
    private String id;

    @Indexed
    private String orderId;

    @Indexed
    private String status = "PENDING";

    @Indexed
    private String driverId;

    private String deliveryBoyId;
    private String warehouseId;
    private String supplierId;
    private String receiverId;

    private int progress = 0;            // 0-100 percentage
    private String delayReason;

    private Location currentLocation;
    private Location origin;
    private Location destination;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt;
    private LocalDateTime estimatedDelivery;

    @Data
    public static class Location {
        private double lat;
        private double lng;
        private String address;
    }
}