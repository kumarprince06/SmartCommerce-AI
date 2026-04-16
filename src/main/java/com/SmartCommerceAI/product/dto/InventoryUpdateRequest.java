package com.SmartCommerceAI.product.dto;

import com.SmartCommerceAI.product.entity.InventoryChangeType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class InventoryUpdateRequest {
    @NotNull(message = "Change type cannot be null")
    private InventoryChangeType changeType;

    @NotNull(message = "Quantity cannot be null")
    @Min(value = 1, message = "Update quantity must be strictly greater than 0")
    private Integer quantity;

    private String referenceType;
    private Long referenceId;
}
