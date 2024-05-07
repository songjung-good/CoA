package com.dev101.coa.domain.member.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AccountLinkInfoDto {
    private String githubNickName;
    private Boolean isGithubToken;
    private String gitlabNickName;
    private Boolean isGitlabToken;
    private String solvedacNickName;
    private String codeforcesNickName;
}
