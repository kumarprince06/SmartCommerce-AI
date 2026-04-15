package com.SmartCommerceAI.user.service;

import com.SmartCommerceAI.user.dto.UserResponse;
import com.SmartCommerceAI.user.dto.UserUpdateRequest;
import com.SmartCommerceAI.user.entity.User;
import com.SmartCommerceAI.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserResponse getUserProfile(User currentUser) {
        List<String> rolesList = currentUser.getRoles().stream()
                .map(role -> role.getName().name())
                .collect(Collectors.toList());

        return UserResponse.builder()
                .id(currentUser.getId())
                .name(currentUser.getName())
                .email(currentUser.getEmail())
                .roles(rolesList)
                .build();
    }

    @Transactional
    public UserResponse updateUserProfile(User currentUser, UserUpdateRequest request) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(request.getName());
        User updatedUser = userRepository.save(user);

        List<String> rolesList = updatedUser.getRoles().stream()
                .map(role -> role.getName().name())
                .collect(Collectors.toList());

        return UserResponse.builder()
                .id(updatedUser.getId())
                .name(updatedUser.getName())
                .email(updatedUser.getEmail())
                .roles(rolesList)
                .build();
    }
}
