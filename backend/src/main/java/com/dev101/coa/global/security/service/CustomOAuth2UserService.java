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
        System.out.println("소셜로그인을 하면 바로 여기로 오는건가 ? userRequest = " + userRequest);
        OAuth2User oAuth2User = super.loadUser(userRequest);
        Member member = authenticationService.authenticateOAuth2(oAuth2User);
        return new CustomOAuth2User(oAuth2User, member);
    }
}


