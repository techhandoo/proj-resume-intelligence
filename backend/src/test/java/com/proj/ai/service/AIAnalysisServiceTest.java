package com.proj.ai.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.proj.resume.model.Analysis;
import com.proj.resume.model.Resume;
import com.proj.resume.repository.AnalysisRepository;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AIAnalysisServiceTest {

    private final AnalysisRepository analysisRepository = mock(AnalysisRepository.class);
    private final ObjectMapper objectMapper = new ObjectMapper();

    private AIAnalysisService newService() {
        AIAnalysisService service = new AIAnalysisService(analysisRepository, objectMapper);
        ReflectionTestUtils.setField(service, "apiKey", "");
        ReflectionTestUtils.setField(service, "model", "openai/gpt-oss-120b");
        ReflectionTestUtils.setField(service, "baseUrl", "https://api.groq.com/openai");
        return service;
    }

    private Resume sampleResume() {
        return Resume.builder()
                .id(UUID.randomUUID())
                .fileName("John Doe")
                .rawText("John Doe\nSenior Full Stack Engineer\n"
                        + "Email: j.doe@example.com | Phone: +1 555 010 2834\n\n"
                        + "PROFESSIONAL SUMMARY\nResults-driven engineer with 7+ years building microservices "
                        + "with TypeScript, React, Node.js, PostgreSQL, Docker and AWS.\n\n"
                        + "WORK EXPERIENCE\nSenior Developer | TechCorp (2021 - Present)\n"
                        + "- Architected a real-time dashboard serving 250,000+ daily users, reducing query latency by 45%.\n"
                        + "Software Engineer | Apex (2018 - 2021)\n"
                        + "- Built scalable React interfaces, increasing engagement by 28%.\n\n"
                        + "EDUCATION\nBachelor of Science in Computer Science | UC Berkeley (2014 - 2018)")
                .status(Resume.Status.PROCESSING)
                .build();
    }

    @Test
    void analyzeResumeFallsBackToHeuristicWhenGroqUnconfigured() {
        AIAnalysisService service = newService();
        when(analysisRepository.save(any(Analysis.class))).thenAnswer(inv -> inv.getArgument(0));

        Analysis analysis = service.analyzeResume(sampleResume());

        assertEquals(AIAnalysisService.SOURCE_HEURISTIC, analysis.getSource(),
                "Without a configured key the analysis must be flagged as heuristic, not LLM output");
        assertNotNull(analysis.getSummary());
        assertTrue(analysis.getSummary().toLowerCase().contains("john doe"),
                "Fallback summary should be derived from THIS resume's text");
        assertTrue(analysis.getSummary().toLowerCase().contains("engineer"));
        assertNotNull(analysis.getSkills());
        assertTrue(analysis.getSkills().contains("React"));
        assertNotNull(analysis.getAtsScore());
        assertTrue(analysis.getAtsScore() >= 0 && analysis.getAtsScore() <= 100);
        assertEquals(7, analysis.getExperienceYears(), "Explicit '7+ years' should be honored");
        assertEquals("Bachelor's Degree", analysis.getEducation());
        assertFalse(analysis.getInsights().isEmpty());
        assertFalse(analysis.getImprovements().isEmpty());
        assertNotNull(analysis.getRecommendations());

        verify(analysisRepository, times(1)).save(any(Analysis.class));
    }

    @Test
    void coverLetterUsesHeuristicFallbackWhenGroqUnconfigured() {
        AIAnalysisService service = newService();

        AIAnalysisService.CoverLetterResult result = service.generateCoverLetter(
                sampleResume().getRawText(),
                "Senior Full Stack Engineer at Acme Corp. Responsibilities: React frontends, Node.js APIs, AWS.",
                "professional");

        assertEquals(AIAnalysisService.SOURCE_HEURISTIC, result.source());
        assertNotNull(result.markdown());
        assertTrue(result.markdown().contains("Dear Hiring Manager"));
        assertTrue(result.markdown().contains("Sincerely"));
        // The fallback should match resume skills against the job description.
        assertTrue(result.markdown().toLowerCase().contains("react"));
    }
}
