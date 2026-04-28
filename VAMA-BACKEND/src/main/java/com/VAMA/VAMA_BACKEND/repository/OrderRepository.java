package com.VAMA.VAMA_BACKEND.repository;

import com.VAMA.VAMA_BACKEND.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface OrderRepository extends MongoRepository<Order, String> {
    List<Order> findByCustomerId(String customerId);
    List<Order> findBySupplierId(String supplierId);
    List<Order> findByStatus(String status);
}