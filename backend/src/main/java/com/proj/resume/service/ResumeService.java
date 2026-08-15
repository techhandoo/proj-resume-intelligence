package com.proj.resume.service;

import com.proj.auth.model.User;
import com.proj.resume.dto.AnalysisResponse;
import com.proj.resume.dto.ResumeResponse;
import com.proj.resume.dto.ResumeUploadRequest;
import com.proj.resume.model.Analysis;
import com.proj.resume.model.AnalysisJob;
import com.proj.resume.model.Resume;
import com.proj.resume.repository.AnalysisJobRepository;
import com.proj.resume.repository.AnalysisRepository;
import com.proj.resume.repository.ResumeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final AnalysisRepository analysisRepository;
    private final AnalysisJobRepository analysisJobRepository;

    /**
     * Persists the resume and enqueues a background analysis job. Returns
     * immediately with the resume in PROCESSING state — the Groq call happens
     * off the HTTP thread in {@link AnalysisWorker}, and the frontend polls
     * until the status becomes ANALYZED or FAILED.
     */
    @SuppressWarnings("null")
    @Transactional
    public ResumeResponse uploadResume(ResumeUploadRequest request, User user) {
        Resume resume = Resume.builder()
                .user(user)
                .fileName(request.getFileName())
                .fileType("text/plain")
                .fileSize((long) request.getContent().length())
                .rawText(request.getContent())
                .status(Resume.Status.PROCESSING)
                .build();

        resume = resumeRepository.save(resume);
        log.info("Resume uploaded: {} by user: {} — analysis job enqueued", resume.getId(), user.getEmail());

        analysisJobRepository.save(AnalysisJob.builder()
                .resumeId(resume.getId())
                .status(AnalysisJob.Status.PENDING)
                .build());

        return ResumeResponse.from(resume);
    }

    @SuppressWarnings("null")
    @Transactional(readOnly = true)
    public List<ResumeResponse> getUserResumes(UUID userId) {
        return resumeRepository.findByUserIdOrderByUploadedAtDesc(userId)
                .stream()
                .map(ResumeResponse::from)
                .toList();
    }

    @SuppressWarnings("null")
    @Transactional(readOnly = true)
    public ResumeResponse getResume(UUID resumeId, UUID userId) {
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new IllegalArgumentException("Resume not found"));

        if (!resume.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Access denied");
        }

        return ResumeResponse.from(resume);
    }

    @SuppressWarnings("null")
    @Transactional(readOnly = true)
    public AnalysisResponse getAnalysis(UUID resumeId, UUID userId) {
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new IllegalArgumentException("Resume not found"));

        if (!resume.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Access denied");
        }

        Analysis analysis = analysisRepository.findByResumeId(resumeId)
                .orElseThrow(() -> new IllegalArgumentException("Analysis not found"));

        return AnalysisResponse.from(analysis);
    }
}
