package com.proj.shared.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Arrays;
import java.util.List;

/**
 * Keep-alive pinger.
 *
 * Free-tier hosts (Render free, some PaaS/container hosts) spin down idle instances
 * after ~15 minutes. The first request then triggers a slow cold start that exceeds
 * the frontend's HTTP timeout, which is why uploads/cover letters "just fail".
 *
 * This scheduler periodically pings every URL in {@code app.keepalive.urls} so the
 * instance and its dependencies stay warm. It runs while the JVM is alive, so it is
 * the right tool for always-on hosts; on fully-suspended hosts (Render free) the
 * authoritative fix is an external monitor such as UptimeRobot pointed at the
 * backend's PUBLIC /health URL at a <=5 minute interval (see README).
 */
@Component
@Slf4j
public class KeepAliveService {

    private static final String DEFAULT_URLS =
            "https://proj-resume-intelligence.vercel.app,"
            + "https://proj-resume-intelligence.onrender.com/health";

    @Value("${app.keepalive.enabled:true}")
    private boolean enabled;

    @Value("${app.keepalive.urls:" + DEFAULT_URLS + "}")
    private String urlsConfig;

    @Value("${app.keepalive.timeout-ms:10000}")
    private long timeoutMs;

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    @Scheduled(
            fixedDelayString = "${app.keepalive.interval-ms:240000}",
            initialDelayString = "${app.keepalive.initial-delay-ms:60000}"
    )
    public void pingAll() {
        if (!enabled) {
            return;
        }
        List<String> urls = Arrays.stream(urlsConfig.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();
        if (urls.isEmpty()) {
            return;
        }
        for (String url : urls) {
            ping(url);
        }
    }

    private void ping(String url) {
        try {
            HttpRequest request = HttpRequest.newBuilder(URI.create(url))
                    .timeout(Duration.ofMillis(timeoutMs))
                    .GET()
                    .build();
            HttpResponse<Void> response = httpClient.send(request, HttpResponse.BodyHandlers.discarding());
            log.info("Keep-alive ping {} -> HTTP {}", url, response.statusCode());
        } catch (Exception e) {
            log.warn("Keep-alive ping failed for {}: {}", url, e.getMessage());
        }
    }
}
