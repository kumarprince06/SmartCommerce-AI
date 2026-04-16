package com.SmartCommerceAI.order.dto;

import com.SmartCommerceAI.order.entity.OrderStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OrderStatusUpdateRequest {
    @NotNull(message = "Target status is required")
    private OrderStatus status;
    
    private String note;
}
