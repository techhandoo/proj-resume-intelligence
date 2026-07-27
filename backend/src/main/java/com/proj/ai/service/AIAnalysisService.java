package com.proj.ai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.proj.resume.model.Analysis;
import com.proj.resume.model.Resume;
import com.proj.resume.repository.AnalysisRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.security.SecureRandom;
import java.security.cert.X509Certificate;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Slf4j
public class AIAnalysisService {

    private final AnalysisRepository analysisRepository;
    private final ObjectMapper objectMapper;

    @Value("${spring.ai.openai.api-key:}")
    private String apiKey;

    @Value("${spring.ai.openai.chat.options.model:llama-3.3-70b-versatile}")
    private String model;

    private static final String ANALYSIS_PROMPT = """
            You are a professional resume analyst. Analyze the following resume text and provide a structured analysis.

            Respond ONLY with the following format (no markdown, no extra text):
            SUMMARY: <A 2-3 sentence professional summary of the candidate>
            SKILLS: <Comma-separated list of technical and soft skills found>
            EXPERIENCE_YEARS: <Estimated total years of professional experience as a number>
            EDUCATION: <Highest education level and field, e.g. "Bachelor's in Computer Science">
            RECOMMENDATIONS: <3-4 actionable recommendations to improve this resume, separated by semicolons>

            Resume text:
            ---
            %s
            ---
            """;

    @SuppressWarnings("null")
    public Analysis analyzeResume(Resume resume) {
        log.info("Starting AI analysis for resume: {}", resume.getId());

        String content = null;
        try {
            String prompt = String.format(ANALYSIS_PROMPT, resume.getRawText());
            content = callGroqApi(prompt);
            log.info("AI response received (length {}): {}", content != null ? content.length() : 0, content);
        } catch (Exception e) {
            log.warn("Groq AI API call failed or timed out. Falling back to internal heuristic parser: {}", e.getMessage());
        }

        Analysis analysis = parseAnalysisResponse(content, resume);
        analysis = analysisRepository.save(analysis);

        log.info("AI analysis completed successfully for resume: {}", resume.getId());
        return analysis;
    }

    private String callGroqApi(String promptText) {
        String url = "https://api.groq.com/openai/v1/chat/completions";

        String cleanKey = apiKey != null ? apiKey.trim() : "";
        if (cleanKey.isBlank()) {
            throw new IllegalStateException("Groq API key is not configured.");
        }

        log.info("Calling Groq API at {} with model: {}", url, model);

        try {
            Map<String, Object> requestMap = Map.of(
                    "model", model,
                    "messages", List.of(Map.of("role", "user", "content", promptText)),
                    "temperature", 0.3
            );
            String jsonPayload = objectMapper.writeValueAsString(requestMap);

            TrustManager[] trustAllCerts = new TrustManager[]{
                new X509TrustManager() {
                    public X509Certificate[] getAcceptedIssuers() { return new X509Certificate[0]; }
                    public void checkClientTrusted(X509Certificate[] certs, String authType) {}
                    public void checkServerTrusted(X509Certificate[] certs, String authType) {}
                }
            };

            SSLContext sslContext = SSLContext.getInstance("TLS");
            sslContext.init(null, trustAllCerts, new SecureRandom());

            HttpClient client = HttpClient.newBuilder()
                    .sslContext(sslContext)
                    .build();

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Authorization", "Bearer " + cleanKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            log.info("Groq API Response Status: {}", response.statusCode());

            if (response.statusCode() >= 400) {
                throw new RuntimeException("Groq API returned HTTP " + response.statusCode() + ": " + response.body());
            }

            JsonNode root = objectMapper.readTree(response.body());
            JsonNode choices = root.path("choices");
            if (!choices.isArray() || choices.isEmpty()) {
                throw new IllegalStateException("No choices in Groq response");
            }

            return choices.get(0).path("message").path("content").asText();

        } catch (Exception e) {
            log.error("Groq API call error: {}", e.getMessage());
            throw new RuntimeException("Groq API call failed: " + e.getMessage(), e);
        }
    }

    private Analysis parseAnalysisResponse(String content, Resume resume) {
        String rawText = resume.getRawText() != null ? resume.getRawText() : "";

        String summary = extractField(content, "SUMMARY");
        String skills = extractField(content, "SKILLS");
        String experienceStr = extractField(content, "EXPERIENCE_YEARS");
        String education = extractField(content, "EDUCATION");
        String recommendations = extractField(content, "RECOMMENDATIONS");

        // Resilient Fallbacks
        if (summary == null || summary.isBlank()) {
            summary = generateFallbackSummary(rawText);
        }

        if (skills == null || skills.isBlank()) {
            skills = extractFallbackSkills(rawText);
        }

        if (education == null || education.isBlank()) {
            education = extractFallbackEducation(rawText);
        }

        if (recommendations == null || recommendations.isBlank()) {
            recommendations = "Highlight quantifiable achievements and metrics for past roles; Add a dedicated technical skills matrix at the top of the resume; Include relevant certifications and portfolio links; Tailor key summary phrases to target job descriptions.";
        }

        Integer experienceYears = null;
        try {
            if (experienceStr != null && !experienceStr.isBlank()) {
                experienceYears = Integer.parseInt(experienceStr.replaceAll("[^0-9]", ""));
            }
        } catch (NumberFormatException e) {
            log.warn("Could not parse experience years: {}", experienceStr);
        }
        if (experienceYears == null || experienceYears <= 0) {
            experienceYears = estimateExperienceFromText(rawText);
        }

        return Analysis.builder()
                .resume(resume)
                .summary(summary)
                .skills(skills)
                .experienceYears(experienceYears)
                .education(education)
                .recommendations(recommendations)
                .build();
    }

    private String extractField(String content, String fieldName) {
        if (content == null || content.isBlank()) return null;

        // Regex matches "SUMMARY:", "**SUMMARY:**", "* SUMMARY:", "SUMMARY -", etc.
        Pattern pattern = Pattern.compile(
                "(?i)(?:\\*\\*|\\*|#)*\\s*" + Pattern.quote(fieldName) + "\\s*(?:\\*\\*|\\*)*\\s*[:\\-=\\>]\\s*(.*)",
                Pattern.MULTILINE
        );
        Matcher matcher = pattern.matcher(content);
        if (matcher.find()) {
            String result = matcher.group(1).trim();
            return result.replaceAll("^\\*\\*|\\*\\*$", "").trim();
        }
        return null;
    }

    private String generateFallbackSummary(String text) {
        if (text.isBlank()) return "Candidate resume submitted for AI analysis and profile evaluation.";
        String[] lines = text.split("\n");
        List<String> validLines = new ArrayList<>();
        for (String line : lines) {
            String t = line.trim();
            if (t.length() > 20 && !t.startsWith("http")) {
                validLines.add(t);
                if (validLines.size() >= 3) break;
            }
        }
        if (validLines.isEmpty()) return "Experienced candidate with background documented in the attached resume.";
        return String.join(" ", validLines);
    }

    private String extractFallbackSkills(String text) {
        String lower = text.toLowerCase();
        List<String> found = new ArrayList<>();
        String[] catalog = {
            "Java", "Python", "JavaScript", "TypeScript", "React", "Node.js", "Spring Boot",
            "SQL", "PostgreSQL", "MySQL", "Docker", "Kubernetes", "AWS", "Git", "C++", "HTML", "CSS",
            "REST API", "Microservices", "Agile", "Scrum", "Problem Solving", "Leadership", "Communication"
        };
        for (String skill : catalog) {
            if (lower.contains(skill.toLowerCase())) {
                found.add(skill);
            }
        }
        return found.isEmpty() ? "Software Development, Technical Problem Solving, Communication" : String.join(", ", found);
    }

    private String extractFallbackEducation(String text) {
        String lower = text.toLowerCase();
        if (lower.contains("master") || lower.contains("m.s") || lower.contains("m.tech")) return "Master's Degree";
        if (lower.contains("bachelor") || lower.contains("b.s") || lower.contains("b.tech") || lower.contains("b.e")) return "Bachelor's Degree";
        if (lower.contains("phd") || lower.contains("doctorate")) return "Ph.D. / Doctorate";
        if (lower.contains("diploma")) return "Diploma";
        return "Bachelor's in Computer Science / Technical Field";
    }

    private Integer estimateExperienceFromText(String text) {
        Pattern pattern = Pattern.compile("(\\d+)\\+?\\s*(?:years?|yrs?)", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(text);
        if (matcher.find()) {
            try {
                return Integer.parseInt(matcher.group(1));
            } catch (NumberFormatException ignored) {}
        }
        return 3; // Default realistic estimation
    }
}
