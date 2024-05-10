package com.dev101.coa.global.security;


import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@RequiredArgsConstructor
public class JwtAuthenticationCookieFilter extends OncePerRequestFilter {
    private final JwtTokenProvider jwtTokenProvider;  // 직접 구현 필요

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain)
            throws ServletException, IOException {


        try {
        String jwt = extractJwtFromCookie(request); // 이 뒤로는 똑같은거 아닌가? TODO 여기 뒤로만 비교하면 맞추면 듯.

        if (jwt != null && jwtTokenProvider.validateToken(jwt)) {
//            UsernamePasswordAuthenticationToken authentication = jwtTokenProvider.getAuthentication(jwt);

            Long memberId = jwtTokenProvider.getMemberIdFromJWT(jwt);

            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    memberId, null, Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))); // 임의의 권한

            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request)); // 사용자의 ip나 세션 정보를 저장
            SecurityContextHolder.getContext().setAuthentication(authentication); // 여기에 저장된 상태로 아래 filterChain을 통해 대상 서블릿이나 컨트롤러에 감.
        }
        filterChain.doFilter(request, response);
        } catch (AuthenticationException e) {
            // 에러 처리
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401 상태 코드 설정
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Authentication Error: " + e.getMessage() + "\"}");
            response.getWriter().flush();
        }
    }

    public String extractJwtFromCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("JWT".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}


