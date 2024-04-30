package com.dev101.coa.global.security.service;

import com.dev101.coa.domain.member.entity.Member;
import com.dev101.coa.global.security.CustomOAuth2User;
import lombok.RequiredArgsConstructor;
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

        OAuth2User oAuth2User = super.loadUser(userRequest); // userRequest를 넣으면 OAuth2User을 반환하는
//        System.out.println("OAuth2UserRequest.getClientRegistration() = " + userRequest.getClientRegistration().getRegistrationId());
        String registrationId = userRequest.getClientRegistration().getRegistrationId();

        Member member = authenticationService.authenticateOAuth2(oAuth2User, registrationId);
        return new CustomOAuth2User(oAuth2User, member);
    }
}


