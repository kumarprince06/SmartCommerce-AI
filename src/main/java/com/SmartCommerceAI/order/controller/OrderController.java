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
                "Order created accurately generating synchronous constraints and async backgrounds"
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
                "Orders retrieved securely against User mapping"
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                orderService.getOrderById(id, currentUser),
                "Order Profile found securely"
        ));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody OrderStatusUpdateRequest request
    ) {
        // Technically an internal admin/vendor operation mapped natively via gateway checking roles ordinarily.
        return ResponseEntity.ok(ApiResponse.success(
                orderService.updateOrderStatus(id, request),
                "Lifecycle advanced accurately mapping History traits"
        ));
    }
}
