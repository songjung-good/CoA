package com.dev101.coa.global.security.info;

import java.util.Map;

public class GitHubUserInfo implements SocialUserInfo {
    private Map<String, Object> attributes;

    public GitHubUserInfo(Map<String, Object> attributes) {
        this.attributes = attributes;
    }

    @Override
    public String getUsername() {
        return (String) attributes.get("login");
    }

    @Override
    public String getEmail() {
        return (String) attributes.get("html_url");
    }

    @Override
    public String getImageUrl() {
        return (String) attributes.get("avatar_url");
    }
}