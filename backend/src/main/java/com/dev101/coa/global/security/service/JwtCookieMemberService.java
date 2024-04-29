package com.dev101.coa.global.security.service;

import com.dev101.coa.global.security.JwtAuthenticationCookieFilter;
import com.dev101.coa.global.security.JwtTokenProvider;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class JwtCookieMemberService {
    private final JwtTokenProvider jwtTokenProvider;
    private final JwtAuthenticationCookieFilter jwtAuthenticationCookieFilter;

    public Long getMemberIdFromCookie(HttpServletRequest request) {

        return jwtTokenProvider.getMemberIdFromJWT(jwtAuthenticationCookieFilter.extractJwtFromCookie(request));

    }
}
