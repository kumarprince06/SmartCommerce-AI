package com.SmartCommerceAI.user.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

@Data
public class UserUpdateRequest {
    @NotBlank(message = "Name cannot be empty")
    private String name;
}
