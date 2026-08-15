package com.proj.resume.controller;

import com.proj.ai.service.AIAnalysisService;
import com.proj.auth.model.User;
import com.proj.resume.dto.CoverLetterRequest;
import com.proj.resume.dto.CoverLetterResponse;
import com.proj.resume.model.Resume;
import com.proj.resume.repository.ResumeRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/cover-letter")
@RequiredArgsConstructor
@Slf4j
public class CoverLetterController {

    private final AIAnalysisService aiAnalysisService;
    private final ResumeRepository resumeRepository;

    @PostMapping("/generate")
    public ResponseEntity<?> generateCoverLetter(
            @RequestBody CoverLetterRequest request,
            @AuthenticationPrincipal User user) {
        
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Authentication required"));
        }

        String resumeIdStr = request.getResumeId();
        if (resumeIdStr == null || resumeIdStr.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "resumeId must not be null or empty"));
        }

        UUID resumeUuid;
        try {
            resumeUuid = UUID.fromString(resumeIdStr);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Invalid resumeId format: " + resumeIdStr));
        }

        Resume resume = resumeRepository.findById(resumeUuid).orElse(null);
        if (resume == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Resume not found with id: " + resumeIdStr));
        }

        if (resume.getUser() == null || !resume.getUser().getId().equals(user.getId())) {
            log.warn("IDOR attempt detected: User {} tried to access resume {}", user.getEmail(), resumeIdStr);
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Access denied: You do not have permission to access this resume"));
        }

        String rawText = resume.getRawText();
        if (rawText == null || rawText.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Resume has no extracted text. Please re-upload the resume."));
        }

        try {
            AIAnalysisService.CoverLetterResult result = aiAnalysisService.generateCoverLetter(rawText, request.getJobDescription(), request.getTone());
            return ResponseEntity.ok(new CoverLetterResponse(result.markdown(), result.source()));
        } catch (Exception e) {
            log.error("Cover letter generation failed for resumeId={}: {}", resumeIdStr, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Cover letter generation failed: " + e.getMessage()));
        }
    }
}


