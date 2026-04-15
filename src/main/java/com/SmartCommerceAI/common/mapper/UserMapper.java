package com.SmartCommerceAI.common.mapper;

import com.SmartCommerceAI.user.entity.User;
import com.SmartCommerceAI.user.dto.UserResponse;
import com.SmartCommerceAI.auth.dto.AuthResponse;

import java.util.List;
import java.util.stream.Collectors;

public class UserMapper {

    public static List<String> extractRoles(User user) {
        return user.getRoles().stream()
                .map(role -> role.getName().name())
                .collect(Collectors.toList());
    }

    public static UserResponse toUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .roles(extractRoles(user))
                .build();
    }

    public static AuthResponse toAuthResponse(User user, String token, String message) {
        return AuthResponse.builder()
                .token(token)
                .message(message)
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .roles(extractRoles(user))
                .build();
    }
}
