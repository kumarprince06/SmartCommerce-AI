package com.SmartCommerceAI.order.repository;

import com.SmartCommerceAI.order.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Page<Order> findByUserId(Long userId, Pageable pageable);
    Optional<Order> findByIdAndUserId(Long id, Long userId);

    @Query("SELECT DISTINCT o FROM Order o JOIN o.items i WHERE i.vendor.id = :vendorId")
    Page<Order> findOrdersByVendorId(@Param("vendorId") Long vendorId, Pageable pageable);
}
