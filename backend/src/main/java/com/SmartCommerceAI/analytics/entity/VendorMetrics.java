package com.SmartCommerceAI.analytics.entity;

import com.SmartCommerceAI.vendor.entity.Vendor;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "vendor_metrics")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VendorMetrics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id", nullable = false, unique = true)
    private Vendor vendor;

    @Column(nullable = false)
    @Builder.Default
    private Long totalSales = 0L;

    @Column(nullable = false)
    @Builder.Default
    private Long totalOrders = 0L;

    @Column(nullable = false)
    @Builder.Default
    private Double globalRevenue = 0.0;
}
