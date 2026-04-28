package com.VAMA.VAMA_BACKEND.service;

import com.VAMA.VAMA_BACKEND.exception.ResourceNotFoundException;
import com.VAMA.VAMA_BACKEND.model.Receiver;
import com.VAMA.VAMA_BACKEND.repository.ReceiverRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReceiverService {

    private final ReceiverRepository receiverRepository;

    public List<Receiver> getAll(String category) {
        if (category != null && !category.isBlank()) {
            return receiverRepository.findByCategoryContaining(category);
        }
        return receiverRepository.findAll();
    }

    public Receiver getById(String id) {
        return receiverRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Receiver", "id", id));
    }

    public Receiver create(Receiver receiver) {
        Receiver saved = receiverRepository.save(receiver);
        log.info("Receiver created: {}", saved.getId());
        return saved;
    }

    public Receiver update(String id, Receiver updated) {
        Receiver existing = getById(id);

        if (updated.getName() != null)     existing.setName(updated.getName());
        if (updated.getPhone() != null)    existing.setPhone(updated.getPhone());
        if (updated.getAddress() != null)  existing.setAddress(updated.getAddress());
        if (updated.getContact() != null)  existing.setContact(updated.getContact());
        if (updated.getCategory() != null) existing.setCategory(updated.getCategory());
        if (updated.getEmail() != null)    existing.setEmail(updated.getEmail());

        Receiver saved = receiverRepository.save(existing);
        log.info("Receiver updated: {}", id);
        return saved;
    }
}
