package com.SmartCommerceAI.product.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import java.util.List;

@Data
public class VariantCreationRequest {
    @NotEmpty(message = "Variants list cannot be empty")
    @Valid
    private List<VariantParams> variants;
}
