package com.SmartCommerceAI.product.service;

import com.SmartCommerceAI.product.dto.VariantCreationRequest;
import com.SmartCommerceAI.product.dto.VariantParams;
import com.SmartCommerceAI.product.dto.VariantResponse;
import com.SmartCommerceAI.product.entity.*;
import com.SmartCommerceAI.product.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductVariantService {

    private final ProductRepository productRepository;
    private final ProductVariantRepository variantRepository;
    private final AttributeRepository attributeRepository;
    private final AttributeValueRepository attributeValueRepository;
    private final ProductAttributeRepository productAttributeRepository;
    private final VariantAttributeValueRepository variantAttributeValueRepository;

    @Transactional
    public List<VariantResponse> createVariants(Long productId, VariantCreationRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        List<ProductVariant> savedVariants = new ArrayList<>();

        for (VariantParams param : request.getVariants()) {
            if (variantRepository.findBySku(param.getSku()).isPresent()) {
                throw new RuntimeException("SKU already exists: " + param.getSku());
            }

            ProductVariant variant = ProductVariant.builder()
                    .product(product)
                    .sku(param.getSku())
                    .price(param.getPrice())
                    .stock(param.getStock())
                    .status(ProductStatus.ACTIVE)
                    .build();

            variant = variantRepository.save(variant);

            Map<String, String> attributesMap = param.getAttributes();
            for (Map.Entry<String, String> entry : attributesMap.entrySet()) {
                String attrName = entry.getKey();
                String attrValStr = entry.getValue();

                Attribute attribute = attributeRepository.findByName(attrName)
                        .orElseThrow(() -> new RuntimeException("Attribute not recognized: " + attrName));

                // Verify this attribute binds to this product
                if (productAttributeRepository.findByProductIdAndAttributeId(productId, attribute.getId()).isEmpty()) {
                    throw new RuntimeException("Product does not support attribute: " + attrName);
                }

                AttributeValue attributeValue = attributeValueRepository.findByAttributeIdAndValue(attribute.getId(), attrValStr)
                        .orElseThrow(() -> new RuntimeException("Unrecognized attribute value: " + attrValStr + " for " + attrName));

                VariantAttributeValue vav = VariantAttributeValue.builder()
                        .variant(variant)
                        .attributeValue(attributeValue)
                        .build();

                variantAttributeValueRepository.save(vav);
                variant.getAttributeValues().add(vav);
            }
            savedVariants.add(variant);
        }

        log.info("Successfully registered {} variants over Product {}", savedVariants.size(), productId);
        return savedVariants.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<VariantResponse> getVariantsForProduct(Long productId) {
        return variantRepository.findByProductId(productId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public VariantResponse getVariantById(Long id) {
        ProductVariant variant = variantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Variant not found"));
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
