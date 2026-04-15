package com.SmartCommerceAI.user.controller;

import com.SmartCommerceAI.common.dto.ApiResponse;
import com.SmartCommerceAI.user.dto.UserResponse;
import com.SmartCommerceAI.user.dto.UserUpdateRequest;
import com.SmartCommerceAI.user.entity.User;
import com.SmartCommerceAI.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getMyProfile(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(ApiResponse.success(userService.getUserProfile(currentUser), "Profile retrieved successfully"));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> updateMyProfile(
            @AuthenticationPrincipal User currentUser,
            @Valid @RequestBody UserUpdateRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success(userService.updateUserProfile(currentUser, request), "Profile updated successfully"));
    }
}
