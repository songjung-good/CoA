package com.dev101.coa.global.security.Info;

import lombok.RequiredArgsConstructor;

import java.util.Map;

@RequiredArgsConstructor
public class GitHubOAuth2UserInfo implements OAuth2UserInfo {
    private Map<String, Object> attributes; // OAuth2에서 반환된 속성 맵

    public GitHubOAuth2UserInfo(Map<String, Object> attributes) {
        this.attributes = attributes;
    }

    @Override
    public String getId() {
        return ((Integer) attributes.get("id")).toString(); // GitHub에서는 사용자 ID가 정수 형태로 반환됨
    }

    @Override
    public String getName() {
        return (String) attributes.get("name"); // GitHub의 이름
    }

    @Override
    public String getEmail() {
        return (String) attributes.get("email"); // GitHub의 이메일
    }
}
