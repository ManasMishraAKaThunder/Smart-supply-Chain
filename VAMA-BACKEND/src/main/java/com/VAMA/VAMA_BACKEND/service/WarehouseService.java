package com.VAMA.VAMA_BACKEND.service;

import com.VAMA.VAMA_BACKEND.exception.ResourceNotFoundException;
import com.VAMA.VAMA_BACKEND.model.Warehouse;
import com.VAMA.VAMA_BACKEND.repository.WarehouseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class WarehouseService {

    private final WarehouseRepository warehouseRepository;

    public List<Warehouse> getAll(String category) {
        if (category != null && !category.isBlank()) {
            return warehouseRepository.findByCategoryContaining(category);
        }
        return warehouseRepository.findAll();
    }

    public Warehouse getById(String id) {
        return warehouseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Warehouse", "id", id));
    }

    public Warehouse create(Warehouse warehouse) {
        Warehouse saved = warehouseRepository.save(warehouse);
        log.info("Warehouse created: {}", saved.getId());
        return saved;
    }

    public Warehouse update(String id, Warehouse updated) {
        Warehouse existing = getById(id);

        if (updated.getName() != null)     existing.setName(updated.getName());
        if (updated.getPhone() != null)    existing.setPhone(updated.getPhone());
        if (updated.getAddress() != null)  existing.setAddress(updated.getAddress());
        if (updated.getContact() != null)  existing.setContact(updated.getContact());
        if (updated.getLocation() != null) existing.setLocation(updated.getLocation());
        if (updated.getCategory() != null) existing.setCategory(updated.getCategory());
        if (updated.getEmail() != null)    existing.setEmail(updated.getEmail());

        Warehouse saved = warehouseRepository.save(existing);
        log.info("Warehouse updated: {}", id);
        return saved;
    }
}
