package com.SmartCommerceAI.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

/**
 * Cache configuration using in-memory ConcurrentMapCache.
 *
 * Why not Redis for now?
 * Redis adds operational complexity (requires a running Redis server).
 * For local development and the current monolith phase, ConcurrentMapCache
 * is simpler and requires zero infrastructure. It stores cached values in
 * a ConcurrentHashMap inside the JVM — fast, zero-dependency, works out of the box.
 *
 * When we move to microservices (feature/microservices-kafka branch):
 *   - Swap this for RedisCacheManager
 *   - Add spring.data.redis.host/port to application.properties
 *   - Run Redis via Docker: docker run -d -p 6379:6379 redis:7-alpine
 */
@Slf4j
@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    @Primary
    public CacheManager cacheManager() {
        log.info("Initializing ConcurrentMap in-memory cache (Redis-free local mode)");
        return new ConcurrentMapCacheManager(
                "products_catalog",
                "product_single",
                "categories",
                "vendor_metrics",
                "ai_recommendations"
        );
    }
}
