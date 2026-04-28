package com.VAMA.VAMA_BACKEND.repository;

import com.VAMA.VAMA_BACKEND.model.Supplier;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface SupplierRepository extends MongoRepository<Supplier, String> {
    List<Supplier> findByCategoryContaining(String category);
    Optional<Supplier> findByUserId(String userId);
    Optional<Supplier> findByEmail(String email);
    List<Supplier> findByActiveTrue();
}