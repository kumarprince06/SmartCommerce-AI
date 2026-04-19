package com.SmartCommerceAI.vendor.repository;

import com.SmartCommerceAI.user.entity.User;
import com.SmartCommerceAI.vendor.entity.Vendor;
import com.SmartCommerceAI.vendor.entity.VendorStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface VendorRepository extends JpaRepository<Vendor, Long> {
    boolean existsByUser(User user);
    boolean existsByBusinessName(String businessName);
    boolean existsByGstNumber(String gstNumber);
    Optional<Vendor> findByUser(User user);
    long countByStatus(VendorStatus status);
}
