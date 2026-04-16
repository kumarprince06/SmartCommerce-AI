package com.SmartCommerceAI.analytics.repository;

import com.SmartCommerceAI.analytics.entity.VendorMetrics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VendorMetricsRepository extends JpaRepository<VendorMetrics, Long> {
    Optional<VendorMetrics> findByVendorId(Long vendorId);
}
