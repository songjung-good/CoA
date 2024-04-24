package com.dev101.coa.global.security;

import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User user = super.loadUser(userRequest);

        // Here you can perform additional tasks, like syncing user data with your database
        return processOAuth2User(user);
    }

    private OAuth2User processOAuth2User(OAuth2User user) {
        // Extract needed information from OAuth2User and create/update local user database
        return user;
    }
}
