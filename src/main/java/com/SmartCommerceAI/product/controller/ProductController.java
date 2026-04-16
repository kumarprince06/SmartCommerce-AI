package com.SmartCommerceAI.product.controller;

import com.SmartCommerceAI.common.dto.ApiResponse;
import com.SmartCommerceAI.common.dto.PaginatedResponse;
import com.SmartCommerceAI.product.dto.CreateProductRequest;
import com.SmartCommerceAI.product.dto.ProductResponse;
import com.SmartCommerceAI.product.service.ProductService;
import com.SmartCommerceAI.user.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<ApiResponse<ProductResponse>> createProduct(
            @AuthenticationPrincipal User currentUser,
            @Valid @RequestBody CreateProductRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                productService.createProduct(currentUser, request),
                "Product created successfully"
        ));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PaginatedResponse<ProductResponse>>> getProducts(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long vendorId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(ApiResponse.success(
                productService.getProducts(categoryId, vendorId, pageable),
                "Products retrieved successfully"
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(
                productService.getProductById(id),
                "Product retrieved successfully"
        ));
    }
}
