package com.VAMA.VAMA_BACKEND.controller;

import com.VAMA.VAMA_BACKEND.dto.*;
import com.VAMA.VAMA_BACKEND.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // GET /api/users/profile
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getProfile(
            @AuthenticationPrincipal UserDetails userDetails) {
        UserProfileResponse profile = userService.getProfile(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(profile));
    }

    // PUT /api/users/profile
    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody UpdateProfileRequest request) {
        UserProfileResponse profile = userService.updateProfile(
                userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.ok(profile, "Profile updated"));
    }

    // PUT /api/users/password
    @PutMapping("/password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.ok(null, "Password updated successfully"));
    }

    // GET /api/users?role=DRIVER
    @GetMapping
    public ResponseEntity<ApiResponse<List<UserProfileResponse>>> getByRole(
            @RequestParam(required = false) String role) {
        List<UserProfileResponse> users = userService.getUsersByRole(role);
        return ResponseEntity.ok(ApiResponse.ok(users));
    }
}