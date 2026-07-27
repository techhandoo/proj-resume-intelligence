package com.proj.resume.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ResumeUploadRequest {

    @NotBlank(message = "File name is required")
    private String fileName;

    @NotBlank(message = "Resume content is required")
    private String content;
}
