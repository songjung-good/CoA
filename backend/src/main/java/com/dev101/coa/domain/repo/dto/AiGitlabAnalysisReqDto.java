package com.dev101.coa.domain.repo.dto;

import lombok.Builder;

@Builder
public class AiGitlabAnalysisReqDto {
    private String analysisId;
    private String baseUrl;
    private Integer projectId;
    private String userName;
    private String privateToken;
}
