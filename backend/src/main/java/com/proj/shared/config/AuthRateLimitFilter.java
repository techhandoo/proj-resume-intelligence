package com.proj.shared.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Simple in-memory fixed-window rate limiter for the unauthenticated auth endpoints
 * (login / register) to slow down credential stuffing and bot registration.
 *
 * Note: the counter lives in the JVM, so limits are per-instance. That is acceptable
 * for the current single-instance Render deployment; a multi-instance setup should
 * move this to Redis or a reverse-proxy WAF.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class AuthRateLimitFilter extends OncePerRequestFilter {

    private static final long WINDOW_MS = 5 * 60 * 1000L; // 5 minutes
    private static final int LOGIN_MAX = 10;              // 10 login attempts / 5 min / IP
    private static final int REGISTER_MAX = 5;            // 5 registrations / 5 min / IP
    private static final int MAX_ENTRIES = 50_000;

    private final ObjectMapper objectMapper;

    // key -> [windowStartEpochMillis, count]
    private final Map<String, long[]> buckets = new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String path = request.getRequestURI();
        if (!request.getMethod().equals("POST")) {
            filterChain.doFilter(request, response);
            return;
        }

        int limit;
        String keyPrefix;
        if (path.endsWith("/api/v1/auth/login")) {
            limit = LOGIN_MAX;
            keyPrefix = "login";
        } else if (path.endsWith("/api/v1/auth/register")) {
            limit = REGISTER_MAX;
            keyPrefix = "register";
        } else {
            filterChain.doFilter(request, response);
            return;
        }

        String clientIp = resolveClientIp(request);
        String key = keyPrefix + ":" + clientIp;

        long now = Instant.now().toEpochMilli();
        long[] bucket = buckets.compute(key, (k, existing) -> {
            if (existing == null || now - existing[0] >= WINDOW_MS) {
                return new long[]{now, 1};
            }
            existing[1] += 1;
            return existing;
        });

        if (bucket[1] > limit) {
            log.warn("Auth rate limit exceeded for {} from {}", keyPrefix, clientIp);
            response.setStatus(429);
            response.setHeader("Retry-After", String.valueOf(WINDOW_MS / 1000));
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(objectMapper.writeValueAsString(
                    Map.of("message", "Too many attempts. Please try again later.")));
            return;
        }

        if (buckets.size() > MAX_ENTRIES) {
            purgeExpired(now);
        }

        filterChain.doFilter(request, response);
    }

    private String resolveClientIp(HttpServletRequest request) {
        // Trust X-Forwarded-For only for the trusted proxy hop; fall back to the socket peer.
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            int comma = forwarded.indexOf(',');
            String first = (comma > 0 ? forwarded.substring(0, comma) : forwarded).trim();
            if (!first.isBlank()) {
                return first;
            }
        }
        return request.getRemoteAddr();
    }

    private void purgeExpired(long now) {
        buckets.entrySet().removeIf(e -> now - e.getValue()[0] >= WINDOW_MS);
    }
}
