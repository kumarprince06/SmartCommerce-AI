package com.SmartCommerceAI.ai.repository;

import com.SmartCommerceAI.ai.entity.AIRecommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AIRecommendationRepository extends JpaRepository<AIRecommendation, Long> {
    
    @Query("SELECT a FROM AIRecommendation a WHERE a.product.vendor.id = :vendorId ORDER BY a.createdAt DESC")
    List<AIRecommendation> findAllLatestByVendor(@Param("vendorId") Long vendorId);
}
