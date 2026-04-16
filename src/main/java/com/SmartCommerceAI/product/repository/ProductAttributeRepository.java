package com.SmartCommerceAI.product.repository;

import com.SmartCommerceAI.product.entity.ProductAttribute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductAttributeRepository extends JpaRepository<ProductAttribute, Long> {
    List<ProductAttribute> findByProductId(Long productId);
    Optional<ProductAttribute> findByProductIdAndAttributeId(Long productId, Long attributeId);
}
