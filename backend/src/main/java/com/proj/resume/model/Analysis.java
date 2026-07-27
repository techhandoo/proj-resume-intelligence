package com.proj.resume.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "analyses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Analysis {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id", nullable = false, unique = true)
    private Resume resume;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(columnDefinition = "TEXT")
    private String skills;

    @Column(name = "experience_years")
    private Integer experienceYears;

    @Column(columnDefinition = "TEXT")
    private String education;

    @Column(columnDefinition = "TEXT")
    private String recommendations;

    @Column(name = "analyzed_at", nullable = false, updatable = false)
    private LocalDateTime analyzedAt;

    @PrePersist
    protected void onCreate() {
        analyzedAt = LocalDateTime.now();
    }
}
