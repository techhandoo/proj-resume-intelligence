package com.proj.resume.controller;

import com.proj.auth.model.User;
import com.proj.resume.dto.AnalysisResponse;
import com.proj.resume.dto.ResumeResponse;
import com.proj.resume.dto.ResumeUploadRequest;
import com.proj.resume.service.ResumeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/resumes")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;

    @PostMapping
    public ResponseEntity<ResumeResponse> uploadResume(
            @Valid @RequestBody ResumeUploadRequest request,
            @AuthenticationPrincipal User user) {
        ResumeResponse response = resumeService.uploadResume(request, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<ResumeResponse>> listResumes(@AuthenticationPrincipal User user) {
        List<ResumeResponse> resumes = resumeService.getUserResumes(user.getId());
        return ResponseEntity.ok(resumes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResumeResponse> getResume(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user) {
        ResumeResponse resume = resumeService.getResume(id, user.getId());
        return ResponseEntity.ok(resume);
    }

    @GetMapping("/{id}/analysis")
    public ResponseEntity<AnalysisResponse> getAnalysis(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user) {
        AnalysisResponse analysis = resumeService.getAnalysis(id, user.getId());
        return ResponseEntity.ok(analysis);
    }
}
