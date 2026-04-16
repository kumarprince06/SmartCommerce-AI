package com.SmartCommerceAI.common.service;

import com.SmartCommerceAI.order.entity.Order;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class NotificationService {

    @Async
    public void sendOrderConfirmation(Order order) {
        log.info("START ASYNC TASK: Processing notification for Order #{}", order.getId());
        try {
            Thread.sleep(2000); // Simulate intensive network/email lag securely without blocking REST mapping
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        log.info("ASYNC TASK COMPLETE: Order confirmation Sent to user {}", order.getUser().getEmail());
    }
}
