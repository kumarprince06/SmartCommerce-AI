package com.SmartCommerceAI.order.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OrderItemResponse {
    private Long id;
    private String productName;
    private String variantSku;
    private Integer quantity;
    private Double price;
    private Double totalPrice;
    private Double commissionAmount;
}
