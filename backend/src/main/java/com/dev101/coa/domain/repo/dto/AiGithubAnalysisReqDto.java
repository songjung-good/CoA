package com.dev101.coa.domain.repo.dto;

import lombok.Builder;

@Builder
public class AiGithubAnalysisReqDto {
    private String analysisId;
    private String repoPath;
    private String userName;
    private String accessToken;
}
