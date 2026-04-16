package com.SmartCommerceAI.commission.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "commission_rules")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommissionRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CommissionType type;

    @Column(name = "reference_id")
    private Long referenceId; // NULL if type is GLOBAL

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CommissionValueType valueType;

    @Column(nullable = false)
    private Double value;

    @Column(nullable = false)
    private Integer priority;
}
