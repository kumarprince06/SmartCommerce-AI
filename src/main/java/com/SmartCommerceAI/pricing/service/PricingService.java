package com.SmartCommerceAI.pricing.service;

import com.SmartCommerceAI.product.entity.ProductVariant;
import org.springframework.stereotype.Service;

@Service
public class PricingService {

    public Double calculateBasePrice(ProductVariant variant, int quantity) {
        // Modularly decoupled! Future logics expanding discounts map natively here without mutating Orders!
        return variant.getPrice() * quantity;
    }
}
