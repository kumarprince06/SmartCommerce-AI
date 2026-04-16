package com.SmartCommerceAI.product.service;

import com.SmartCommerceAI.product.dto.InventoryUpdateRequest;
import com.SmartCommerceAI.product.dto.VariantResponse;
import com.SmartCommerceAI.product.entity.InventoryChangeType;
import com.SmartCommerceAI.product.entity.InventoryLog;
import com.SmartCommerceAI.product.entity.ProductVariant;
import com.SmartCommerceAI.product.entity.VariantAttributeValue;
import com.SmartCommerceAI.product.repository.InventoryLogRepository;
import com.SmartCommerceAI.product.repository.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class InventoryService {

    private final ProductVariantRepository variantRepository;
    private final InventoryLogRepository inventoryLogRepository;

    @Transactional
    public VariantResponse updateInventory(Long variantId, InventoryUpdateRequest request) {
        ProductVariant variant = variantRepository.findById(variantId)
                .orElseThrow(() -> new RuntimeException("Variant not found"));

        int currentStock = variant.getStock();
        int diff = request.getQuantity();

        if (request.getChangeType() == InventoryChangeType.IN) {
            variant.setStock(currentStock + diff);
        } else if (request.getChangeType() == InventoryChangeType.OUT || request.getChangeType() == InventoryChangeType.RESERVE) {
            if (currentStock - diff < 0) {
                throw new RuntimeException("Insufficient stock. Cannot go below 0! Current Stock: " + currentStock);
            }
            variant.setStock(currentStock - diff);
        }

        variant = variantRepository.save(variant);

        InventoryLog inventoryLog = InventoryLog.builder()
                .variant(variant)
                .changeType(request.getChangeType())
                .quantity(request.getQuantity())
                .referenceType(request.getReferenceType())
                .referenceId(request.getReferenceId())
                .build();
        inventoryLogRepository.save(inventoryLog);

        log.info("Inventory mapped cleanly. New Stock for variant ID {} is {}", variantId, variant.getStock());

        return mapToResponse(variant);
    }

    private VariantResponse mapToResponse(ProductVariant variant) {
        Map<String, String> map = new HashMap<>();
        if (variant.getAttributeValues() != null) {
            for (VariantAttributeValue vav : variant.getAttributeValues()) {
                map.put(vav.getAttributeValue().getAttribute().getName(), vav.getAttributeValue().getValue());
            }
        }

        return VariantResponse.builder()
                .id(variant.getId())
                .sku(variant.getSku())
                .price(variant.getPrice())
                .stock(variant.getStock())
                .attributes(map)
                .build();
    }
}
