package com.proj.shared.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class AuthRateLimitFilterTest {

    private static final int LOGIN_MAX = 10;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final FilterChain chain = mock(FilterChain.class);

    @Test
    void allowsRequestsUpToTheLimit() throws Exception {
        AuthRateLimitFilter filter = new AuthRateLimitFilter(objectMapper);
        MockHttpServletRequest request = loginRequest("203.0.113.7");

        for (int i = 0; i < LOGIN_MAX; i++) {
            MockHttpServletResponse response = new MockHttpServletResponse();
            filter.doFilter(request, response, chain);
            assertEquals(200, response.getStatus(), "Request " + (i + 1) + " should pass");
        }
        verify(chain, times(LOGIN_MAX)).doFilter(any(), any());
    }

    @Test
    void blocksRequestsPastTheLimitWith429() throws Exception {
        AuthRateLimitFilter filter = new AuthRateLimitFilter(objectMapper);
        MockHttpServletRequest request = loginRequest("203.0.113.99");

        for (int i = 0; i < LOGIN_MAX; i++) {
            filter.doFilter(request, new MockHttpServletResponse(), chain);
        }

        MockHttpServletResponse blocked = new MockHttpServletResponse();
        filter.doFilter(request, blocked, chain);

        assertEquals(429, blocked.getStatus());
        assertEquals("300", blocked.getHeader("Retry-After"));
        verify(chain, times(LOGIN_MAX)).doFilter(any(), any());
    }

    @Test
    void differentIpsAreTrackedIndependently() throws Exception {
        AuthRateLimitFilter filter = new AuthRateLimitFilter(objectMapper);

        for (int i = 0; i < LOGIN_MAX; i++) {
            filter.doFilter(loginRequest("198.51.100.1"), new MockHttpServletResponse(), chain);
        }
        // A different IP is not affected.
        MockHttpServletResponse other = new MockHttpServletResponse();
        filter.doFilter(loginRequest("198.51.100.2"), other, chain);

        assertEquals(200, other.getStatus());
        verify(chain, times(LOGIN_MAX + 1)).doFilter(any(), any());
    }

    @Test
    void ignoresNonAuthEndpoints() throws Exception {
        AuthRateLimitFilter filter = new AuthRateLimitFilter(objectMapper);
        MockHttpServletRequest request = new MockHttpServletRequest("POST", "/api/v1/resumes");
        request.setRemoteAddr("203.0.113.7");

        for (int i = 0; i < 100; i++) {
            filter.doFilter(request, new MockHttpServletResponse(), chain);
        }

        verify(chain, times(100)).doFilter(any(), any());
    }

    private MockHttpServletRequest loginRequest(String ip) {
        MockHttpServletRequest request = new MockHttpServletRequest("POST", "/api/v1/auth/login");
        request.setRemoteAddr(ip);
        return request;
    }
}
