package com.dev101.coa.global.security.service;

import com.dev101.coa.domain.code.entity.Code;
import com.dev101.coa.domain.code.repository.CodeRepository;
import com.dev101.coa.domain.member.entity.Member;
import com.dev101.coa.domain.member.repository.MemberRepository;
import com.dev101.coa.global.common.StatusCode;
import com.dev101.coa.global.exception.BaseException;
import com.dev101.coa.global.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final JwtTokenProvider jwtTokenProvider;
    private final MemberRepository memberRepository;
    private final CodeRepository codeRepository;

    public Member authenticateOAuth2(OAuth2User oauthUser) {
        // 사용자 데이터베이스 업데이트
        Member member = updateOrCreateMember(oauthUser);

//        UserPrincipal userPrincipal = new UserPrincipal(member, oauthUser.getAuthorities());

        // 인증 정보 생성
        Authentication authentication = new UsernamePasswordAuthenticationToken(member.getMemberId(), null, oauthUser.getAuthorities());
        System.out.println("authentication = " + authentication);
        System.out.println("여기야여기 authentication = " + authentication.getPrincipal());
        SecurityContextHolder.getContext().setAuthentication(authentication);
        System.out.println("여기야여기 authenticationdfgdfgdfg = " + SecurityContextHolder.getContext().getAuthentication().getPrincipal());
        return member;

    }
    private Member updateOrCreateMember(OAuth2User oauthUser) { // 여기서 깃허브랑 분기처리 할까?
        System.out.println("oauthUser = " + oauthUser);
        String provider = "google"; // 이 값은 ClientRegistration에서 가져올 수 있습니다.
        String registrationId = oauthUser.getAttribute("sub");
        String email = oauthUser.getAttribute("email");
        String name = oauthUser.getAttribute("name");
//        OAuth2UserInfo oAuth2UserInfo = OAuth2UserInfo.of(registrationId, oAuth2UserAttributes);
        // 어떤 로그인이냐에 따라 다른 로직이되게? 꼭 새로 안만들어도 가능은 할듯

        System.out.println("확인 한 번만하고 지우자ㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏ registrationId "+registrationId);
        Member member = memberRepository.findByMemberEmail(email);
        if (member == null) {
            assert registrationId != null;
            member = Member.builder()
                    .memberEmail(email)
                    .memberNickname(name)
                    .memberUuid(UUID.randomUUID())
                    .memberPlatformCode(resolvePlatformCode(provider))
                    .build();
        } else {
            member.updateMemberNickname(name); // 혹은 다른 업데이트 로직
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
        } else {
            throw new BaseException(StatusCode.NOT_FOUND_PLAT);
        }
        Code code = codeRepository.findById(codeId).orElseThrow(() -> new BaseException(StatusCode.NOT_FOUND_PLAT));
        System.out.println("code = " + code + code.getCodeId());
        return code;
    }
}