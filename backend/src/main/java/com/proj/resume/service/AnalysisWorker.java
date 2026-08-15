package com.proj.resume.service;

import com.proj.ai.service.AIAnalysisService;
import com.proj.resume.model.AnalysisJob;
import com.proj.resume.model.Resume;
import com.proj.resume.repository.AnalysisJobRepository;
import com.proj.resume.repository.ResumeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Drains the {@code analysis_jobs} queue in the background so uploads return
 * immediately instead of blocking the HTTP request on the (slow, external) Groq
 * call. Jobs are retried up to {@value #MAX_ATTEMPTS} times, and the reaper
 * recovers jobs left in PROCESSING after a crash or redeploy.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class AnalysisWorker {

    static final int MAX_ATTEMPTS = 3;
    private static final Duration STALE_JOB_TIMEOUT = Duration.ofMinutes(10);

    private final AnalysisJobRepository jobRepository;
    private final ResumeRepository resumeRepository;
    private final AIAnalysisService aiAnalysisService;

    @Scheduled(fixedDelayString = "${app.analysis.poll-interval-ms:3000}")
    @Transactional
    public void processNextJob() {
        AnalysisJob job = jobRepository.findFirstByStatusOrderByCreatedAtAsc(AnalysisJob.Status.PENDING)
                .orElse(null);
        if (job == null) {
            return;
        }

        job.setStatus(AnalysisJob.Status.PROCESSING);
        job.setStartedAt(LocalDateTime.now());
        job.setAttempts(job.getAttempts() == null ? 1 : job.getAttempts() + 1);
        jobRepository.save(job);

        try {
            Resume resume = resumeRepository.findById(job.getResumeId())
                    .orElseThrow(() -> new IllegalStateException("Resume not found for job " + job.getId()));

            // Persists the Analysis and never throws (it falls back to the
            // deterministic engine if Groq is unavailable), so this only fails
            // on genuine infrastructure errors.
            aiAnalysisService.analyzeResume(resume);

            resume.setStatus(Resume.Status.ANALYZED);
            resumeRepository.save(resume);

            job.setStatus(AnalysisJob.Status.COMPLETED);
            job.setFinishedAt(LocalDateTime.now());
            jobRepository.save(job);
            log.info("Analysis completed for resume {} (job {})", job.getResumeId(), job.getId());
        } catch (Exception e) {
            job.setLastError(e.getMessage() == null ? e.getClass().getSimpleName() : e.getMessage());
            if (job.getAttempts() >= MAX_ATTEMPTS) {
                job.setStatus(AnalysisJob.Status.FAILED);
                job.setFinishedAt(LocalDateTime.now());
                resumeRepository.findById(job.getResumeId()).ifPresent(r -> {
                    r.setStatus(Resume.Status.FAILED);
                    resumeRepository.save(r);
                });
                log.error("Analysis job {} permanently failed after {} attempts: {}",
                        job.getId(), job.getAttempts(), job.getLastError(), e);
            } else {
                job.setStatus(AnalysisJob.Status.PENDING); // retry next tick
                job.setStartedAt(null);
                log.warn("Analysis job {} failed (attempt {}), will retry: {}",
                        job.getId(), job.getAttempts(), job.getLastError());
            }
            jobRepository.save(job);
        }
    }

    @Scheduled(fixedDelayString = "${app.analysis.reaper-interval-ms:60000}")
    @Transactional
    public void reapStaleWork() {
        LocalDateTime cutoff = LocalDateTime.now().minus(STALE_JOB_TIMEOUT);

        List<AnalysisJob> stuckJobs = jobRepository.findByStatusAndStartedAtBefore(AnalysisJob.Status.PROCESSING, cutoff);
        for (AnalysisJob job : stuckJobs) {
            if (job.getAttempts() >= MAX_ATTEMPTS) {
                job.setStatus(AnalysisJob.Status.FAILED);
                job.setFinishedAt(LocalDateTime.now());
                log.error("Reaper: job {} stuck in PROCESSING past max attempts; marking FAILED", job.getId());
            } else {
                job.setStatus(AnalysisJob.Status.PENDING);
                job.setStartedAt(null);
                log.warn("Reaper: job {} stuck in PROCESSING; requeued (attempt {})", job.getId(), job.getAttempts());
            }
            jobRepository.save(job);
        }

        // Legacy resumes stuck in PROCESSING with no job and no analysis (pre-async uploads).
        List<Resume> orphaned = resumeRepository.findByStatus(Resume.Status.PROCESSING);
        for (Resume resume : orphaned) {
            if (resume.getUploadedAt().isBefore(cutoff) && resume.getAnalysis() == null) {
                resume.setStatus(Resume.Status.FAILED);
                resumeRepository.save(resume);
                log.warn("Reaper: resume {} stuck in PROCESSING without a job; marked FAILED", resume.getId());
            }
        }
    }
}
