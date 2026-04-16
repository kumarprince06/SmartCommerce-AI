package com.SmartCommerceAI.product.dto;

import lombok.Builder;
import lombok.Data;
import java.util.Map;

@Data
@Builder
public class VariantResponse {
    private Long id;
    private String sku;
    private Double price;
    private Integer stock;
    private Map<String, String> attributes;
}
