package com.SmartCommerceAI.analytics.repository;

import com.SmartCommerceAI.analytics.entity.ProductMetrics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductMetricsRepository extends JpaRepository<ProductMetrics, Long> {
    Optional<ProductMetrics> findByProductId(Long productId);
}
