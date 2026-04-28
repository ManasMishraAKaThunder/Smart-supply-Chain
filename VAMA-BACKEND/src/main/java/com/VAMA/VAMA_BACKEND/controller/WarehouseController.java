package com.VAMA.VAMA_BACKEND.controller;

import com.VAMA.VAMA_BACKEND.dto.ApiResponse;
import com.VAMA.VAMA_BACKEND.model.Warehouse;
import com.VAMA.VAMA_BACKEND.service.WarehouseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/warehouses")
@RequiredArgsConstructor
public class WarehouseController {

    private final WarehouseService warehouseService;

    // GET /api/warehouses?category=electronics
    @GetMapping
    public ResponseEntity<ApiResponse<List<Warehouse>>> getAll(
            @RequestParam(required = false) String category) {
        return ResponseEntity.ok(
                ApiResponse.ok(warehouseService.getAll(category)));
    }

    // GET /api/warehouses/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Warehouse>> getById(
            @PathVariable String id) {
        return ResponseEntity.ok(
                ApiResponse.ok(warehouseService.getById(id)));
    }

    // POST /api/warehouses
    @PostMapping
    public ResponseEntity<ApiResponse<Warehouse>> create(
            @Valid @RequestBody Warehouse warehouse) {
        Warehouse created = warehouseService.create(warehouse);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.ok(created, "Warehouse created"));
    }

    // PUT /api/warehouses/{id}
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Warehouse>> update(
            @PathVariable String id,
            @Valid @RequestBody Warehouse updated) {
        return ResponseEntity.ok(
                ApiResponse.ok(warehouseService.update(id, updated), "Warehouse updated"));
    }
}
