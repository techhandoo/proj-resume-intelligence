package com.proj.resume.service;

import com.proj.ai.service.AIAnalysisService;
import com.proj.resume.model.AnalysisJob;
import com.proj.resume.model.Resume;
import com.proj.resume.repository.AnalysisJobRepository;
import com.proj.resume.repository.ResumeRepository;
import org.junit.jupiter.api.Test;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AnalysisWorkerTest {

    private Resume newResume() {
        return Resume.builder()
                .id(UUID.randomUUID())
                .fileName("Candidate")
                .rawText("Candidate\nEngineer\n")
                .status(Resume.Status.PROCESSING)
                .build();
    }

    private AnalysisJob newJob(UUID resumeId, int attempts) {
        return AnalysisJob.builder()
                .id(UUID.randomUUID())
                .resumeId(resumeId)
                .status(AnalysisJob.Status.PENDING)
                .attempts(attempts)
                .build();
    }

    @Test
    void processesPendingJobToCompletion() {
        Resume resume = newResume();
        AnalysisJob job = newJob(resume.getId(), 0);

        ResumeRepository resumeRepository = mock(ResumeRepository.class);
        AnalysisJobRepository jobRepository = mock(AnalysisJobRepository.class);
        AIAnalysisService aiAnalysisService = mock(AIAnalysisService.class);

        when(jobRepository.findFirstByStatusOrderByCreatedAtAsc(AnalysisJob.Status.PENDING))
                .thenReturn(Optional.of(job));
        when(resumeRepository.findById(resume.getId())).thenReturn(Optional.of(resume));
        when(jobRepository.save(any(AnalysisJob.class))).thenAnswer(inv -> inv.getArgument(0));
        when(resumeRepository.save(any(Resume.class))).thenAnswer(inv -> inv.getArgument(0));

        AnalysisWorker worker = new AnalysisWorker(jobRepository, resumeRepository, aiAnalysisService);
        worker.processNextJob();

        verify(aiAnalysisService).analyzeResume(resume);
        assertEquals(AnalysisJob.Status.COMPLETED, job.getStatus());
        assertEquals(1, job.getAttempts());
        assertEquals(Resume.Status.ANALYZED, resume.getStatus());
    }

    @Test
    void retriesOnTransientFailureUntilMaxAttempts() {
        Resume resume = newResume();
        AnalysisJob job = newJob(resume.getId(), 1); // one prior attempt

        ResumeRepository resumeRepository = mock(ResumeRepository.class);
        AnalysisJobRepository jobRepository = mock(AnalysisJobRepository.class);
        AIAnalysisService aiAnalysisService = mock(AIAnalysisService.class);
        when(aiAnalysisService.analyzeResume(any())).thenThrow(new RuntimeException("Groq down"));

        when(jobRepository.findFirstByStatusOrderByCreatedAtAsc(AnalysisJob.Status.PENDING))
                .thenReturn(Optional.of(job));
        when(resumeRepository.findById(resume.getId())).thenReturn(Optional.of(resume));
        when(jobRepository.save(any(AnalysisJob.class))).thenAnswer(inv -> inv.getArgument(0));
        when(resumeRepository.save(any(Resume.class))).thenAnswer(inv -> inv.getArgument(0));

        AnalysisWorker worker = new AnalysisWorker(jobRepository, resumeRepository, aiAnalysisService);

        // Attempt 2 of 3 fails → requeued as PENDING for the next tick.
        worker.processNextJob();
        assertEquals(AnalysisJob.Status.PENDING, job.getStatus(), "Attempt < max should requeue");
        assertEquals(2, job.getAttempts());
        assertEquals(Resume.Status.PROCESSING, resume.getStatus());

        // Attempt 3 of 3 fails → permanent failure + resume marked FAILED.
        worker.processNextJob();
        assertEquals(AnalysisJob.Status.FAILED, job.getStatus(), "Max attempts reached should fail the job");
        assertEquals(3, job.getAttempts());
        assertEquals(Resume.Status.FAILED, resume.getStatus());
    }

    @Test
    void doesNothingWhenQueueIsEmpty() {
        ResumeRepository resumeRepository = mock(ResumeRepository.class);
        AnalysisJobRepository jobRepository = mock(AnalysisJobRepository.class);
        AIAnalysisService aiAnalysisService = mock(AIAnalysisService.class);

        when(jobRepository.findFirstByStatusOrderByCreatedAtAsc(AnalysisJob.Status.PENDING))
                .thenReturn(Optional.empty());

        AnalysisWorker worker = new AnalysisWorker(jobRepository, resumeRepository, aiAnalysisService);
        worker.processNextJob();

        verifyNoInteractions(aiAnalysisService);
        verifyNoInteractions(resumeRepository);
    }
}
