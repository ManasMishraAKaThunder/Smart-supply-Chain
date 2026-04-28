package com.VAMA.VAMA_BACKEND.dto;

import lombok.Data;

/**
 * DTO for profile update requests.
 * Matches frontend UpdateProfilePayload interface.
 */
@Data
public class UpdateProfileRequest {

    private String fullName;
    private String email;
    private String phone;
    private String address;
    private String organization;
    private String businessName;
    private String supplyCategory;
}
