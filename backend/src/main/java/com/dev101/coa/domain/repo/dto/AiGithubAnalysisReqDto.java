package com.dev101.coa.domain.repo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class AiGithubAnalysisReqDto {
    private String analysisId;
    private String repoPath;
    private String userName;
    private String accessToken;
}
