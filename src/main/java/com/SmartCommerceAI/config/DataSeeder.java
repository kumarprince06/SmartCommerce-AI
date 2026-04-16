package com.SmartCommerceAI.config;

import com.SmartCommerceAI.auth.service.AuthService;
import com.SmartCommerceAI.category.entity.Category;
import com.SmartCommerceAI.category.repository.CategoryRepository;
import com.SmartCommerceAI.product.entity.*;
import com.SmartCommerceAI.product.repository.*;
import com.SmartCommerceAI.user.entity.Role;
import com.SmartCommerceAI.user.entity.RoleType;
import com.SmartCommerceAI.user.entity.User;
import com.SmartCommerceAI.user.entity.UserStatus;
import com.SmartCommerceAI.user.repository.RoleRepository;
import com.SmartCommerceAI.user.repository.UserRepository;
import com.SmartCommerceAI.vendor.entity.Vendor;
import com.SmartCommerceAI.vendor.entity.VendorStatus;
import com.SmartCommerceAI.vendor.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final VendorRepository vendorRepository;
    private final CategoryRepository categoryRepository;
    private final AttributeRepository attributeRepository;
    private final AttributeValueRepository attributeValueRepository;
    private final ProductRepository productRepository;
    private final ProductAttributeRepository productAttributeRepository;
    private final ProductVariantRepository variantRepository;
    private final VariantAttributeValueRepository variantAttributeValueRepository;
    private final InventoryLogRepository inventoryLogRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (productRepository.count() >= 50) {
            log.info("Database already seeded with extensive mock data. Skipping DataSeeder.");
            return;
        }
        log.info("Starting DataSeeder... Planting 50 products.");

        // 1. Setup Roles
        Role userRole = createRoleIfNotExists(RoleType.USER);
        Role adminRole = createRoleIfNotExists(RoleType.ADMIN);
        Role vendorRole = createRoleIfNotExists(RoleType.VENDOR);

        // 2. Setup Seed Users
        User admin = createUserIfNotExists("Admin User", "admin@super.com", adminRole);
        User vUser1 = createUserIfNotExists("Tech Vendor User", "v1@tech.com", vendorRole);
        User vUser2 = createUserIfNotExists("Fashion Vendor User", "v2@fashion.com", vendorRole);

        // 3. Mount Vendors
        Vendor vendor1 = createVendorIfNotExists(vUser1, "CyberTech Inc", "GST111");
        Vendor vendor2 = createVendorIfNotExists(vUser2, "Urban Outfits", "GST222");

        // 4. Categories Tree
        Category electronics = createCat("Electronics", null);
        Category phones = createCat("Smartphones", electronics);
        Category laptops = createCat("Laptops", electronics);
        Category fashion = createCat("Fashion", null);
        Category shirts = createCat("Shirts", fashion);

        // 5. Attributes & Values
        Attribute colorAttr = createAttr("Color", List.of("Red", "Blue", "Black", "White"));
        Attribute storageAttr = createAttr("Storage", List.of("64GB", "128GB", "256GB"));
        Attribute sizeAttr = createAttr("Size", List.of("S", "M", "L", "XL"));

        // Preload maps for quick random picking
        List<Vendor> vendors = List.of(vendor1, vendor2);
        List<Category> techCats = List.of(phones, laptops);
        List<Category> fashionCats = List.of(shirts);
        
        List<String> techAdjectives = List.of("Pro", "Max", "Ultra", "Lite", "Plus", "Gaming", "Business");
        List<String> fashionAdjectives = List.of("Slim-Fit", "Casual", "Formal", "Cotton", "Premium", "Summer");

        Random random = new Random();

        // 6. Generate 50 Random Products!
        for (int i = 1; i <= 50; i++) {
            boolean isTech = random.nextBoolean();
            Vendor chosenVendor = isTech ? vendor1 : vendor2;
            Category chosenCat = isTech ? techCats.get(random.nextInt(techCats.size())) : fashionCats.get(random.nextInt(fashionCats.size()));
            String name = (isTech ? "Device " : "Apparel ") + i + " " + (isTech ? techAdjectives.get(random.nextInt(techAdjectives.size())) : fashionAdjectives.get(random.nextInt(fashionAdjectives.size())));

            Product product = Product.builder()
                    .vendor(chosenVendor)
                    .category(chosenCat)
                    .name(name)
                    .description("Automatically generated realistic mock description for " + name)
                    .status(ProductStatus.ACTIVE)
                    .build();
            product = productRepository.save(product);

            // 7. Bind Target Attributes to Product
            List<Attribute> supportedAttrs = new ArrayList<>();
            supportedAttrs.add(colorAttr); // Everything usually has a color
            if (isTech) {
                supportedAttrs.add(storageAttr);
            } else {
                supportedAttrs.add(sizeAttr);
            }

            for (Attribute attr : supportedAttrs) {
                ProductAttribute pa = ProductAttribute.builder()
                        .product(product)
                        .attribute(attr)
                        .build();
                productAttributeRepository.save(pa);
            }

            // 8. Generate 2 to 4 Variants per product
            int variantsCount = 2 + random.nextInt(3);
            for (int v = 1; v <= variantsCount; v++) {
                String variantSku = "SKU-" + (isTech ? "TECH-" : "FASH-") + product.getId() + "-V" + v + "-" + random.nextInt(9999);
                int stockCount = 10 + random.nextInt(100);
                
                ProductVariant variant = ProductVariant.builder()
                        .product(product)
                        .sku(variantSku)
                        .price(10.0 + random.nextInt(990))
                        .stock(stockCount)
                        .status(ProductStatus.ACTIVE)
                        .build();
                variant = variantRepository.save(variant);

                // Inventory Log for initial stock
                InventoryLog logEntry = InventoryLog.builder()
                        .variant(variant)
                        .changeType(InventoryChangeType.IN)
                        .quantity(stockCount)
                        .referenceType("SYSTEM_SEED")
                        .referenceId(0L)
                        .build();
                inventoryLogRepository.save(logEntry);

                // Pick random AttributeValues
                for (Attribute attr : supportedAttrs) {
                    List<AttributeValue> vals = attr.getValues();
                    AttributeValue chosenVal = vals.get(random.nextInt(vals.size()));

                    VariantAttributeValue vav = VariantAttributeValue.builder()
                            .variant(variant)
                            .attributeValue(chosenVal)
                            .build();
                    variantAttributeValueRepository.save(vav);
                }
            }
        }
        log.info("DataSeeder completed successfully! 50+ Products securely stored alongside Variants and Initial Inventory.");
    }

    private Role createRoleIfNotExists(RoleType type) {
        return roleRepository.findByName(type).orElseGet(() -> {
            Role r = new Role();
            r.setName(type);
            return roleRepository.save(r);
        });
    }

    private User createUserIfNotExists(String name, String email, Role role) {
        return userRepository.findByEmail(email).orElseGet(() -> {
            User u = User.builder()
                    .name(name)
                    .email(email)
                    .password(passwordEncoder.encode("Password@123"))
                    .status(UserStatus.ACTIVE)
                    .roles(new HashSet<>(List.of(role)))
                    .build();
            return userRepository.save(u);
        });
    }

    private Vendor createVendorIfNotExists(User user, String bName, String gst) {
        return vendorRepository.findByUser(user).orElseGet(() -> {
            Vendor v = Vendor.builder()
                    .user(user)
                    .businessName(bName)
                    .gstNumber(gst)
                    .status(VendorStatus.APPROVED)
                    .rating(5.0)
                    .build();
            return vendorRepository.save(v);
        });
    }

    private Category createCat(String name, Category parent) {
        int level = parent == null ? 0 : parent.getLevel() + 1;
        if (!categoryRepository.existsByName(name)) {
            Category c = Category.builder().name(name).parent(parent).level(level).build();
            return categoryRepository.save(c);
        }
        return categoryRepository.findAll().stream().filter(c -> c.getName().equals(name)).findFirst().get();
    }

    private Attribute createAttr(String name, List<String> vals) {
        Attribute attr = attributeRepository.findByName(name).orElseGet(() -> {
            Attribute a = Attribute.builder().name(name).build();
            return attributeRepository.save(a);
        });
        for (String v : vals) {
            if (attributeValueRepository.findByAttributeIdAndValue(attr.getId(), v).isEmpty()) {
                AttributeValue av = AttributeValue.builder().attribute(attr).value(v).build();
                attributeValueRepository.save(av);
                attr.getValues().add(av);
            }
        }
        return attributeRepository.save(attr);
    }
}
