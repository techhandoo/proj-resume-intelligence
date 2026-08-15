package com.proj.resume.repository;

import com.proj.resume.model.AnalysisJob;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AnalysisJobRepository extends JpaRepository<AnalysisJob, UUID> {

    Optional<AnalysisJob> findFirstByStatusOrderByCreatedAtAsc(AnalysisJob.Status status);

    List<AnalysisJob> findByStatusAndStartedAtBefore(AnalysisJob.Status status, LocalDateTime cutoff);

    Optional<AnalysisJob> findByResumeId(UUID resumeId);
}
