package com.SmartCommerceAI.vendor.dto;

import com.SmartCommerceAI.vendor.entity.VendorStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class VendorResponse {
    private Long id;
    private String businessName;
    private String gstNumber;
    private VendorStatus status;
    private Double rating;
    private String newToken;
}
