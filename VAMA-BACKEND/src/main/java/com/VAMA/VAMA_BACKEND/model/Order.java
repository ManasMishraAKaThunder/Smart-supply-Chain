package com.VAMA.VAMA_BACKEND.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Document(collection = "orders")
public class Order {

    @Id
    private String id;

    @Indexed
    private String supplierId;

    @Indexed
    private String receiverId;

    @Indexed
    private String customerId;

    private String warehouseId;

    @Indexed
    private String status;           // e.g. CREATED, PROCESSING, SHIPPED, DELIVERED, CANCELLED
    private String category;

    private List<OrderItem> items;
    private Double totalAmount;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    public static class OrderItem {
        private String itemId;
        private String name;
        private int quantity;
        private Double unitPrice;
    }
}