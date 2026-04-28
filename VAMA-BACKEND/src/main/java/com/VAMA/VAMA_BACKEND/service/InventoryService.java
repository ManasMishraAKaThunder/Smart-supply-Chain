package com.VAMA.VAMA_BACKEND.service;

import com.VAMA.VAMA_BACKEND.exception.ResourceNotFoundException;
import com.VAMA.VAMA_BACKEND.model.Inventory;
import com.VAMA.VAMA_BACKEND.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;

    /**
     * Get all inventory records (optionally filtered by warehouseId).
     */
    public List<Inventory> getAll(String warehouseId) {
        if (warehouseId != null && !warehouseId.isBlank()) {
            return inventoryRepository.findByWarehouseId(warehouseId);
        }
        return inventoryRepository.findAll();
    }

    /**
     * Add a new item to a category.
     */
    public Inventory addItem(String catId, Inventory.InventoryItem newItem) {
        Inventory inv = inventoryRepository.findById(catId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Inventory category", "id", catId));

        newItem.setId(UUID.randomUUID().toString());
        inv.getItems().add(newItem);
        inv.setUpdatedAt(LocalDateTime.now());

        Inventory saved = inventoryRepository.save(inv);
        log.info("Item '{}' added to category {}", newItem.getName(), catId);
        return saved;
    }

    /**
     * Update an item within a category.
     */
    public Inventory updateItem(String catId, String itemId,
                                Inventory.InventoryItem updated) {
        Inventory inv = inventoryRepository.findById(catId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Inventory category", "id", catId));

        inv.getItems().removeIf(i -> i.getId().equals(itemId));
        updated.setId(itemId);
        inv.getItems().add(updated);
        inv.setUpdatedAt(LocalDateTime.now());

        Inventory saved = inventoryRepository.save(inv);
        log.info("Item {} updated in category {}", itemId, catId);
        return saved;
    }

    /**
     * Delete an item from a category.
     */
    public void deleteItem(String catId, String itemId) {
        Inventory inv = inventoryRepository.findById(catId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Inventory category", "id", catId));

        inv.getItems().removeIf(i -> i.getId().equals(itemId));
        inv.setUpdatedAt(LocalDateTime.now());
        inventoryRepository.save(inv);
        log.info("Item {} deleted from category {}", itemId, catId);
    }
}
