package com.dev101.coa.global.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;

import java.io.IOException;

public class CustomAuthenticationFailureHandler implements AuthenticationFailureHandler {

    private final OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler;

    public CustomAuthenticationFailureHandler(OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler) {
        this.oAuth2AuthenticationSuccessHandler = oAuth2AuthenticationSuccessHandler;
    }

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException {
        String url;
        try {
            url = oAuth2AuthenticationSuccessHandler.determineRedirectUrl(request);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        response.sendRedirect(url + "/error");
//        response.setStatus(HttpServletResponse.SC_BAD_GATEWAY);
//        response.setContentType("application/json");
//        response.getWriter().write(exception.getMessage());
//        response.getWriter().flush();
    }
}
