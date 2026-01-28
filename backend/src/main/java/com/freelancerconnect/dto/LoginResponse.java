package com.freelancerconnect.dto;

import lombok.Data;

@Data
public class LoginResponse {
    private String message;
    private Long userId;
    private String role;
    private String fullName;

    public LoginResponse(String message, Long userId, String role, String fullName) {
        this.message = message;
        this.userId = userId;
        this.role = role;
        this.fullName = fullName;
    }
}
