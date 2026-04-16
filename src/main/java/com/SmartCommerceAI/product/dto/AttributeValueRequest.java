package com.SmartCommerceAI.product.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AttributeValueRequest {
    @NotBlank(message = "Attribute value cannot be empty")
    private String value;
}
