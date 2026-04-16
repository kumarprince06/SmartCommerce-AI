package com.SmartCommerceAI.vendor.controller;

import com.SmartCommerceAI.common.dto.ApiResponse;
import com.SmartCommerceAI.user.entity.User;
import com.SmartCommerceAI.vendor.dto.CreateVendorRequest;
import com.SmartCommerceAI.vendor.dto.VendorResponse;
import com.SmartCommerceAI.vendor.dto.VendorStatusUpdateRequest;
import com.SmartCommerceAI.vendor.service.VendorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/vendors")
@RequiredArgsConstructor
public class VendorController {

    private final VendorService vendorService;

    @PostMapping
    public ResponseEntity<ApiResponse<VendorResponse>> registerAsVendor(
            @AuthenticationPrincipal User currentUser,
            @Valid @RequestBody CreateVendorRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                vendorService.registerVendor(currentUser, request),
                "Successfully registered as Vendor. Please use the new token attached to access vendor endpoints."
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<VendorResponse>> getVendorById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(vendorService.getVendorById(id), "Vendor retrieved successfully"));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<VendorResponse>> getMyVendorProfile(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(ApiResponse.success(vendorService.getVendorProfile(currentUser), "Vendor profile retrieved successfully"));
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
