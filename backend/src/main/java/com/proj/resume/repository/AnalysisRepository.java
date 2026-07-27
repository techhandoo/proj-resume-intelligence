package com.proj.resume.repository;

import com.proj.resume.model.Analysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AnalysisRepository extends JpaRepository<Analysis, UUID> {

    Optional<Analysis> findByResumeId(UUID resumeId);
}
