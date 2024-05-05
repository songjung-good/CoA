package com.dev101.coa.global.security.service;

import com.dev101.coa.global.security.JwtAuthenticationFilter;
import com.dev101.coa.global.security.JwtTokenProvider;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class JwtCookieMemberService {
    private final JwtTokenProvider jwtTokenProvider;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public Long getMemberIdFromCookie(HttpServletRequest request) {

        return jwtTokenProvider.getMemberIdFromJWT(jwtAuthenticationFilter.getJwtFromRequest(request));

    }
}
