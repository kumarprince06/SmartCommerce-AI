package com.SmartCommerceAI.commission.repository;

import com.SmartCommerceAI.commission.entity.CommissionRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommissionRuleRepository extends JpaRepository<CommissionRule, Long> {
    List<CommissionRule> findAllByOrderByPriorityDesc();
}
