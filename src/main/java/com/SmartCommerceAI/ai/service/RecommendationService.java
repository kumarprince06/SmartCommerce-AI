package com.SmartCommerceAI.ai.service;

import com.SmartCommerceAI.ai.entity.AIRecommendation;
import com.SmartCommerceAI.ai.repository.AIRecommendationRepository;
import com.SmartCommerceAI.analytics.entity.ProductMetrics;
import com.SmartCommerceAI.analytics.repository.ProductMetricsRepository;
import com.SmartCommerceAI.product.entity.Product;
import com.SmartCommerceAI.product.entity.ProductVariant;
import com.SmartCommerceAI.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final ProductRepository productRepository;
    private final ProductMetricsRepository productMetricsRepository;
    private final AIRecommendationRepository aiRecommendationRepository;
    private final com.SmartCommerceAI.product.repository.ProductVariantRepository variantRepository;

    @Transactional
    public AIRecommendation generateRecommendation(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product mapping absent from catalog"));

        ProductMetrics metrics = productMetricsRepository.findByProductId(productId)
                .orElseThrow(() -> new RuntimeException("Metrics module hasn't recorded adequate traffic arrays for AI modeling yet"));

        // AI Rule-Based Aggregation Logic analyzing real-time limits
        double views = metrics.getViewsCount() > 0 ? metrics.getViewsCount() : 1;
        double conversionRate = metrics.getSalesCount() / views;
        
        List<ProductVariant> variants = variantRepository.findByProductId(productId);
        Double currentAveragePrice = variants.stream()
                .mapToDouble(ProductVariant::getPrice)
                .average()
                .orElse(0.0);

        Double suggestedPrice;
        String reason;

        if (conversionRate < 0.05 && views >= 10) {
            suggestedPrice = currentAveragePrice * 0.90; // 10% Drop
            reason = String.format("Conversion rate is dangerously low (%.1f%%). Dropping price by 10%% will recapture lost traffic bounds.", conversionRate * 100);
        } else if (conversionRate > 0.20 && metrics.getSalesCount() >= 5) {
            suggestedPrice = currentAveragePrice * 1.15; // 15% Increase
            reason = String.format("High demand velocity detected (%.1f%% conversion). Suggesting 15%% algorithmic markup maximizing scale margins.", conversionRate * 100);
        } else {
            suggestedPrice = currentAveragePrice;
            reason = "Current pricing bounds natively match localized market elasticity perfectly. Hold scale.";
        }

        AIRecommendation recommendation = AIRecommendation.builder()
                .product(product)
                .suggestedPrice(Math.round(suggestedPrice * 100.0) / 100.0)
                .reason(reason)
                .build();
        return aiRecommendationRepository.save(recommendation);
    }
}
