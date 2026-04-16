package com.SmartCommerceAI.category.service;

import com.SmartCommerceAI.category.dto.CategoryResponse;
import com.SmartCommerceAI.category.dto.CreateCategoryRequest;
import com.SmartCommerceAI.category.entity.Category;
import com.SmartCommerceAI.category.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    @Transactional
    public CategoryResponse createCategory(CreateCategoryRequest request) {
        if (categoryRepository.existsByName(request.getName())) {
            throw new RuntimeException("Category name already exists");
        }

        Category parent = null;
        int level = 0;

        if (request.getParentId() != null) {
            parent = categoryRepository.findById(request.getParentId())
                    .orElseThrow(() -> new RuntimeException("Parent category not found"));
            level = parent.getLevel() + 1;
        }

        Category category = Category.builder()
                .name(request.getName())
                .parent(parent)
                .level(level)
                .build();

        Category savedCategory = categoryRepository.save(category);
        log.info("Created category {} at level {}", savedCategory.getName(), savedCategory.getLevel());

        return mapToResponse(savedCategory);
    }

    public List<CategoryResponse> getAllCategories() {
        List<Category> roots = categoryRepository.findByParentIsNull();
        return roots.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private CategoryResponse mapToResponse(Category category) {
        List<CategoryResponse> mappedChildren = null;
        if (category.getSubCategories() != null && !category.getSubCategories().isEmpty()) {
            mappedChildren = category.getSubCategories().stream()
                    .map(this::mapToResponse)
                    .collect(Collectors.toList());
        }

        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .level(category.getLevel())
                .subCategories(mappedChildren)
                .build();
    }
}
