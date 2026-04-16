package com.SmartCommerceAI.product.controller;

import com.SmartCommerceAI.common.dto.ApiResponse;
import com.SmartCommerceAI.product.dto.InventoryUpdateRequest;
import com.SmartCommerceAI.product.dto.VariantResponse;
import com.SmartCommerceAI.product.service.InventoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    @PatchMapping("/variants/{variantId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('VENDOR')")
    public ResponseEntity<ApiResponse<VariantResponse>> adjustInventory(
            @PathVariable Long variantId,
            @Valid @RequestBody InventoryUpdateRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                inventoryService.updateInventory(variantId, request),
                "Inventory ledger correctly logged and stock re-calculated"
        ));
    }
}
