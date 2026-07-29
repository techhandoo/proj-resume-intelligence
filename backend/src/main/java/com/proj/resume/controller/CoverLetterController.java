package com.proj.resume.controller;

import com.proj.ai.service.AIAnalysisService;
import com.proj.resume.dto.CoverLetterRequest;
import com.proj.resume.dto.CoverLetterResponse;
import com.proj.resume.model.Resume;
import com.proj.resume.repository.ResumeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/cover-letter")
@RequiredArgsConstructor
public class CoverLetterController {

    private final AIAnalysisService aiAnalysisService;
    private final ResumeRepository resumeRepository;

    @PostMapping("/generate")
    public ResponseEntity<CoverLetterResponse> generateCoverLetter(@RequestBody CoverLetterRequest request) {
        Resume resume = resumeRepository.findById(UUID.fromString(request.getResumeId()))
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        String coverLetterMarkdown = aiAnalysisService.generateCoverLetter(resume.getRawText(), request.getJobDescription());
        return ResponseEntity.ok(new CoverLetterResponse(coverLetterMarkdown));
    }
}
