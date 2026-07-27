package com.proj.ai.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.web.client.RestClientCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.JdkClientHttpRequestFactory;

import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import java.net.http.HttpClient;
import java.security.SecureRandom;
import java.security.cert.X509Certificate;

import java.util.Objects;

@Configuration
@Slf4j
public class RestClientConfig {

    @Bean
    @SuppressWarnings("null")
    public RestClientCustomizer restClientCustomizer() {
        return restClientBuilder -> {
            try {
                TrustManager[] trustAllCerts = new TrustManager[]{
                    new X509TrustManager() {
                        public X509Certificate[] getAcceptedIssuers() { return new X509Certificate[0]; }
                        public void checkClientTrusted(X509Certificate[] certs, String authType) {}
                        public void checkServerTrusted(X509Certificate[] certs, String authType) {}
                    }
                };

                SSLContext sslContext = SSLContext.getInstance("TLS");
                sslContext.init(null, trustAllCerts, new SecureRandom());

                HttpClient httpClient = HttpClient.newBuilder()
                        .sslContext(sslContext)
                        .build();

                restClientBuilder.requestFactory(new JdkClientHttpRequestFactory(Objects.requireNonNull(httpClient)));

            } catch (Exception e) {
                log.error("Failed to configure custom SSL HttpClient for RestClient", e);
            }
        };
    }
}

