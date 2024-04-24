package com.dev101.coa.global.security;

import com.dev101.coa.domain.member.entity.Member;
import com.dev101.coa.domain.member.repository.MemberRepository;
import com.dev101.coa.global.security.Info.GitHubOAuth2UserInfo;
import com.dev101.coa.global.security.Info.GoogleOAuth2UserInfo;
import com.dev101.coa.global.security.Info.OAuth2UserInfo;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;


@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private MemberRepository memberRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauthUser = super.loadUser(userRequest);

        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        OAuth2UserInfo userInfo;

        if ("google".equals(registrationId)) {
            userInfo = new GoogleOAuth2UserInfo(user.getAttributes()); // 확인
        } else if ("github".equals(registrationId)) {
            userInfo = new GitHubOAuth2UserInfo(user.getAttributes());
        } else {
            throw new OAuth2AuthenticationException("Login with " + registrationId + " is not supported yet.");
        }
        return processOAuth2User(userRequest, oauthUser);
    }

    private OAuth2User processOAuth2User(OAuth2UserRequest userRequest, OAuth2User oauthUser) {
        // 플랫폼 식별
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        String userNameAttributeName = userRequest.getClientRegistration().getProviderDetails().getUserInfoEndpoint().getUserNameAttributeName();

        OAuth2UserInfo userInfo;
        if (registrationId.equalsIgnoreCase("google")) {
            userInfo = new GoogleOAuth2UserInfo(oauthUser.getAttributes());
        } else if (registrationId.equalsIgnoreCase("github")) {
            userInfo = new GitHubOAuth2UserInfo(oauthUser.getAttributes());
        } else {
            throw new OAuth2AuthenticationException("Sorry, login with " + registrationId + " is not supported yet.");
        }

        // 사용자 정보와 데이터베이스의 정보를 동기화하거나 새 사용자를 생성
        Member member = memberRepository.findByMemberEmail(userInfo.getEmail());
        if (member == null) {
            member = new Member();
        }
        // 사용자 정보 업데이트
        member.setEmail(userInfo.getEmail());
        member.setName(userInfo.getName());
        memberRepository.save(member);

        return UserPrincipal.create(member, oauthUser.getAttributes());
    }

}


