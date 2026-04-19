package com.SmartCommerceAI.vendor.controller;

import com.SmartCommerceAI.common.dto.ApiResponse;
import com.SmartCommerceAI.common.dto.PaginatedResponse;
import com.SmartCommerceAI.product.dto.ProductResponse;
import com.SmartCommerceAI.product.service.ProductService;
import com.SmartCommerceAI.user.entity.User;
import com.SmartCommerceAI.vendor.dto.CreateVendorRequest;
import com.SmartCommerceAI.vendor.dto.VendorResponse;
import com.SmartCommerceAI.vendor.dto.VendorStatusUpdateRequest;
import com.SmartCommerceAI.vendor.service.VendorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vendors")
@RequiredArgsConstructor
public class VendorController {

    private final VendorService vendorService;
    private final ProductService productService;

    @PostMapping
    public ResponseEntity<ApiResponse<VendorResponse>> registerAsVendor(
            @AuthenticationPrincipal User currentUser,
            @Valid @RequestBody CreateVendorRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                vendorService.registerVendor(currentUser, request),
                "Successfully registered as Vendor."
        ));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<VendorResponse>>> getAllVendors() {
        return ResponseEntity.ok(ApiResponse.success(
                vendorService.getAllVendors(),
                "Vendors retrieved successfully"
        ));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<VendorResponse>> getMyVendorProfile(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(ApiResponse.success(
                vendorService.getVendorProfile(currentUser),
                "Vendor profile retrieved successfully"
        ));
    }

    @GetMapping("/me/products")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<ApiResponse<PaginatedResponse<ProductResponse>>> getMyProducts(
            @AuthenticationPrincipal User currentUser,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size
    ) {
        VendorResponse vendorProfile = vendorService.getVendorProfile(currentUser);
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(ApiResponse.success(
                productService.getProducts(null, vendorProfile.getId(), pageable),
                "Vendor products retrieved successfully"
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<VendorResponse>> getVendorById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(
                vendorService.getVendorById(id),
                "Vendor retrieved successfully"
        ));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<VendorResponse>> updateVendorStatus(
            @PathVariable Long id,
            @Valid @RequestBody VendorStatusUpdateRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                vendorService.updateVendorStatus(id, request),
                "Vendor status updated successfully"
        ));
    }
}
