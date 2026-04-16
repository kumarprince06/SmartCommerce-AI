package com.SmartCommerceAI.product.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "product_attributes", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"product_id", "attribute_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductAttribute {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "attribute_id", nullable = false)
    private Attribute attribute;
}
