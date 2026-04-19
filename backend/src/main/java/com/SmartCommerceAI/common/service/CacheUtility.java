package com.SmartCommerceAI.common.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;

/**
 * CacheUtility — wraps Spring's CacheManager for programmatic cache operations.
 *
 * Previously used RedisTemplate directly. Now uses Spring's CacheManager abstraction,
 * so it works with ANY cache backend:
 *   - ConcurrentMapCacheManager (current — local dev, no Redis needed)
 *   - RedisCacheManager (future — microservices branch)
 *
 * No code changes needed when switching backends — just swap the CacheManager bean.
 */
@Slf4j
@Service
public class CacheUtility {

    private final CacheManager cacheManager;

    // Fallback in-memory store for keys that don't belong to a named cache
    private final ConcurrentHashMap<String, Object> localStore = new ConcurrentHashMap<>();

    public CacheUtility(CacheManager cacheManager) {
        this.cacheManager = cacheManager;
    }

    public void set(String cacheName, String key, Object value) {
        try {
            Cache cache = cacheManager.getCache(cacheName);
            if (cache != null) {
                cache.put(key, value);
                log.debug("Cached [{}::{}]", cacheName, key);
            } else {
                localStore.put(cacheName + "::" + key, value);
            }
        } catch (Exception e) {
            log.warn("Cache set failed for [{}::{}]: {}", cacheName, key, e.getMessage());
        }
    }

    public Object get(String cacheName, String key) {
        try {
            Cache cache = cacheManager.getCache(cacheName);
            if (cache != null) {
                Cache.ValueWrapper wrapper = cache.get(key);
                return wrapper != null ? wrapper.get() : null;
            }
            return localStore.get(cacheName + "::" + key);
        } catch (Exception e) {
            log.warn("Cache get failed for [{}::{}]: {}", cacheName, key, e.getMessage());
            return null;
        }
    }

    public void evict(String cacheName, String key) {
        try {
            Cache cache = cacheManager.getCache(cacheName);
            if (cache != null) {
                cache.evict(key);
                log.debug("Evicted [{}::{}]", cacheName, key);
            } else {
                localStore.remove(cacheName + "::" + key);
            }
        } catch (Exception e) {
            log.warn("Cache evict failed for [{}::{}]: {}", cacheName, key, e.getMessage());
        }
    }

    public void evictAll(String cacheName) {
        try {
            Cache cache = cacheManager.getCache(cacheName);
            if (cache != null) cache.clear();
        } catch (Exception e) {
            log.warn("Cache clear failed for [{}]: {}", cacheName, e.getMessage());
        }
    }
}
