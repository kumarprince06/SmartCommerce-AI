package com.SmartCommerceAI.vendor.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateVendorRequest {
    @NotBlank(message = "Business name is required")
    private String businessName;

    @NotBlank(message = "GST number is required")
    private String gstNumber;
}
