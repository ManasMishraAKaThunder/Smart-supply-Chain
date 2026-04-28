package com.VAMA.VAMA_BACKEND.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String password;

    /**
     * Optional role hint sent by the frontend.
     * The actual role is read from the database after authentication.
     */
    private String role;
}