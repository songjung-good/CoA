package com.dev101.coa.domain.repo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class AiGitlabAnalysisReqDto {
    private String analysisId;
    private String baseUrl;
    private Integer projectId;
    private String userName;
    private String privateToken;
}
