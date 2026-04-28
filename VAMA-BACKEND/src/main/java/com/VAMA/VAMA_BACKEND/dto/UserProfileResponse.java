package com.VAMA.VAMA_BACKEND.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * User profile response — excludes password hash.
 * Matches frontend UserProfile interface.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {

    private String id;
    private String fullName;
    private String email;
    private String phone;
    private String role;
    private String address;
    private String organization;
    private String businessName;
    private String supplyCategory;
    private String avatarUrl;
    private boolean profileComplete;
    private boolean active;
}
