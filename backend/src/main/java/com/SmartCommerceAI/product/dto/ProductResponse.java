package com.SmartCommerceAI.product.dto;

import com.SmartCommerceAI.product.entity.ProductStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ProductResponse {
    private Long id;
    private Long vendorId;
    private String businessName;
    private Long categoryId;
    private String categoryName;
    private String name;
    private String description;
    private ProductStatus status;
    private LocalDateTime createdAt;
}
