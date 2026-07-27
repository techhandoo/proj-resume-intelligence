package com.proj.resume.model;

import com.proj.auth.model.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "resumes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Resume {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "file_name", nullable = false)
    private String fileName;

    @Column(name = "file_type")
    private String fileType;

    @Column(name = "file_size")
    private Long fileSize;

    @Column(name = "raw_text", columnDefinition = "TEXT")
    private String rawText;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Status status;

    @Column(name = "uploaded_at", nullable = false, updatable = false)
    private LocalDateTime uploadedAt;

    @OneToOne(mappedBy = "resume", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Analysis analysis;

    @PrePersist
    protected void onCreate() {
        uploadedAt = LocalDateTime.now();
        if (status == null) {
            status = Status.UPLOADED;
        }
    }

    public enum Status {
        UPLOADED, PROCESSING, ANALYZED, FAILED
    }
}
