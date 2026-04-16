package com.SmartCommerceAI.analytics.controller;

import com.SmartCommerceAI.analytics.entity.VendorMetrics;
import com.SmartCommerceAI.analytics.repository.VendorMetricsRepository;
import com.SmartCommerceAI.common.dto.ApiResponse;
import com.SmartCommerceAI.user.entity.User;
import com.SmartCommerceAI.vendor.entity.Vendor;
import com.SmartCommerceAI.vendor.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/analytics/vendor")
@RequiredArgsConstructor
public class AnalyticsController {

    private final VendorRepository vendorRepository;
    private final VendorMetricsRepository vendorMetricsRepository;

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<ApiResponse<VendorMetrics>> getVendorDashboard(@AuthenticationPrincipal User currentUser) {
        Vendor vendor = vendorRepository.findByUser(currentUser)
                .orElseThrow(() -> new RuntimeException("Vendor mapping exclusively required"));

        VendorMetrics metrics = vendorMetricsRepository.findByVendorId(vendor.getId())
                .orElseGet(() -> VendorMetrics.builder().vendor(vendor).build());

        return ResponseEntity.ok(ApiResponse.success(metrics, "Live tracking metrics formulated natively"));
    }
}
