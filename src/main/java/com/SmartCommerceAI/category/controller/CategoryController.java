package com.SmartCommerceAI.category.controller;

import com.SmartCommerceAI.category.dto.CategoryResponse;
import com.SmartCommerceAI.category.dto.CreateCategoryRequest;
import com.SmartCommerceAI.category.service.CategoryService;
import com.SmartCommerceAI.common.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<CategoryResponse>> createCategory(@Valid @RequestBody CreateCategoryRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                categoryService.createCategory(request),
                "Category created successfully"
        ));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getAllCategories() {
        return ResponseEntity.ok(ApiResponse.success(
                categoryService.getAllCategories(),
                "Categories retrieved successfully"
        ));
    }
}
