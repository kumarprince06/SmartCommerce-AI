package com.SmartCommerceAI.pricing.service;

import com.SmartCommerceAI.product.entity.ProductVariant;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
public class PricingService {

    @Cacheable(value = "variantPricing", key = "#variant.id.toString() + '-' + #quantity.toString()", unless = "#result == null")
    public Double calculateBasePrice(ProductVariant variant, int quantity) {
        // Modularly decoupled! Future logics expanding discounts map natively here without mutating Orders!
        // The @Cacheable instantly retrieves calculations natively bypassing CPU limits!
        return variant.getPrice() * quantity;
    }
}
