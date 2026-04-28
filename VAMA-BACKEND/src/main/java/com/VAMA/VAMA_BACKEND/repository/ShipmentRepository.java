package com.VAMA.VAMA_BACKEND.repository;

import com.VAMA.VAMA_BACKEND.model.Shipment;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface ShipmentRepository extends MongoRepository<Shipment, String> {
    Optional<Shipment> findByOrderId(String orderId);
    List<Shipment> findByStatusNot(String status);
    List<Shipment> findByDriverId(String driverId);
    List<Shipment> findByStatus(String status);
}