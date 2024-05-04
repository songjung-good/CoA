package com.dev101.coa.domain.repo.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;

@Getter
public class AnalysisReqDto {
    private String repoUrl;
    @Schema(description = "레포 구성원의 아이디", example = "ha09368")
    private String userName;
    private String projectId;
}
