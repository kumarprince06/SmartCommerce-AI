package com.SmartCommerceAI.vendor.dto;

import com.SmartCommerceAI.vendor.entity.VendorStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class VendorStatusUpdateRequest {
    @NotNull(message = "Status is required")
    private VendorStatus status;
}
