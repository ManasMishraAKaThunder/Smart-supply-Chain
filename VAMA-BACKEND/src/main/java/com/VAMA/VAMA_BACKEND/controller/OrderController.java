package com.VAMA.VAMA_BACKEND.controller;

import com.VAMA.VAMA_BACKEND.dto.ApiResponse;
import com.VAMA.VAMA_BACKEND.dto.PagedResponse;
import com.VAMA.VAMA_BACKEND.model.Order;
import com.VAMA.VAMA_BACKEND.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // GET /api/orders?page=0&size=20&customerId=X&supplierId=Y&status=Z
    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<Order>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String customerId,
            @RequestParam(required = false) String supplierId,
            @RequestParam(required = false) String status) {

        // Use filtered queries if params provided, otherwise paginated getAll
        if (customerId != null) {
            var orders = orderService.getOrdersByCustomer(customerId);
            return ResponseEntity.ok(ApiResponse.ok(buildPagedFromList(orders, page, size)));
        }
        if (supplierId != null) {
            var orders = orderService.getOrdersBySupplier(supplierId);
            return ResponseEntity.ok(ApiResponse.ok(buildPagedFromList(orders, page, size)));
        }
        if (status != null) {
            var orders = orderService.getOrdersByStatus(status);
            return ResponseEntity.ok(ApiResponse.ok(buildPagedFromList(orders, page, size)));
        }

        Page<Order> orderPage = orderService.getAllOrders(page, size);
        PagedResponse<Order> response = PagedResponse.<Order>builder()
                .content(orderPage.getContent())
                .page(orderPage.getNumber())
                .size(orderPage.getSize())
                .totalElements(orderPage.getTotalElements())
                .totalPages(orderPage.getTotalPages())
                .last(orderPage.isLast())
                .build();

        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    // GET /api/orders/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Order>> getById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok(orderService.getOrderById(id)));
    }

    // POST /api/orders
    @PostMapping
    public ResponseEntity<ApiResponse<Order>> create(@Valid @RequestBody Order order) {
        Order created = orderService.createOrder(order);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.ok(created, "Order created"));
    }

    // PUT /api/orders/{id}/status
    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Order>> updateStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> body) {
        Order updated = orderService.updateOrderStatus(id, body.get("status"));
        return ResponseEntity.ok(ApiResponse.ok(updated, "Order status updated"));
    }

    /* ── private helper ── */
    private <T> PagedResponse<T> buildPagedFromList(
            java.util.List<T> list, int page, int size) {
        int start = Math.min(page * size, list.size());
        int end = Math.min(start + size, list.size());
        return PagedResponse.<T>builder()
                .content(list.subList(start, end))
                .page(page)
                .size(size)
                .totalElements(list.size())
                .totalPages((int) Math.ceil((double) list.size() / size))
                .last(end >= list.size())
                .build();
    }
}