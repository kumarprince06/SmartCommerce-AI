package com.SmartCommerceAI.ai.controller;

import com.SmartCommerceAI.ai.entity.AIRecommendation;
import com.SmartCommerceAI.ai.repository.AIRecommendationRepository;
import com.SmartCommerceAI.ai.service.RecommendationService;
import com.SmartCommerceAI.common.dto.ApiResponse;
import com.SmartCommerceAI.user.entity.User;
import com.SmartCommerceAI.vendor.entity.Vendor;
import com.SmartCommerceAI.vendor.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ai")
@RequiredArgsConstructor
public class AIController {

    private final RecommendationService recommendationService;
    private final AIRecommendationRepository aiRecommendationRepository;
    private final VendorRepository vendorRepository;

    @PostMapping("/pricing/recommendations/{productId}")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<ApiResponse<AIRecommendation>> generatePricingRecommendation(
            @PathVariable Long productId
    ) {
        AIRecommendation insight = recommendationService.generateRecommendation(productId);
        return ResponseEntity.ok(ApiResponse.success(insight, "AI successfully modeled mapping boundaries natively"));
    }

    @GetMapping("/recommendations")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<ApiResponse<List<AIRecommendation>>> getGlobalVendorRecommendations(
            @AuthenticationPrincipal User currentUser
    ) {
        Vendor vendor = vendorRepository.findByUser(currentUser)
                .orElseThrow(() -> new RuntimeException("Vendor permissions explicitly required"));
                
        List<AIRecommendation> insights = aiRecommendationRepository.findAllLatestByVendor(vendor.getId());
        return ResponseEntity.ok(ApiResponse.success(insights, "All tracked predictive insights delivered"));
    }
}
