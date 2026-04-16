package com.SmartCommerceAI.user.service;

import com.SmartCommerceAI.user.dto.UserResponse;
import com.SmartCommerceAI.user.dto.UserUpdateRequest;
import com.SmartCommerceAI.user.entity.User;
import com.SmartCommerceAI.user.repository.UserRepository;
import com.SmartCommerceAI.common.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserResponse getUserProfile(User currentUser) {
        log.info("Fetching profile for user: {}", currentUser.getEmail());
        return UserMapper.toUserResponse(currentUser);
    }

    @Transactional
    public UserResponse updateUserProfile(User currentUser, UserUpdateRequest request) {
        log.info("Updating profile for user: {}", currentUser.getEmail());
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(request.getName());
        User updatedUser = userRepository.save(user);

        log.info("Profile updated successfully for user: {}", currentUser.getEmail());
        return UserMapper.toUserResponse(updatedUser);
    }
}
