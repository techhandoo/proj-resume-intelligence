package com.proj.resume.dto;

import lombok.Data;

@Data
public class CoverLetterRequest {
    private String resumeId;
    private String jobDescription;
    private String tone; // professional | executive | technical | creative
}
