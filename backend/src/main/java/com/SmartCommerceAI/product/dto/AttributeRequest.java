package com.SmartCommerceAI.product.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AttributeRequest {
    @NotBlank(message = "Attribute name is required")
    private String name;
}
