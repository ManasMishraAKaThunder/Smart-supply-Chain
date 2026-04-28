package com.VAMA.VAMA_BACKEND.controller;

import com.VAMA.VAMA_BACKEND.dto.ApiResponse;
import com.VAMA.VAMA_BACKEND.model.Receiver;
import com.VAMA.VAMA_BACKEND.service.ReceiverService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/receivers")
@RequiredArgsConstructor
public class ReceiverController {

    private final ReceiverService receiverService;

    // GET /api/receivers?category=electronics
    @GetMapping
    public ResponseEntity<ApiResponse<List<Receiver>>> getAll(
            @RequestParam(required = false) String category) {
        return ResponseEntity.ok(
                ApiResponse.ok(receiverService.getAll(category)));
    }

    // GET /api/receivers/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Receiver>> getById(
            @PathVariable String id) {
        return ResponseEntity.ok(
                ApiResponse.ok(receiverService.getById(id)));
    }

    // POST /api/receivers
    @PostMapping
    public ResponseEntity<ApiResponse<Receiver>> create(
            @Valid @RequestBody Receiver receiver) {
        Receiver created = receiverService.create(receiver);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.ok(created, "Receiver created"));
    }

    // PUT /api/receivers/{id}
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Receiver>> update(
            @PathVariable String id,
            @Valid @RequestBody Receiver updated) {
        return ResponseEntity.ok(
                ApiResponse.ok(receiverService.update(id, updated), "Receiver updated"));
    }
}