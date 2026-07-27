package com.proj.resume.dto;

import com.proj.resume.model.Analysis;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
public class AnalysisResponse {

    private UUID id;
    private UUID resumeId;
    private String summary;
    private List<String> skills;
    private Integer experienceYears;
    private String education;
    private String recommendations;
    private LocalDateTime analyzedAt;

    public static AnalysisResponse from(Analysis analysis) {
        List<String> skillsList = analysis.getSkills() != null
                ? Arrays.asList(analysis.getSkills().split(","))
                : List.of();

        return AnalysisResponse.builder()
                .id(analysis.getId())
                .resumeId(analysis.getResume().getId())
                .summary(analysis.getSummary())
                .skills(skillsList.stream().map(s -> s.trim()).toList())
                .experienceYears(analysis.getExperienceYears())
                .education(analysis.getEducation())
                .recommendations(analysis.getRecommendations())
                .analyzedAt(analysis.getAnalyzedAt())
                .build();
    }
}
