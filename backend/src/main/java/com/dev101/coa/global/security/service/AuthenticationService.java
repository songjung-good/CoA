package com.dev101.coa.global.security.service;

import com.dev101.coa.domain.code.entity.Code;
import com.dev101.coa.domain.code.repository.CodeRepository;
import com.dev101.coa.domain.member.entity.Member;
import com.dev101.coa.domain.member.repository.AccountLinkRepository;
import com.dev101.coa.domain.member.repository.MemberRepository;
import com.dev101.coa.global.common.StatusCode;
import com.dev101.coa.global.exception.BaseException;
import com.dev101.coa.global.security.info.GitHubUserInfo;
import com.dev101.coa.global.security.info.GoogleUserInfo;
import com.dev101.coa.global.security.info.KakaoUserInfo;
import com.dev101.coa.global.security.info.SocialUserInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final MemberRepository memberRepository;
    private final CodeRepository codeRepository;
    private final AccountLinkRepository accountLinkRepository;

    public Member authenticateOAuth2(OAuth2User oauthUser, String registrationId) {
        // 사용자 데이터베이스 업데이트
        Member member = updateOrCreateMember(oauthUser, registrationId);

        // 인증 정보 생성
        Authentication authentication = new UsernamePasswordAuthenticationToken(member.getMemberId(), null, oauthUser.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);
        return member;

    }
    private Member updateOrCreateMember(OAuth2User oauthUser, String registrationId) {

        SocialUserInfo userInfo = extractUserInfo(registrationId, oauthUser);

        String email = userInfo.getEmail();
        String userName = userInfo.getUsername();
        String img = userInfo.getImageUrl();

        Member member = memberRepository.findByMemberEmail(email);
        if (member == null) {
            assert registrationId != null;
            member = Member.builder()
                    .memberEmail(email)
                    .memberNickname(userName)
                    .memberImg(img)
                    .memberUuid(UUID.randomUUID())
                    .memberPlatformCode(resolvePlatformCode(registrationId))
                    .build();
        } else {
            member.updateMemberNickname(userName); // 혹은 다른 업데이트 로직
            member.updateMemberImg(img);
        }
        memberRepository.save(member);
        return member;
    }


    private Code resolvePlatformCode(String registrationId) {
        long codeId = switch (registrationId) {
            case "google" -> 1001L;
            case "github" -> 1002L;
            case "gitlab" -> 1003L;
            case "kakao" -> 1006L;
            default -> throw new BaseException(StatusCode.NOT_FOUND_PLAT);
        };
        return codeRepository.findById(codeId).orElseThrow(() -> new BaseException(StatusCode.NOT_FOUND_PLAT));
    }

    public SocialUserInfo extractUserInfo(String registrationId, OAuth2User oauthUser) {
        Map<String, Object> attributes = oauthUser.getAttributes();
        if ("google".equals(registrationId)) {
            return new GoogleUserInfo(attributes);
        } else if ("github".equals(registrationId)) {
            return new GitHubUserInfo(attributes);
        } else if ("kakao".equals(registrationId)) {
            return new KakaoUserInfo(attributes);
        }
        else {
            throw new IllegalArgumentException("Unsupported provider: " + registrationId);
        }
    }

}