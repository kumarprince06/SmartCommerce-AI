package com.SmartCommerceAI.analytics.entity;

import com.SmartCommerceAI.product.entity.Product;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "product_metrics")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductMetrics {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false, unique = true)
    private Product product;

    @Column(nullable = false)
    @Builder.Default
    private Long viewsCount = 0L;

    @Column(nullable = false)
    @Builder.Default
    private Long salesCount = 0L;
    
    @Column(nullable = false)
    @Builder.Default
    private Double totalRevenue = 0.0;
}
