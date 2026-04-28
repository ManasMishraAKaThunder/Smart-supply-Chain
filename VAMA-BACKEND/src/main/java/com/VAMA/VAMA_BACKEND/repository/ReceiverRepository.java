package com.VAMA.VAMA_BACKEND.repository;

import com.VAMA.VAMA_BACKEND.model.Receiver;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface ReceiverRepository extends MongoRepository<Receiver, String> {
    List<Receiver> findByCategoryContaining(String category);
    Optional<Receiver> findByUserId(String userId);
    Optional<Receiver> findByEmail(String email);
    List<Receiver> findByActiveTrue();
}