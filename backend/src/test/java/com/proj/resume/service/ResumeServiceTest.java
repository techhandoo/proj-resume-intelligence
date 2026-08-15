package com.proj.resume.service;

import com.proj.auth.model.User;
import com.proj.resume.dto.ResumeResponse;
import com.proj.resume.dto.ResumeUploadRequest;
import com.proj.resume.model.AnalysisJob;
import com.proj.resume.model.Resume;
import com.proj.resume.repository.AnalysisJobRepository;
import com.proj.resume.repository.AnalysisRepository;
import com.proj.resume.repository.ResumeRepository;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.*;

class ResumeServiceTest {

    @Test
    void uploadEnqueuesPendingJobAndReturnsProcessingImmediately() {
        ResumeRepository resumeRepository = mock(ResumeRepository.class);
        AnalysisRepository analysisRepository = mock(AnalysisRepository.class);
        AnalysisJobRepository jobRepository = mock(AnalysisJobRepository.class);
        ResumeService service = new ResumeService(resumeRepository, analysisRepository, jobRepository);

        User user = User.builder().id(UUID.randomUUID()).email("a@b.co").build();
        UUID resumeId = UUID.randomUUID();

        when(resumeRepository.save(any(Resume.class))).thenAnswer(inv -> {
            Resume r = inv.getArgument(0);
            r.setId(resumeId);
            return r;
        });
        when(jobRepository.save(any(AnalysisJob.class))).thenAnswer(inv -> inv.getArgument(0));

        ResumeUploadRequest request = new ResumeUploadRequest();
        request.setFileName("Candidate A");
        request.setContent("Candidate A\nSoftware Engineer\n...");

        ResumeResponse response = service.uploadResume(request, user);

        assertEquals(resumeId, response.getId());
        assertEquals("PROCESSING", response.getStatus(),
                "Upload must return immediately with PROCESSING — analysis happens in the background");
        assertFalse(response.isHasAnalysis());

        // A PENDING job must be enqueued for the background worker.
        verify(jobRepository).save(argThat(job ->
                job.getResumeId().equals(resumeId) && job.getStatus() == AnalysisJob.Status.PENDING));
        // The old blocking behavior (calling analyzeResume synchronously) must be gone.
        verifyNoInteractions(analysisRepository);
    }
}
