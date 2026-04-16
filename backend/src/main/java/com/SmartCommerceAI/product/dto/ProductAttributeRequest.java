package com.SmartCommerceAI.product.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class ProductAttributeRequest {
    @NotEmpty(message = "Must provide at least one attribute_id")
    private List<Long> attributeIds;
}
