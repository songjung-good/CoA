package com.dev101.coa.domain.repo.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

@Builder
public class AiAnalysisReqDto {
    @Schema(description = "레포 주소", example = "https://github.com/사용자명/레포이름")
    private String repoUrl;

    @Schema(description = "깃랩: 프로젝트 아이디 / 깃허브: null", example = "깃랩: 123456, 깃헙: null")
    private String projectId;

    @Schema(description = "레포 주인의 레포 아이디", example = "ha09368")
    private String userName;

    @Schema(description = "레포 주인 - 분석하는 사람(로그인한 사람) 일치 여부", example = "true/false")
    private Boolean isOwn;
}
