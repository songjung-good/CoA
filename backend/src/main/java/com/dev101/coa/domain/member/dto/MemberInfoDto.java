package com.dev101.coa.domain.member.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MemberInfoDto {
    private UUID memberUuid;
    private String memberImg;
    private String memberNickName;
    private String githubNickName;
    private String gitlabNickName;
    private String solvedNickName;
    private String codeforcesNickName;
}
