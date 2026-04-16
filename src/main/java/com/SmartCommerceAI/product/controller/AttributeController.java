package com.SmartCommerceAI.product.controller;

import com.SmartCommerceAI.common.dto.ApiResponse;
import com.SmartCommerceAI.product.dto.AttributeRequest;
import com.SmartCommerceAI.product.dto.AttributeValueRequest;
import com.SmartCommerceAI.product.dto.ProductAttributeRequest;
import com.SmartCommerceAI.product.entity.Attribute;
import com.SmartCommerceAI.product.entity.AttributeValue;
import com.SmartCommerceAI.product.service.AttributeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class AttributeController {

    private final AttributeService attributeService;

    @PostMapping("/attributes")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Attribute>> createAttribute(@Valid @RequestBody AttributeRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                attributeService.createAttribute(request),
                "Attribute created successfully"
        ));
    }

    @PostMapping("/attributes/{id}/values")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AttributeValue>> createAttributeValue(
            @PathVariable Long id,
            @Valid @RequestBody AttributeValueRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                attributeService.createAttributeValue(id, request),
                "Attribute value added successfully"
        ));
    }

    @PostMapping("/products/{id}/attributes")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<ApiResponse<Void>> mapAttributesToProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductAttributeRequest request) {
        
        attributeService.mapAttributesToProduct(id, request);
        return ResponseEntity.ok(ApiResponse.success(null, "Product Attributes mapped successfully"));
    }

    @GetMapping("/attributes")
    public ResponseEntity<ApiResponse<List<Attribute>>> getAllAttributes() {
        return ResponseEntity.ok(ApiResponse.success(
                attributeService.getAllAttributes(), 
                "Attributes fetched successfully"));
    }
}
