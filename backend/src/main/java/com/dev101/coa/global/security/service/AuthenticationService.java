package com.dev101.coa.global.security.service;

import com.dev101.coa.domain.code.entity.Code;
import com.dev101.coa.domain.code.repository.CodeRepository;
import com.dev101.coa.domain.member.repository.AccountLinkRepository;
import com.dev101.coa.domain.member.entity.AccountLink;
import com.dev101.coa.domain.member.entity.Member;
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
import java.util.Optional;
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
//        System.out.println("여기야여기 authentication = " + authentication.getPrincipal());
//        System.out.println("여기야여기 authenticationdfgdfgdfg = " + SecurityContextHolder.getContext().getAuthentication().getPrincipal());
        SecurityContextHolder.getContext().setAuthentication(authentication);
        return member;

    }
    private Member updateOrCreateMember(OAuth2User oauthUser, String registrationId) {

        System.out.println("oauthUser + registrationId = " + oauthUser + registrationId);
        System.out.println("oauthUser.getAttributes() = " + oauthUser.getAttributes());
        SocialUserInfo userInfo = extractUserInfo(registrationId, oauthUser);

        String email = userInfo.getEmail();
        String userName = userInfo.getUsername();
        String img = userInfo.getImageUrl();
//        OAuth2UserInfo oAuth2UserInfo = OAuth2UserInfo.of(registrationId, oAuth2UserAttributes);
        // 어떤 로그인이냐에 따라 다른 로직이되게? 꼭 새로 안만들어도 가능은 할듯 새로만들면 좋긴한데 ,, 두개니까
        // Info 로 만들어볼까
//        System.out.println("확인 한 번만하고 지우자ㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏ registrationId "+registrationId);
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
        long codeId;
        if (registrationId.equals("google")) {
            codeId = 1001L;
        } else if (registrationId.equals("github")) {
            codeId = 1002L;
        } else if (registrationId.equals("kakao")) {
            codeId = 1006L;
        } else {
            throw new BaseException(StatusCode.NOT_FOUND_PLAT);
        }
        Code code = codeRepository.findById(codeId).orElseThrow(() -> new BaseException(StatusCode.NOT_FOUND_PLAT));
        System.out.println("code = " + code + code.getCodeId());
        return code;
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


    // 기존 회원에게 새 소셜 계정 연동
    public Member linkSocialAccount(Member existingMember, OAuth2User oAuth2User, String registrationId) {
        // OAuth2User에서 제공하는 소셜 미디어 고유 ID 추출
        Code platCode = codeRepository.findByCodeName(registrationId).orElseThrow(() -> new BaseException(StatusCode.NOT_FOUND_PLAT));


        // 기존에 연동된 계정인지 조회
        AccountLink accountLink = accountLinkRepository.findByMemberAndCode(existingMember, platCode);

        if (accountLink == null) {
            // 연동된 정보가 없으면 새로 빌드하여 저장 TODO 정보 넣어주기
            accountLink = AccountLink.builder()
                    .member(existingMember)
                    .code(platCode)
                    .accountLinkAccountId()
                    .accountLinkNickname()
                    .account_link_token()
                    .account_link_refresh_token()
                    .build();
            accountLinkRepository.save(accountLink);
        } else {
            // 이미 연동된 정보가 있다면, 닉네임 / 토큰 / 리프레시 토큰 갱신
            accountLink.
            socialAccountRepository.save(accountLink);
        }

        // 사용자 정보 반환
        return existingMember;
    }
}