package com.SmartCommerceAI.user.repository;

import com.SmartCommerceAI.user.entity.Role;
import com.SmartCommerceAI.user.entity.RoleType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(RoleType name);
}
