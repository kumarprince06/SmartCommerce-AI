package com.SmartCommerceAI.product.service;

import com.SmartCommerceAI.product.dto.AttributeRequest;
import com.SmartCommerceAI.product.dto.AttributeValueRequest;
import com.SmartCommerceAI.product.dto.ProductAttributeRequest;
import com.SmartCommerceAI.product.entity.Attribute;
import com.SmartCommerceAI.product.entity.AttributeValue;
import com.SmartCommerceAI.product.entity.Product;
import com.SmartCommerceAI.product.entity.ProductAttribute;
import com.SmartCommerceAI.product.repository.AttributeRepository;
import com.SmartCommerceAI.product.repository.AttributeValueRepository;
import com.SmartCommerceAI.product.repository.ProductAttributeRepository;
import com.SmartCommerceAI.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AttributeService {

    private final AttributeRepository attributeRepository;
    private final AttributeValueRepository attributeValueRepository;
    private final ProductRepository productRepository;
    private final ProductAttributeRepository productAttributeRepository;

    @Transactional
    public Attribute createAttribute(AttributeRequest request) {
        if (attributeRepository.findByName(request.getName()).isPresent()) {
            throw new RuntimeException("Attribute name already exists");
        }
        Attribute attribute = Attribute.builder()
                .name(request.getName())
                .build();
        return attributeRepository.save(attribute);
    }

    @Transactional
    public AttributeValue createAttributeValue(Long attributeId, AttributeValueRequest request) {
        Attribute attribute = attributeRepository.findById(attributeId)
                .orElseThrow(() -> new RuntimeException("Attribute not found"));

        if (attributeValueRepository.findByAttributeIdAndValue(attributeId, request.getValue()).isPresent()) {
            throw new RuntimeException("This value already exists for the attribute");
        }

        AttributeValue value = AttributeValue.builder()
                .attribute(attribute)
                .value(request.getValue())
                .build();
        return attributeValueRepository.save(value);
    }

    @Transactional
    public void mapAttributesToProduct(Long productId, ProductAttributeRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        for (Long attrId : request.getAttributeIds()) {
            Attribute attribute = attributeRepository.findById(attrId)
                    .orElseThrow(() -> new RuntimeException("Attribute not found: " + attrId));

            if (productAttributeRepository.findByProductIdAndAttributeId(productId, attrId).isEmpty()) {
                ProductAttribute pa = ProductAttribute.builder()
                        .product(product)
                        .attribute(attribute)
                        .build();
                productAttributeRepository.save(pa);
            }
        }
        log.info("Successfully registered {} attributes onto Product {}", request.getAttributeIds().size(), productId);
    }
    
    public List<Attribute> getAllAttributes() {
        return attributeRepository.findAll();
    }
}
