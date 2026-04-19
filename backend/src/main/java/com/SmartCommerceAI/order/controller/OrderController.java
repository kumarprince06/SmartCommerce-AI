package com.SmartCommerceAI.order.controller;

import com.SmartCommerceAI.common.dto.ApiResponse;
import com.SmartCommerceAI.common.dto.PaginatedResponse;
import com.SmartCommerceAI.order.dto.CreateOrderRequest;
import com.SmartCommerceAI.order.dto.OrderResponse;
import com.SmartCommerceAI.order.dto.OrderStatusUpdateRequest;
import com.SmartCommerceAI.order.service.OrderService;
import com.SmartCommerceAI.user.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(
            @AuthenticationPrincipal User currentUser,
            @Valid @RequestBody CreateOrderRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                orderService.createOrder(currentUser, request),
                "Order created successfully"
        ));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PaginatedResponse<OrderResponse>>> getUserOrders(
            @AuthenticationPrincipal User currentUser,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(ApiResponse.success(
                orderService.getUserOrders(currentUser, pageable),
                "Orders retrieved successfully"
        ));
    }

    @GetMapping("/vendor")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<ApiResponse<PaginatedResponse<OrderResponse>>> getVendorOrders(
            @AuthenticationPrincipal User currentUser,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(ApiResponse.success(
                orderService.getVendorOrders(currentUser, pageable),
                "Vendor orders retrieved successfully"
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                orderService.getOrderById(id, currentUser),
                "Order retrieved successfully"
        ));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('VENDOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody OrderStatusUpdateRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                orderService.updateOrderStatus(id, request),
                "Order status updated successfully"
        ));
    }
}
