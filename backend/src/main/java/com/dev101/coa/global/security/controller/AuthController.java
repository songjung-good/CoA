package com.dev101.coa.global.security.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

import java.math.BigInteger;
import java.security.SecureRandom;


@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    @GetMapping("/google/start")
    public RedirectView startGoogleAuthentication(HttpServletRequest request) {
        String state = new BigInteger(130, new SecureRandom()).toString(32);
        String clientId = "765601865422-gfbpej2d4oequfvi35v14j6cba5iafvr.apps.googleusercontent.com";
        String redirectUri = "http://localhost:8080/login/oauth2/code/google";
        String scope = "email profile";

        String url = "https://accounts.google.com/o/oauth2/v2/auth?client_id=" + clientId +
                "&redirect_uri=" + redirectUri +
                "&scope=" + scope +
                "&response_type=code" +
                "&state=" + state;

        request.getSession().setAttribute("oauth_state", state); // 프론트에 주는건가?
        return new RedirectView(url);
    }

}