package com.VAMA.VAMA_BACKEND.controller;

import com.VAMA.VAMA_BACKEND.dto.ApiResponse;
import com.VAMA.VAMA_BACKEND.model.Supplier;
import com.VAMA.VAMA_BACKEND.service.SupplierService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/suppliers")
@RequiredArgsConstructor
public class SupplierController {

    private final SupplierService supplierService;

    // GET /api/suppliers?category=electronics
    @GetMapping
    public ResponseEntity<ApiResponse<List<Supplier>>> getAll(
            @RequestParam(required = false) String category) {
        return ResponseEntity.ok(
                ApiResponse.ok(supplierService.getAll(category)));
    }

    // GET /api/suppliers/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Supplier>> getById(
            @PathVariable String id) {
        return ResponseEntity.ok(
                ApiResponse.ok(supplierService.getById(id)));
    }

    // POST /api/suppliers
    @PostMapping
    public ResponseEntity<ApiResponse<Supplier>> create(
            @Valid @RequestBody Supplier supplier) {
        Supplier created = supplierService.create(supplier);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.ok(created, "Supplier created"));
    }

    // PUT /api/suppliers/{id}
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Supplier>> update(
            @PathVariable String id,
            @Valid @RequestBody Supplier updated) {
        return ResponseEntity.ok(
                ApiResponse.ok(supplierService.update(id, updated), "Supplier updated"));
    }
}