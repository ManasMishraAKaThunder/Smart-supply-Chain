package com.VAMA.VAMA_BACKEND.repository;

import com.VAMA.VAMA_BACKEND.model.Inventory;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface InventoryRepository extends MongoRepository<Inventory, String> {
    List<Inventory> findByWarehouseId(String warehouseId);
    List<Inventory> findByCategory(String category);
}