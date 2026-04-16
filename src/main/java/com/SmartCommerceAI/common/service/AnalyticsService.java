package com.SmartCommerceAI.common.service;

import com.SmartCommerceAI.order.entity.Order;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class AnalyticsService {
    
    @Async
    public void logOrderPlacement(Order order) {
        log.info("ASYNC TASK: Analytics metric logged globally for revenue on Order #{}", order.getId());
    }
}
