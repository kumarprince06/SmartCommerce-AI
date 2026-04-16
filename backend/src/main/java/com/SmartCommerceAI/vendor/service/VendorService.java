package com.SmartCommerceAI.vendor.service;

import com.SmartCommerceAI.auth.service.JwtService;
import com.SmartCommerceAI.user.entity.Role;
import com.SmartCommerceAI.user.entity.RoleType;
import com.SmartCommerceAI.user.entity.User;
import com.SmartCommerceAI.user.repository.RoleRepository;
import com.SmartCommerceAI.user.repository.UserRepository;
import com.SmartCommerceAI.vendor.dto.CreateVendorRequest;
import com.SmartCommerceAI.vendor.dto.VendorResponse;
import com.SmartCommerceAI.vendor.dto.VendorStatusUpdateRequest;
import com.SmartCommerceAI.vendor.entity.Vendor;
import com.SmartCommerceAI.vendor.entity.VendorStatus;
import com.SmartCommerceAI.vendor.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class VendorService {

    private final VendorRepository vendorRepository;
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    @Transactional
    public VendorResponse registerVendor(User currentUser, CreateVendorRequest request) {
        log.info("Elevating user {} to VENDOR", currentUser.getEmail());

        if (vendorRepository.existsByUser(currentUser)) {
            throw new RuntimeException("User is already registered as a vendor");
        }
        if (vendorRepository.existsByGstNumber(request.getGstNumber())) {
            throw new RuntimeException("GST Number already in use");
        }

        // Attach VENDOR Role
        Role vendorRole = roleRepository.findByName(RoleType.VENDOR)
                .orElseGet(() -> {
                    Role newRole = new Role();
                    newRole.setName(RoleType.VENDOR);
                    return roleRepository.save(newRole);
                });

        currentUser.getRoles().add(vendorRole);
        User updatedUser = userRepository.save(currentUser);

        // Create new Vendor profile
        Vendor vendor = Vendor.builder()
                .user(updatedUser)
                .businessName(request.getBusinessName())
                .gstNumber(request.getGstNumber())
                .status(VendorStatus.PENDING)
                .rating(0.0)
                .build();

        Vendor savedVendor = vendorRepository.save(vendor);

        // Generate a new refreshed JWT reflecting the new roles
        String newToken = jwtService.generateToken(updatedUser);

        log.info("Successfully registered user {} as VENDOR and generated refreshed JWT", updatedUser.getEmail());

        return mapToResponse(savedVendor, newToken);
    }

    public VendorResponse getVendorById(Long id) {
        Vendor vendor = vendorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vendor not found"));
        return mapToResponse(vendor, null);
    }

    public VendorResponse getVendorProfile(User currentUser) {
        Vendor vendor = vendorRepository.findByUser(currentUser)
                .orElseThrow(() -> new RuntimeException("You are not registered as a vendor"));
        return mapToResponse(vendor, null);
    }

    @Transactional
    public VendorResponse updateVendorStatus(Long id, VendorStatusUpdateRequest request) {
        Vendor vendor = vendorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vendor not found"));

        log.info("Updating status for vendor ID {} to {}", id, request.getStatus());
        vendor.setStatus(request.getStatus());
        Vendor savedVendor = vendorRepository.save(vendor);

        return mapToResponse(savedVendor, null);
    }

    private VendorResponse mapToResponse(Vendor vendor, String newToken) {
        return VendorResponse.builder()
                .id(vendor.getId())
                .businessName(vendor.getBusinessName())
                .gstNumber(vendor.getGstNumber())
                .status(vendor.getStatus())
                .rating(vendor.getRating())
                .newToken(newToken)
                .build();
    }
}
