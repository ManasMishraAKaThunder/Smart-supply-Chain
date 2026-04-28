package com.VAMA.VAMA_BACKEND.service;

import com.VAMA.VAMA_BACKEND.exception.ResourceNotFoundException;
import com.VAMA.VAMA_BACKEND.model.Supplier;
import com.VAMA.VAMA_BACKEND.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class SupplierService {

    private final SupplierRepository supplierRepository;

    public List<Supplier> getAll(String category) {
        if (category != null && !category.isBlank()) {
            return supplierRepository.findByCategoryContaining(category);
        }
        return supplierRepository.findAll();
    }

    public Supplier getById(String id) {
        return supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Supplier", "id", id));
    }

    public Supplier create(Supplier supplier) {
        Supplier saved = supplierRepository.save(supplier);
        log.info("Supplier created: {}", saved.getId());
        return saved;
    }

    public Supplier update(String id, Supplier updated) {
        Supplier existing = getById(id);

        if (updated.getName() != null)     existing.setName(updated.getName());
        if (updated.getPhone() != null)    existing.setPhone(updated.getPhone());
        if (updated.getAddress() != null)  existing.setAddress(updated.getAddress());
        if (updated.getContact() != null)  existing.setContact(updated.getContact());
        if (updated.getCategory() != null) existing.setCategory(updated.getCategory());
        if (updated.getEmail() != null)    existing.setEmail(updated.getEmail());

        Supplier saved = supplierRepository.save(existing);
        log.info("Supplier updated: {}", id);
        return saved;
    }
}
