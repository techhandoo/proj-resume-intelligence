package com.proj.resume.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CoverLetterResponse {
    private String coverLetterMarkdown;
    private String source; // "groq" | "heuristic"
}
