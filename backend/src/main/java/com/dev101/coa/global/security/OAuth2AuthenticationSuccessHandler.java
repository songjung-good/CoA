package com.dev101.coa.global.security;

import com.dev101.coa.domain.code.entity.Code;
import com.dev101.coa.domain.code.repository.CodeRepository;
import com.dev101.coa.domain.member.entity.AccountLink;
import com.dev101.coa.domain.member.entity.Member;
import com.dev101.coa.domain.member.repository.AccountLinkRepository;
import com.dev101.coa.domain.member.repository.MemberRepository;
import com.dev101.coa.global.common.StatusCode;
import com.dev101.coa.global.exception.BaseException;
import com.dev101.coa.global.security.info.GitHubUserInfo;
import com.dev101.coa.global.security.info.GitLabUserInfo;
import com.dev101.coa.global.security.info.SocialUserInfo;
import com.dev101.coa.global.security.oauth2user.CustomOAuth2User;
import com.dev101.coa.global.security.oauth2user.platOAuth2User;
import com.dev101.coa.global.security.service.EncryptionUtils;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.OAuth2RefreshToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URL;
import java.util.Map;
import java.util.Optional;


@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtTokenProvider jwtTokenProvider;
    private final OAuth2AuthorizedClientService authorizedClientService;
    private final MemberRepository memberRepository;
    private final AccountLinkRepository accountLinkRepository;
    private final CodeRepository codeRepository;
    private final EncryptionUtils encryptionUtils;

    @Value("${app.jwt.expiration-ms}")
    private int jwtExpirationInMs;
    @Override // 요청 온것 , 보낼 반환 , 인증 과정에서 반환한 객체 ( 인증 정보 저장은 의미 없는거 아닌가? )
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws ServletException, IOException {

        Long memberId = getMemberIdFromRequest(request);
        Object authe = authentication.getPrincipal();


        if (memberId != 0 && authe instanceof platOAuth2User) {
            Optional<Member> member = memberRepository.findByMemberId(memberId);
            Member linkMember = member.orElseThrow(() -> new BaseException(StatusCode.MEMBER_NOT_EXIST));

            try {
                makeAccountLink(linkMember, authentication);
                String requestDomain = determineRedirectUrl(request);
                response.sendRedirect(requestDomain + "/auth/link");
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        } else {
            // JWT 토큰 생성
            OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
            Member member = null;
            CustomOAuth2User customOAuth2User = (CustomOAuth2User) oAuth2User;
            member = customOAuth2User.getMember();
            String token = jwtTokenProvider.createToken(member);

            // 쿠키에 토큰 설정
            Cookie jwtCookie = new Cookie("JWT", token);
            jwtCookie.setHttpOnly(true);
            jwtCookie.setSecure(true);
            jwtCookie.setPath("/");
            jwtCookie.setMaxAge(jwtExpirationInMs);
            response.addCookie(jwtCookie);
            try {
                String requestDomain = determineRedirectUrl(request);
                response.sendRedirect(requestDomain + "/main");
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }
        super.onAuthenticationSuccess(request, response, authentication);
    }

    public String determineRedirectUrl(HttpServletRequest request) throws Exception {
//        String refererHeader = request.getHeader("Referer"); // https -> http의 경우 헤더가 보안상 사라짐
//        System.out.println("refererHeader = " + refererHeader);
        String urlString = request.getRequestURL().toString();
        URL url = new URL(urlString);  // URL 객체를 생성합니다.
        String domain = url.getHost();

        switch (domain) {
            case "localhost" -> {
                return "http://localhost:3000";
            }
            case "k10e101.p.ssafy.io" -> {
                System.out.println("domain = " + domain);
                return "https://k10e101.p.ssafy.io";
            }
            case "commitanalyze.com" -> {
                System.out.println("domain = " + domain);
                return "https://commitanalyze.com";
            }
        }
        return "http://localhost:3000";
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

    private Long getMemberIdFromRequest(HttpServletRequest request) {
        // 여기선 request에서 쿠키로 잘된다.
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("JWT".equals(cookie.getName())) {
                    String jwt = cookie.getValue();
                    try {
                        return jwtTokenProvider.getMemberIdFromJWT(jwt);
                    } catch (Exception e) {
                        System.out.println("Invalid JWT or Member not found");
                    }
                }
            }
        }
        return 0L;
    }



    // 기존 회원에게 새 소셜 계정 연동
    public void makeAccountLink(Member existingMember, Authentication authentication) throws Exception {

        encryptionUtils.init();
        platOAuth2User oAuth2User = (platOAuth2User) authentication.getPrincipal();
        Code platCode = oAuth2User.getPlatCode();
        Map<String, Object> oAuth2UserAttribute = oAuth2User.getAttributes();

        OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
        OAuth2AuthorizedClient client = authorizedClientService.loadAuthorizedClient(
                oauthToken.getAuthorizedClientRegistrationId(), oauthToken.getName());

        String accessTokenValue = client.getAccessToken().getTokenValue();
        OAuth2RefreshToken refreshToken = client.getRefreshToken();

        String refreshTokenValue = null;
        if (refreshToken != null) {
            refreshTokenValue = refreshToken.getTokenValue();
        }

        String encryptedAccessToken = encryptionUtils.encrypt(accessTokenValue);
        String encryptedRefreshToken = encryptionUtils.encrypt(refreshTokenValue);

        SocialUserInfo userInfo = null;

        if (platCode.equals(codeRepository.findByCodeId(1002L).orElseThrow(() -> new BaseException(StatusCode.CODE_NOT_FOUND)))) {
            userInfo = new GitHubUserInfo(oAuth2UserAttribute);
        } else if (platCode.equals(codeRepository.findByCodeId(1003L).orElseThrow(() -> new BaseException(StatusCode.CODE_NOT_FOUND)))) {
            userInfo = new GitLabUserInfo(oAuth2UserAttribute);
        }

//        System.out.println("userInfo = " + userInfo);
//        System.out.println("userInfo = " + userInfo.getUsername());
        String userName = userInfo != null ? userInfo.getUsername() : null;
        String email = userInfo != null ? userInfo.getEmail() : null;

        // 기존에 연동된 계정인지 조회
        Optional<AccountLink> optionalAccountLink = accountLinkRepository.findByMemberAndCode(existingMember, platCode);
        optionalAccountLink.ifPresentOrElse(
                accountLink -> {
                    // 이미 연동된 정보가 있다면, 닉네임 / 토큰 / 리프레시 토큰 갱신
                    accountLink.updateAccountLinkFields(accountLink.getAccountLinkId() ,userName ,encryptedAccessToken ,encryptedRefreshToken, email);
                    accountLinkRepository.save(accountLink);                },
                () -> {
                    // 연동된 정보가 없으면 새로 빌드하여 저장 TODO 정보 넣어주기
                    new AccountLink();
                    AccountLink newAccountLink = AccountLink.builder()
                            .member(existingMember)
                            .code(platCode)
                            .accountLinkNickname(userName)
                            .accountLinkEmail(email)
                            .accountLinkToken(encryptedAccessToken)
                            .accountLinkRefreshToken(encryptedRefreshToken)
                            .build();
                    accountLinkRepository.save(newAccountLink);
                }
        );
    }

}
