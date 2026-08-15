package com.proj.resume.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Backing store for the async resume-analysis queue. Uploads create a PENDING job
 * immediately; the background {@code AnalysisWorker} claims it, runs the Groq
 * analysis off the HTTP request thread, retries on failure, and a reaper recovers
 * jobs stuck after a crash.
 */
@Entity
@Table(name = "analysis_jobs", indexes = {
        @Index(name = "idx_analysis_jobs_status_created", columnList = "status, created_at"),
        @Index(name = "idx_analysis_jobs_resume_id", columnList = "resume_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalysisJob {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "resume_id", nullable = false)
    private UUID resumeId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    @Column(nullable = false)
    private Integer attempts;

    @Column(name = "last_error", columnDefinition = "TEXT")
    private String lastError;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "finished_at")
    private LocalDateTime finishedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) {
            status = Status.PENDING;
        }
        if (attempts == null) {
            attempts = 0;
        }
    }

    public enum Status {
        PENDING, PROCESSING, COMPLETED, FAILED
    }
}
