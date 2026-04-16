package com.SmartCommerceAI.order.dto;

import com.SmartCommerceAI.order.entity.OrderStatus;
import com.SmartCommerceAI.order.entity.PaymentStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class OrderResponse {
    private Long id;
    private Long userId;
    private OrderStatus status;
    private PaymentStatus paymentStatus;
    private Double totalAmount;
    private List<OrderItemResponse> items;
    private LocalDateTime createdAt;
}
