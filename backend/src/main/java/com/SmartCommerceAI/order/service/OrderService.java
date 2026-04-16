package com.SmartCommerceAI.order.service;

import com.SmartCommerceAI.commission.service.CommissionService;
import com.SmartCommerceAI.common.dto.PaginatedResponse;
import com.SmartCommerceAI.common.service.AnalyticsService;
import com.SmartCommerceAI.common.service.NotificationService;
import com.SmartCommerceAI.order.dto.*;
import com.SmartCommerceAI.order.entity.*;
import com.SmartCommerceAI.order.repository.OrderItemRepository;
import com.SmartCommerceAI.order.repository.OrderRepository;
import com.SmartCommerceAI.order.repository.OrderStatusHistoryRepository;
import com.SmartCommerceAI.pricing.service.PricingService;
import com.SmartCommerceAI.product.dto.InventoryUpdateRequest;
import com.SmartCommerceAI.product.entity.InventoryChangeType;
import com.SmartCommerceAI.product.entity.ProductVariant;
import com.SmartCommerceAI.product.repository.ProductVariantRepository;
import com.SmartCommerceAI.product.service.InventoryService;
import com.SmartCommerceAI.user.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final OrderStatusHistoryRepository historyRepository;
    
    private final ProductVariantRepository variantRepository;
    private final InventoryService inventoryService;
    private final PricingService pricingService;
    private final CommissionService commissionService;

    // Async Modules
    private final NotificationService notificationService;
    private final AnalyticsService analyticsService;

    @Transactional
    public OrderResponse createOrder(User currentUser, CreateOrderRequest request) {
        log.info("Processing Order request for User ID {}", currentUser.getId());

        Order order = Order.builder()
                .user(currentUser)
                .status(OrderStatus.PENDING)
                .paymentStatus(PaymentStatus.PENDING)
                .totalAmount(0.0) // Aggregated explicitly below
                .build();
        
        // Temporarily explicitly persist referencing relationships
        order = orderRepository.save(order);

        double totalAmount = 0.0;
        List<OrderItem> items = new ArrayList<>();

        for (OrderItemRequest itemReq : request.getItems()) {
            ProductVariant variant = variantRepository.findById(itemReq.getVariantId())
                    .orElseThrow(() -> new RuntimeException("Variant ID " + itemReq.getVariantId() + " not found!"));

            // Synchronous Validation & Mutation preventing race conditions natively
            InventoryUpdateRequest invReq = new InventoryUpdateRequest();
            invReq.setChangeType(InventoryChangeType.OUT);
            invReq.setQuantity(itemReq.getQuantity());
            invReq.setReferenceType("ORDER");
            invReq.setReferenceId(order.getId());
            inventoryService.updateInventory(variant.getId(), invReq);

            // Fetch pricing constraints
            Double rawItemPrice = pricingService.calculateBasePrice(variant, 1);
            Double lineTotal = pricingService.calculateBasePrice(variant, itemReq.getQuantity());

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(variant.getProduct())
                    .variant(variant)
                    .vendor(variant.getProduct().getVendor())
                    .quantity(itemReq.getQuantity())
                    .price(rawItemPrice)
                    .totalPrice(lineTotal)
                    // Defaults initially to zero
                    .commissionAmount(0.0) 
                    .build();

            // Intercept logic: Assign Commission mapping natively against rulesets!
            Double calculatedCommission = commissionService.calculateCommission(orderItem);
            orderItem.setCommissionAmount(calculatedCommission);

            totalAmount += lineTotal;
            items.add(orderItem);
        }

        order.setItems(items);
        order.setTotalAmount(totalAmount);
        order = orderRepository.save(order);

        // Record History
        OrderStatusHistory historyEntry = OrderStatusHistory.builder()
                .order(order)
                .status(OrderStatus.PENDING)
                .note("Order Placed Successfully")
                .build();
        historyRepository.save(historyEntry);

        // TRIGGER ASYNC NON-BLOCKING OPERATIONS
        notificationService.sendOrderConfirmation(order);
        analyticsService.logOrderPlacement(order);

        return mapToResponse(order);
    }

    public OrderResponse updateOrderStatus(Long orderId, OrderStatusUpdateRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(request.getStatus());
        order = orderRepository.save(order);

        OrderStatusHistory historyEntry = OrderStatusHistory.builder()
                .order(order)
                .status(request.getStatus())
                .note(request.getNote() != null ? request.getNote() : "Status updated by internal operator")
                .build();
        historyRepository.save(historyEntry);

        return mapToResponse(order);
    }

    public PaginatedResponse<OrderResponse> getUserOrders(User currentUser, Pageable pageable) {
        Page<Order> orderPage = orderRepository.findByUserId(currentUser.getId(), pageable);
        return PaginatedResponse.of(orderPage.map(this::mapToResponse));
    }

    public OrderResponse getOrderById(Long id, User currentUser) {
        Order order = orderRepository.findByIdAndUserId(id, currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Unauthorized or Missing Order constraint"));
        return mapToResponse(order);
    }

    private OrderResponse mapToResponse(Order order) {
        List<OrderItemResponse> mappedItems = null;

        if (order.getItems() != null) {
            mappedItems = order.getItems().stream().map(i -> OrderItemResponse.builder()
                    .id(i.getId())
                    .productName(i.getProduct().getName())
                    .variantSku(i.getVariant().getSku())
                    .quantity(i.getQuantity())
                    .price(i.getPrice())
                    .totalPrice(i.getTotalPrice())
                    .commissionAmount(i.getCommissionAmount())
                    .build()).collect(Collectors.toList());
        }

        return OrderResponse.builder()
                .id(order.getId())
                .userId(order.getUser().getId())
                .status(order.getStatus())
                .paymentStatus(order.getPaymentStatus())
                .totalAmount(order.getTotalAmount())
                .items(mappedItems)
                .createdAt(order.getCreatedAt())
                .build();
    }
}
