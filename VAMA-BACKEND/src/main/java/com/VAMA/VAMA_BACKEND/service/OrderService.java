package com.VAMA.VAMA_BACKEND.service;

import com.VAMA.VAMA_BACKEND.exception.ResourceNotFoundException;
import com.VAMA.VAMA_BACKEND.model.Order;
import com.VAMA.VAMA_BACKEND.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;

    /**
     * Get all orders with pagination.
     */
    public Page<Order> getAllOrders(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return orderRepository.findAll(pageable);
    }

    /**
     * Get orders by customer ID.
     */
    public List<Order> getOrdersByCustomer(String customerId) {
        return orderRepository.findByCustomerId(customerId);
    }

    /**
     * Get orders by supplier ID.
     */
    public List<Order> getOrdersBySupplier(String supplierId) {
        return orderRepository.findBySupplierId(supplierId);
    }

    /**
     * Get orders by status.
     */
    public List<Order> getOrdersByStatus(String status) {
        return orderRepository.findByStatus(status);
    }

    /**
     * Get single order by ID.
     */
    public Order getOrderById(String id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Order", "id", id));
    }

    /**
     * Create a new order.
     */
    public Order createOrder(Order order) {
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());
        if (order.getStatus() == null) {
            order.setStatus("CREATED");
        }
        Order saved = orderRepository.save(order);
        log.info("Order created: {}", saved.getId());
        return saved;
    }

    /**
     * Update order status.
     */
    public Order updateOrderStatus(String id, String status) {
        Order order = getOrderById(id);
        order.setStatus(status);
        order.setUpdatedAt(LocalDateTime.now());
        Order saved = orderRepository.save(order);
        log.info("Order {} status updated to: {}", id, status);
        return saved;
    }
}
