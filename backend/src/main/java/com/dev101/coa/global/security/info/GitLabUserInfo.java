package com.dev101.coa.global.security.info;

import java.util.Map;

public class GitLabUserInfo implements SocialUserInfo {
    private Map<String, Object> attributes;

    public GitLabUserInfo(Map<String, Object> attributes) {
        this.attributes = attributes;
    }

    @Override
    public String getUsername() {
        return (String) attributes.get("username");
    }

    @Override
    public String getEmail() {
        return (String) attributes.get("email");
    }

    @Override
    public String getImageUrl() {
        return (String) attributes.get("avatar_url");
    }
}