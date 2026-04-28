package com.VAMA.VAMA_BACKEND.controller;

import com.VAMA.VAMA_BACKEND.dto.ApiResponse;
import com.VAMA.VAMA_BACKEND.model.Inventory;
import com.VAMA.VAMA_BACKEND.service.InventoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    // GET /api/inventory?warehouseId=X
    @GetMapping
    public ResponseEntity<ApiResponse<List<Inventory>>> getAll(
            @RequestParam(required = false) String warehouseId) {
        return ResponseEntity.ok(
                ApiResponse.ok(inventoryService.getAll(warehouseId)));
    }

    // POST /api/inventory/{catId}/items
    @PostMapping("/{catId}/items")
    public ResponseEntity<ApiResponse<Inventory>> addItem(
            @PathVariable String catId,
            @RequestBody Inventory.InventoryItem newItem) {
        Inventory updated = inventoryService.addItem(catId, newItem);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.ok(updated, "Item added"));
    }

    // PATCH /api/inventory/{catId}/items/{id}
    @PatchMapping("/{catId}/items/{id}")
    public ResponseEntity<ApiResponse<Inventory>> updateItem(
            @PathVariable String catId,
            @PathVariable String id,
            @RequestBody Inventory.InventoryItem updated) {
        Inventory inv = inventoryService.updateItem(catId, id, updated);
        return ResponseEntity.ok(
                ApiResponse.ok(inv, "Item updated"));
    }

    // DELETE /api/inventory/{catId}/items/{id}
    @DeleteMapping("/{catId}/items/{id}")
    public ResponseEntity<Void> deleteItem(
            @PathVariable String catId,
            @PathVariable String id) {
        inventoryService.deleteItem(catId, id);
        return ResponseEntity.noContent().build();
    }
}