package com.dev101.coa.domain.repo.dto;

import lombok.Getter;

@Getter
public class AnalysisReqDto {
    private String repoUrl;
    private String userName;
    private String projectId;
}
