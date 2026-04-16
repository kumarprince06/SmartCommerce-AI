package com.SmartCommerceAI.category.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class CategoryResponse {
    private Long id;
    private String name;
    private Integer level;
    private List<CategoryResponse> subCategories;
}
