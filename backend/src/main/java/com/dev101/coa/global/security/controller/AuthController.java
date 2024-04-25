package com.dev101.coa.global.security.controller;

import com.dev101.coa.global.security.service.AuthenticationService;
import com.dev101.coa.global.security.service.CustomOAuth2UserService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationService authenticationService;
    private final CustomOAuth2UserService customOAuth2UserService;


    @PostMapping("/oauth")
    public ResponseEntity<?> authenticateUser(@AuthenticationPrincipal OAuth2User principal) {
        String jwt = authenticationService.authenticateOAuth2(principal);

        return ResponseEntity.ok().body(new AuthResponse(jwt));
    }


    @Getter
    public static class AuthResponse {
        private String authToken;

        public AuthResponse(String authToken) {
            this.authToken = authToken;
        }

        public void setAuthToken(String authToken) {
            this.authToken = authToken;
        }
    }
}