package com.VAMA.VAMA_BACKEND.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.Map;

@Data
public class RegisterRequest {

    @NotBlank
    private String fullName;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotBlank
    private String role;

    private String phone;

    /**
     * Frontend may pass extra fields (address, organization, etc.)
     * depending on the role during registration.
     */
    private Map<String, String> extraFields;
}