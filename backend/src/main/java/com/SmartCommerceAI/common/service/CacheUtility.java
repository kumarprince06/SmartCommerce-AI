package com.SmartCommerceAI.common.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Slf4j
@Service
@RequiredArgsConstructor
public class CacheUtility {

    private final RedisTemplate<String, Object> redisTemplate;

    public void set(String key, Object value, long timeoutMinutes) {
        try {
            redisTemplate.opsForValue().set(key, value, Duration.ofMinutes(timeoutMinutes));
            log.debug("Manually mapped key {} into Redis boundaries", key);
        } catch (Exception e) {
            log.error("Redis manual injection failed. Ensure Daemon is mapped", e);
        }
    }

    public Object get(String key) {
        try {
            return redisTemplate.opsForValue().get(key);
        } catch (Exception e) {
            log.error("Redis fetch failure. Missing daemon pipeline", e);
            return null;
        }
    }

    public void evict(String key) {
        try {
            redisTemplate.delete(key);
            log.debug("Evicted {}", key);
        } catch (Exception e) {
            log.error("Redis wipe failure", e);
        }
    }
}
