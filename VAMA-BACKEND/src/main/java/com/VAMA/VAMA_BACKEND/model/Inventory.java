package com.VAMA.VAMA_BACKEND.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Document(collection = "inventory")
public class Inventory {

    @Id
    private String id;

    @Indexed
    private String warehouseId;
    private String category;         // category ID used in /api/inventory/{catId}/items

    private List<InventoryItem> items;

    private LocalDateTime updatedAt;

    @Data
    public static class InventoryItem {
        private String id;
        private String name;
        private int quantity;
        private String unit;
        private Double price;
        private String sku;
    }
}