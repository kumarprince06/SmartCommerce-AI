package com.SmartCommerceAI.product.controller;

import com.SmartCommerceAI.common.dto.ApiResponse;
import com.SmartCommerceAI.product.dto.VariantCreationRequest;
import com.SmartCommerceAI.product.dto.VariantResponse;
import com.SmartCommerceAI.product.service.ProductVariantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class VariantController {

    private final ProductVariantService variantService;

    @PostMapping("/products/{id}/variants")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<ApiResponse<List<VariantResponse>>> createVariants(
            @PathVariable Long id,
            @Valid @RequestBody VariantCreationRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                variantService.createVariants(id, request),
                "Variants mapping created robustly"
        ));
    }

    @GetMapping("/products/{id}/variants")
    public ResponseEntity<ApiResponse<List<VariantResponse>>> getVariantsForProduct(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(
                variantService.getVariantsForProduct(id),
                "Variants queried securely"
        ));
    }

    @GetMapping("/variants/{id}")
    public ResponseEntity<ApiResponse<VariantResponse>> getVariantById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(
                variantService.getVariantById(id),
                "Variant parameters extracted natively"
        ));
    }
}
