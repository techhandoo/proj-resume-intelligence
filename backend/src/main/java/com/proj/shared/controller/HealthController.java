package com.proj.shared.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Liveness endpoint for platform health checks (Render, Docker, uptime monitors).
 * Render treats non-2xx as unhealthy, so this must return 200 for unknown paths too.
 */
@RestController
public class HealthController {

    @GetMapping({"/health", "/"})
    public ResponseEntity<Map<String, Object>> health() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "proj-backend"
        ));
    }
}
