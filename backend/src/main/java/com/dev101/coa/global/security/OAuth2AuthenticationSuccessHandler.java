package com.dev101.coa.global.security;

import com.dev101.coa.domain.member.entity.Member;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;


@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtTokenProvider jwtTokenProvider;

    @Value("${url.client}")
    private String clientUrl;
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws ServletException, IOException {
        // JWT 토큰 생성
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        Member member = null;
        CustomOAuth2User customOAuth2User = (CustomOAuth2User) oAuth2User;

        member = customOAuth2User.getMember();
            // 이제 멤버를 사용하여 추가 작업을 수행할 수 있습니다.
            // 예를 들어, 멤버의 정보를 출력해보겠습니다.
//            System.out.println("사용자의 이름: " + customOAuth2User);
//            System.out.println("사용자의 이름: " + member.getMemberNickname());
//            System.out.println("사용자의 이름: " + member.getMemberId());
//            System.out.println("사용자의 이메일: " + member.getMemberEmail());

        String token = jwtTokenProvider.createToken(member);

        // 쿠키에 토큰 설정
        Cookie jwtCookie = new Cookie("JWT", token);
        jwtCookie.setHttpOnly(true);
        jwtCookie.setSecure(true); // HTTPS에서만 쿠키를 전송
        jwtCookie.setPath("/");
        response.addCookie(jwtCookie);
        response.sendRedirect("clientUrl");  // 사용자를 홈 페이지로 리다이렉트

        super.onAuthenticationSuccess(request, response, authentication);
    }
}
