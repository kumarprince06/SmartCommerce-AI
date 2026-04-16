package com.SmartCommerceAI.product.service;

import com.SmartCommerceAI.category.entity.Category;
import com.SmartCommerceAI.category.repository.CategoryRepository;
import com.SmartCommerceAI.common.dto.PaginatedResponse;
import com.SmartCommerceAI.product.dto.CreateProductRequest;
import com.SmartCommerceAI.product.dto.ProductResponse;
import com.SmartCommerceAI.product.entity.Product;
import com.SmartCommerceAI.product.entity.ProductStatus;
import com.SmartCommerceAI.product.repository.ProductRepository;
import com.SmartCommerceAI.user.entity.User;
import com.SmartCommerceAI.vendor.entity.Vendor;
import com.SmartCommerceAI.vendor.entity.VendorStatus;
import com.SmartCommerceAI.vendor.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final VendorRepository vendorRepository;
    private final CategoryRepository categoryRepository;

    @Transactional
    public ProductResponse createProduct(User currentUser, CreateProductRequest request) {
        log.info("Attempting to create product: {}", request.getName());

        Vendor vendor = vendorRepository.findByUser(currentUser)
                .orElseThrow(() -> new RuntimeException("Vendor profile not found for current user"));

        if (!VendorStatus.APPROVED.equals(vendor.getStatus())) {
            throw new RuntimeException("Only approved vendors can create products");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category does not exist"));

        Product product = Product.builder()
                .vendor(vendor)
                .category(category)
                .name(request.getName())
                .description(request.getDescription())
                .status(ProductStatus.ACTIVE)
                .build();

        Product savedProduct = productRepository.save(product);
        log.info("Product created successfully with ID: {}", savedProduct.getId());

        return mapToResponse(savedProduct);
    }

    public PaginatedResponse<ProductResponse> getProducts(Long categoryId, Long vendorId, Pageable pageable) {
        Page<Product> productsPage = productRepository.findWithFilters(categoryId, vendorId, pageable);
        
        Page<ProductResponse> dtoPage = productsPage.map(this::mapToResponse);
        return PaginatedResponse.of(dtoPage);
    }

    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return mapToResponse(product);
    }

    private ProductResponse mapToResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .vendorId(product.getVendor().getId())
                .businessName(product.getVendor().getBusinessName())
                .categoryId(product.getCategory().getId())
                .categoryName(product.getCategory().getName())
                .name(product.getName())
                .description(product.getDescription())
                .status(product.getStatus())
                .createdAt(product.getCreatedAt())
                .build();
    }
}
