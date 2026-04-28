package com.VAMA.VAMA_BACKEND.repository;

import com.VAMA.VAMA_BACKEND.model.Warehouse;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface WarehouseRepository extends MongoRepository<Warehouse, String> {
    List<Warehouse> findByCategoryContaining(String category);
    Optional<Warehouse> findByUserId(String userId);
    Optional<Warehouse> findByEmail(String email);
    List<Warehouse> findByActiveTrue();
}
