package com.dev101.coa.global.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;

import java.io.IOException;

public class CustomAuthenticationFailureHandler implements AuthenticationFailureHandler {

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException {
        response.setStatus(HttpServletResponse.SC_BAD_GATEWAY);
        response.setContentType("application/json");
        response.getWriter().write("{\"error\": \"Authentication failed: " + exception.getMessage() + "\"}");
        response.getWriter().flush();
    }
}
