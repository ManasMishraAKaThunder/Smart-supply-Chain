package com.VAMA.VAMA_BACKEND.service;

import com.VAMA.VAMA_BACKEND.dto.ChangePasswordRequest;
import com.VAMA.VAMA_BACKEND.dto.UpdateProfileRequest;
import com.VAMA.VAMA_BACKEND.dto.UserProfileResponse;
import com.VAMA.VAMA_BACKEND.exception.BadRequestException;
import com.VAMA.VAMA_BACKEND.exception.ResourceNotFoundException;
import com.VAMA.VAMA_BACKEND.model.User;
import com.VAMA.VAMA_BACKEND.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Get current user profile by email.
     */
    public UserProfileResponse getProfile(String email) {
        User user = findByEmail(email);
        return AuthService.toProfileResponse(user);
    }

    /**
     * Update user profile fields.
     */
    public UserProfileResponse updateProfile(String email, UpdateProfileRequest request) {
        User user = findByEmail(email);

        if (request.getFullName() != null)       user.setFullName(request.getFullName());
        if (request.getPhone() != null)          user.setPhone(request.getPhone());
        if (request.getAddress() != null)        user.setAddress(request.getAddress());
        if (request.getOrganization() != null)   user.setOrganization(request.getOrganization());
        if (request.getBusinessName() != null)   user.setBusinessName(request.getBusinessName());
        if (request.getSupplyCategory() != null) user.setSupplyCategory(request.getSupplyCategory());

        // Mark profile as complete if key fields are filled
        if (user.getFullName() != null && user.getPhone() != null) {
            user.setProfileComplete(true);
        }

        userRepository.save(user);
        log.info("Profile updated for user: {}", email);
        return AuthService.toProfileResponse(user);
    }

    /**
     * Change password with current password verification.
     */
    public void changePassword(String email, ChangePasswordRequest request) {
        User user = findByEmail(email);

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadRequestException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        log.info("Password changed for user: {}", email);
    }

    /**
     * Get users filtered by role (admin use).
     * Returns profiles without password hashes.
     */
    public List<UserProfileResponse> getUsersByRole(String role) {
        List<User> users;
        if (role != null && !role.isBlank()) {
            users = userRepository.findByRole(role);
        } else {
            users = userRepository.findAll();
        }
        return users.stream()
                .map(AuthService::toProfileResponse)
                .collect(Collectors.toList());
    }

    /* ── private helpers ── */

    private User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User", "email", email));
    }
}
