package com.VAMA.VAMA_BACKEND.controller;

import com.VAMA.VAMA_BACKEND.dto.ApiResponse;
import com.VAMA.VAMA_BACKEND.model.Shipment;
import com.VAMA.VAMA_BACKEND.service.ShipmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/shipments")
@RequiredArgsConstructor
public class ShipmentController {

    private final ShipmentService shipmentService;

    // GET /api/shipments?orderId=X
    @GetMapping
    public ResponseEntity<ApiResponse<Shipment>> getByOrderId(
            @RequestParam String orderId) {
        return ResponseEntity.ok(
                ApiResponse.ok(shipmentService.getByOrderId(orderId)));
    }

    // GET /api/shipments/active
    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<Shipment>>> getActive() {
        return ResponseEntity.ok(
                ApiResponse.ok(shipmentService.getActiveShipments()));
    }

    // GET /api/shipments/driver/{driverId}
    @GetMapping("/driver/{driverId}")
    public ResponseEntity<ApiResponse<List<Shipment>>> getByDriver(
            @PathVariable String driverId) {
        return ResponseEntity.ok(
                ApiResponse.ok(shipmentService.getByDriverId(driverId)));
    }

    // PUT /api/shipments/{id}/status
    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Shipment>> updateStatus(
            @PathVariable String id,
            @RequestBody Map<String, Object> body) {
        String status = (String) body.get("status");
        Integer progress = body.containsKey("progress")
                ? ((Number) body.get("progress")).intValue() : null;
        String delayReason = (String) body.get("delayReason");

        Shipment updated = shipmentService.updateStatus(id, status, progress, delayReason);
        return ResponseEntity.ok(
                ApiResponse.ok(updated, "Shipment status updated"));
    }

    // POST /api/shipments
    @PostMapping
    public ResponseEntity<ApiResponse<Shipment>> create(
            @Valid @RequestBody Shipment shipment) {
        Shipment created = shipmentService.createShipment(shipment);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.ok(created, "Shipment created"));
    }
}