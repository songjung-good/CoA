package com.dev101.coa.global.security;

import com.dev101.coa.domain.member.entity.Member;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URL;


@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtTokenProvider jwtTokenProvider;
    
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws ServletException, IOException {
        // JWT 토큰 생성
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        Member member = null;
        CustomOAuth2User customOAuth2User = (CustomOAuth2User) oAuth2User;

        member = customOAuth2User.getMember();
        String token = jwtTokenProvider.createToken(member);

        // 쿠키에 토큰 설정
        Cookie jwtCookie = new Cookie("JWT", token);
        jwtCookie.setHttpOnly(true);
        jwtCookie.setSecure(true); // HTTPS에서만 쿠키를 전송
        jwtCookie.setPath("/");
        response.addCookie(jwtCookie);

        // 요청한 도메인에 따라 다르게 작동하게 하기 위한 설정
        String refererHeader = request.getHeader("Referer");

        if (refererHeader != null && isAllowedDomain(refererHeader)) {
            URL refererUrl = new URL(refererHeader);
            String domain = refererUrl.getHost();
            int port = refererUrl.getPort();

            // 허용된 도메인이면, 포트와 도메인에 따라 적절히 리디렉션합니다.
            if (domain.equals("localhost") && port == 3000) {
                response.sendRedirect("http://localhost:3000");
            } else if (domain.equals("k10e101.p.ssafy.io")) {
                response.sendRedirect("https://k10e101.p.ssafy.io");
            } else {
                // 허용되지 않은 도메인의 경우 기본 도메인으로 리디렉션합니다.
                response.sendRedirect("https://k10e101.p.ssafy.io");
            }
        } else {
            // Referer가 없거나 기타 문제가 있는 경우 기본 도메인으로 리디렉션합니다.
            response.sendRedirect("https://k10e101.p.ssafy.io");
        }

        super.onAuthenticationSuccess(request, response, authentication);
    }

    private boolean isAllowedDomain(String url) {
        try {
            URL parsedUrl = new URL(url);
            String host = parsedUrl.getHost();
            return host.equals("localhost") || host.equals("k10e101.p.ssafy.io");
        } catch (Exception e) {
            return false;
        }
    }
}
