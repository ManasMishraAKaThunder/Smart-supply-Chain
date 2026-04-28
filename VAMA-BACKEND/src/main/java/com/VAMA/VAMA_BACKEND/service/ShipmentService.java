package com.VAMA.VAMA_BACKEND.service;

import com.VAMA.VAMA_BACKEND.exception.ResourceNotFoundException;
import com.VAMA.VAMA_BACKEND.model.Shipment;
import com.VAMA.VAMA_BACKEND.repository.ShipmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ShipmentService {

    private final ShipmentRepository shipmentRepository;

    /**
     * Find shipment by order ID.
     */
    public Shipment getByOrderId(String orderId) {
        return shipmentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Shipment", "orderId", orderId));
    }

    /**
     * Get all active (non-delivered) shipments.
     */
    public List<Shipment> getActiveShipments() {
        return shipmentRepository.findByStatusNot("DELIVERED");
    }

    /**
     * Get shipments by driver ID.
     */
    public List<Shipment> getByDriverId(String driverId) {
        return shipmentRepository.findByDriverId(driverId);
    }

    /**
     * Get shipments by status.
     */
    public List<Shipment> getByStatus(String status) {
        return shipmentRepository.findByStatus(status);
    }

    /**
     * Create a new shipment.
     */
    public Shipment createShipment(Shipment shipment) {
        shipment.setCreatedAt(LocalDateTime.now());
        shipment.setUpdatedAt(LocalDateTime.now());
        if (shipment.getStatus() == null) {
            shipment.setStatus("PENDING");
        }
        Shipment saved = shipmentRepository.save(shipment);
        log.info("Shipment created: {}", saved.getId());
        return saved;
    }

    /**
     * Update shipment status, progress, and optional delay reason.
     */
    public Shipment updateStatus(String id, String status, Integer progress, String delayReason) {
        Shipment shipment = shipmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Shipment", "id", id));

        if (status != null) shipment.setStatus(status);
        if (progress != null) shipment.setProgress(progress);
        if (delayReason != null) shipment.setDelayReason(delayReason);
        shipment.setUpdatedAt(LocalDateTime.now());

        Shipment saved = shipmentRepository.save(shipment);
        log.info("Shipment {} status updated to: {}", id, status);
        return saved;
    }

    /**
     * Update shipment location (for real-time tracking).
     */
    public Shipment updateLocation(String id, Shipment.Location location) {
        Shipment shipment = shipmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Shipment", "id", id));
        shipment.setCurrentLocation(location);
        shipment.setUpdatedAt(LocalDateTime.now());
        return shipmentRepository.save(shipment);
    }
}
