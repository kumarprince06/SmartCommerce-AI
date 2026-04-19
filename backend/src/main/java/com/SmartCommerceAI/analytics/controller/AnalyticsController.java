package com.SmartCommerceAI.analytics.controller;

import com.SmartCommerceAI.analytics.entity.VendorMetrics;
import com.SmartCommerceAI.analytics.repository.VendorMetricsRepository;
import com.SmartCommerceAI.common.dto.ApiResponse;
import com.SmartCommerceAI.order.repository.OrderRepository;
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

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final VendorRepository vendorRepository;
    private final VendorMetricsRepository vendorMetricsRepository;
    private final OrderRepository orderRepository;

    @GetMapping("/vendor/dashboard")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<ApiResponse<VendorMetrics>> getVendorDashboard(@AuthenticationPrincipal User currentUser) {
        Vendor vendor = vendorRepository.findByUser(currentUser)
                .orElseThrow(() -> new RuntimeException("Vendor profile not found"));

        VendorMetrics metrics = vendorMetricsRepository.findByVendorId(vendor.getId())
                .orElseGet(() -> VendorMetrics.builder().vendor(vendor).build());

        return ResponseEntity.ok(ApiResponse.success(metrics, "Vendor metrics retrieved"));
    }

    @GetMapping("/admin/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAdminDashboard() {
        long totalVendors   = vendorRepository.count();
        long totalOrders    = orderRepository.count();
        long pendingVendors = vendorRepository.countByStatus(
                com.SmartCommerceAI.vendor.entity.VendorStatus.PENDING);

        double totalRevenue = vendorMetricsRepository.findAll().stream()
                .mapToDouble(VendorMetrics::getGlobalRevenue)
                .sum();

        Map<String, Object> data = new HashMap<>();
        data.put("totalVendors",   totalVendors);
        data.put("totalOrders",    totalOrders);
        data.put("pendingVendors", pendingVendors);
        data.put("totalRevenue",   totalRevenue);

        return ResponseEntity.ok(ApiResponse.success(data, "Admin dashboard metrics retrieved"));
    }
}
