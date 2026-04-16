package com.SmartCommerceAI.common.service;

import com.SmartCommerceAI.analytics.entity.ProductMetrics;
import com.SmartCommerceAI.analytics.entity.VendorMetrics;
import com.SmartCommerceAI.analytics.repository.ProductMetricsRepository;
import com.SmartCommerceAI.analytics.repository.VendorMetricsRepository;
import com.SmartCommerceAI.order.entity.Order;
import com.SmartCommerceAI.order.entity.OrderItem;
import com.SmartCommerceAI.product.entity.Product;
import com.SmartCommerceAI.vendor.entity.Vendor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final ProductMetricsRepository productMetricsRepository;
    private final VendorMetricsRepository vendorMetricsRepository;
    
    @Async
    @Transactional
    public void logOrderPlacement(Order order) {
        log.info("ASYNC TASK: Analytics metric logged globally for revenue on Order #{}", order.getId());
        for (OrderItem item : order.getItems()) {
            // Update Product Metrics
            Product product = item.getProduct();
            ProductMetrics pMetrics = productMetricsRepository.findByProductId(product.getId())
                    .orElseGet(() -> ProductMetrics.builder().product(product).build());
            
            pMetrics.setSalesCount(pMetrics.getSalesCount() + item.getQuantity());
            pMetrics.setTotalRevenue(pMetrics.getTotalRevenue() + item.getTotalPrice());
            productMetricsRepository.save(pMetrics);

            // Update Vendor Metrics
            Vendor vendor = product.getVendor();
            VendorMetrics vMetrics = vendorMetricsRepository.findByVendorId(vendor.getId())
                    .orElseGet(() -> VendorMetrics.builder().vendor(vendor).build());

            vMetrics.setTotalOrders(vMetrics.getTotalOrders() + 1);
            vMetrics.setTotalSales(vMetrics.getTotalSales() + item.getQuantity());
            vMetrics.setGlobalRevenue(vMetrics.getGlobalRevenue() + item.getTotalPrice());
            vendorMetricsRepository.save(vMetrics);
        }
    }

    @Async
    @Transactional
    public void logProductView(Product product) {
        ProductMetrics metrics = productMetricsRepository.findByProductId(product.getId())
                .orElseGet(() -> ProductMetrics.builder().product(product).build());
        metrics.setViewsCount(metrics.getViewsCount() + 1);
        productMetricsRepository.save(metrics);
        log.debug("Incremented view boundaries for product #{}", product.getId());
    }
}
