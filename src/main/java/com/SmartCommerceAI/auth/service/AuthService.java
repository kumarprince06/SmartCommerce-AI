package com.SmartCommerceAI.auth.service;

import com.SmartCommerceAI.auth.dto.AuthResponse;
import com.SmartCommerceAI.auth.dto.RegisterRequest;
import com.SmartCommerceAI.user.entity.Role;
import com.SmartCommerceAI.user.entity.RoleType;
import com.SmartCommerceAI.user.entity.User;
import com.SmartCommerceAI.user.entity.UserStatus;
import com.SmartCommerceAI.user.repository.RoleRepository;
import com.SmartCommerceAI.user.repository.UserRepository;
import com.SmartCommerceAI.common.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        log.info("Attempting to register user with email: {}", request.getEmail());
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email is already registered");
        }

        RoleType requestedRoleType = RoleType.USER;
        if (request.getRole() != null && !request.getRole().isEmpty()) {
            try {
                requestedRoleType = RoleType.valueOf(request.getRole().toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid role provided");
            }
        }

        final RoleType finalRoleType = requestedRoleType;

        Role userRole = roleRepository.findByName(finalRoleType)
                .orElseGet(() -> {
                    Role newRole = new Role();
                    newRole.setName(finalRoleType);
                    return roleRepository.save(newRole);
                });

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .status(UserStatus.ACTIVE)
                .roles(Collections.singleton(userRole))
                .build();

        User savedUser = userRepository.save(user);
        var jwtToken = jwtService.generateToken(savedUser);

        log.info("User registered successfully: {}", savedUser.getEmail());
        return UserMapper.toAuthResponse(savedUser, jwtToken, "Registration successful");
    }

    public AuthResponse login(com.SmartCommerceAI.auth.dto.LoginRequest request) {
        log.info("Login attempt for email: {}", request.getEmail());
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        var jwtToken = jwtService.generateToken(user);

        log.info("User logged in successfully: {}", user.getEmail());
        return UserMapper.toAuthResponse(user, jwtToken, "Login successful");
    }
}
