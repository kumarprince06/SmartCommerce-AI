package com.SmartCommerceAI.commission.service;

import com.SmartCommerceAI.commission.entity.CommissionRule;
import com.SmartCommerceAI.commission.entity.CommissionType;
import com.SmartCommerceAI.commission.entity.CommissionValueType;
import com.SmartCommerceAI.commission.repository.CommissionRuleRepository;
import com.SmartCommerceAI.order.entity.OrderItem;
import com.SmartCommerceAI.product.entity.Product;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class CommissionService {

    private final CommissionRuleRepository commissionRuleRepository;

    public Double calculateCommission(OrderItem orderItem) {
        List<CommissionRule> rules = commissionRuleRepository.findAllByOrderByPriorityDesc();

        Product product = orderItem.getProduct();
        
        for (CommissionRule rule : rules) {
            boolean matches = false;
            if (rule.getType() == CommissionType.GLOBAL) {
                matches = true;
            } else if (rule.getType() == CommissionType.PRODUCT && product.getId().equals(rule.getReferenceId())) {
                matches = true;
            } else if (rule.getType() == CommissionType.CATEGORY && product.getCategory().getId().equals(rule.getReferenceId())) {
                matches = true;
            } else if (rule.getType() == CommissionType.VENDOR && product.getVendor().getId().equals(rule.getReferenceId())) {
                matches = true;
            }

            if (matches) {
                if (rule.getValueType() == CommissionValueType.PERCENTAGE) {
                    return orderItem.getTotalPrice() * (rule.getValue() / 100.0);
                } else {
                    return Math.min(rule.getValue(), orderItem.getTotalPrice()); 
                }
            }
        }
        
        return 0.0;
    }
}
