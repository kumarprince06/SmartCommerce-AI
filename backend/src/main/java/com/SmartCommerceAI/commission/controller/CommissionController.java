package com.SmartCommerceAI.commission.controller;

import com.SmartCommerceAI.commission.entity.CommissionRule;
import com.SmartCommerceAI.commission.repository.CommissionRuleRepository;
import com.SmartCommerceAI.common.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/commissions")
@RequiredArgsConstructor
public class CommissionController {

    private final CommissionRuleRepository commissionRuleRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<CommissionRule>>> getAllRules() {
        return ResponseEntity.ok(ApiResponse.success(
                commissionRuleRepository.findAllByOrderByPriorityDesc(),
                "Commission rules retrieved"
        ));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<CommissionRule>> createRule(@Valid @RequestBody CommissionRule rule) {
        CommissionRule saved = commissionRuleRepository.save(rule);
        return ResponseEntity.ok(ApiResponse.success(saved, "Commission rule created"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteRule(@PathVariable Long id) {
        commissionRuleRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Commission rule deleted"));
    }
}
