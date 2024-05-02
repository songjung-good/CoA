package com.dev101.coa.global.security.service;

import com.dev101.coa.domain.member.entity.Member;
import com.dev101.coa.global.security.CustomOAuth2User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final AuthenticationService authenticationService;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

//        System.out.println("OAuth2UserRequest.getClientRegistration() = " + userRequest.getClientRegistration().getRegistrationId());
        OAuth2User oAuth2User = super.loadUser(userRequest); // userRequest를 넣으면 OAuth2User을 반환하는
        String registrationId = userRequest.getClientRegistration().getRegistrationId();


        // 기존에 로그인한 사용자 정보를 조회 (예: SecurityContextHolder를 통해)
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.getPrincipal() instanceof CustomOAuth2User) {
            CustomOAuth2User loggedUser = (CustomOAuth2User) authentication.getPrincipal();
            Member member = loggedUser.getMember();

            // 회원 DB에 해당 소셜 정보가 연동되어 있는지 확인
            Member linkedMember = authenticationService.linkSocialAccount(member, oAuth2User, registrationId);

            // 연동된 계정 정보를 업데이트하여 반환
            return new CustomOAuth2User(oAuth2User, linkedMember);
        } else {
            // 신규 로그인 처리
        Member newMember  = authenticationService.authenticateOAuth2(oAuth2User, registrationId);
        return new CustomOAuth2User(oAuth2User, newMember);
        }

    }
}


