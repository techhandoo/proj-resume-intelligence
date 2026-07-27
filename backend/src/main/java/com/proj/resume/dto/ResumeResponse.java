package com.proj.resume.dto;

import com.proj.resume.model.Resume;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
public class ResumeResponse {

    private UUID id;
    private String fileName;
    private String fileType;
    private Long fileSize;
    private String status;
    private LocalDateTime uploadedAt;
    private boolean hasAnalysis;

    public static ResumeResponse from(Resume resume) {
        return ResumeResponse.builder()
                .id(resume.getId())
                .fileName(resume.getFileName())
                .fileType(resume.getFileType())
                .fileSize(resume.getFileSize())
                .status(resume.getStatus().name())
                .uploadedAt(resume.getUploadedAt())
                .hasAnalysis(resume.getAnalysis() != null)
                .build();
    }
}
