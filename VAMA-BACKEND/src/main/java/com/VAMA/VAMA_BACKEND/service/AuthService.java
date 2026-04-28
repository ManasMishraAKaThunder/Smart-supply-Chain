package com.VAMA.VAMA_BACKEND.service;

import com.VAMA.VAMA_BACKEND.dto.*;
import com.VAMA.VAMA_BACKEND.exception.BadRequestException;
import com.VAMA.VAMA_BACKEND.exception.DuplicateResourceException;
import com.VAMA.VAMA_BACKEND.exception.ResourceNotFoundException;
import com.VAMA.VAMA_BACKEND.model.User;
import com.VAMA.VAMA_BACKEND.repository.UserRepository;
import com.VAMA.VAMA_BACKEND.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    /**
     * Authenticate user and return JWT + user info.
     */
    public LoginResponse login(LoginRequest request) {
        log.info("Login attempt for email: {}", request.getEmail());

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User", "email", request.getEmail()));

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());

        log.info("Login successful for user: {}", user.getEmail());
        return buildLoginResponse(token, user);
    }

    /**
     * Register a new user and return JWT + user info.
     */
    public LoginResponse register(RegisterRequest request) {
        log.info("Registration attempt for email: {}", request.getEmail());

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException(
                    "Email '" + request.getEmail() + "' is already registered");
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setPhone(request.getPhone());
        user.setActive(true);

        // Apply extra fields if provided
        if (request.getExtraFields() != null) {
            Map<String, String> extras = request.getExtraFields();
            if (extras.containsKey("address"))       user.setAddress(extras.get("address"));
            if (extras.containsKey("organization"))  user.setOrganization(extras.get("organization"));
            if (extras.containsKey("businessName"))  user.setBusinessName(extras.get("businessName"));
            if (extras.containsKey("supplyCategory"))user.setSupplyCategory(extras.get("supplyCategory"));
        }

        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());

        log.info("Registration successful for user: {}", user.getEmail());
        return buildLoginResponse(token, user);
    }

    /**
     * Return the current user's profile (no password).
     */
    public UserProfileResponse getMe(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User", "email", email));
        return toProfileResponse(user);
    }

    /**
     * Refresh JWT token.
     */
    public LoginResponse refreshToken(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User", "email", email));

        String newToken = jwtUtil.generateToken(user.getEmail(), user.getRole());
        log.info("Token refreshed for user: {}", email);
        return buildLoginResponse(newToken, user);
    }

    /* ── private helpers ── */

    private LoginResponse buildLoginResponse(String token, User user) {
        return LoginResponse.builder()
                .token(token)
                .user(LoginResponse.UserInfo.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .fullName(user.getFullName())
                        .role(user.getRole())
                        .profileComplete(user.isProfileComplete())
                        .build())
                .build();
    }

    public static UserProfileResponse toProfileResponse(User user) {
        return UserProfileResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .address(user.getAddress())
                .organization(user.getOrganization())
                .businessName(user.getBusinessName())
                .supplyCategory(user.getSupplyCategory())
                .avatarUrl(user.getAvatarUrl())
                .profileComplete(user.isProfileComplete())
                .active(user.isActive())
                .build();
    }
}