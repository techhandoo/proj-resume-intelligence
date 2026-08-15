package com.proj.ai.controller;

import com.proj.ai.service.AIAnalysisService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Public diagnostics for the AI integration.
 *
 * If the Groq console shows 0 tokens used, hit this endpoint first:
 * `configured: false` means AI_API_KEY / GROQ_API_KEY is not set on the backend,
 * and every analysis/cover letter is falling back to the heuristic engine.
 */
@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
public class AIConfigController {

    private final AIAnalysisService aiAnalysisService;

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> status() {
        return ResponseEntity.ok(aiAnalysisService.getConfigStatus());
    }
}
