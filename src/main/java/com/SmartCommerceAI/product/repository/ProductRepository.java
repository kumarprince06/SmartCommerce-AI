package com.SmartCommerceAI.product.repository;

import com.SmartCommerceAI.product.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    @Query("SELECT p FROM Product p WHERE " +
           "(:categoryId IS NULL OR p.category.id = :categoryId) AND " +
           "(:vendorId IS NULL OR p.vendor.id = :vendorId)")
    Page<Product> findWithFilters(@Param("categoryId") Long categoryId,
                                  @Param("vendorId") Long vendorId,
                                  Pageable pageable);
}
