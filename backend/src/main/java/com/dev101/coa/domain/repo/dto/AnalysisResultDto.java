package com.dev101.coa.domain.repo.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jdk.jfr.Description;
import lombok.*;

import java.util.Map;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalysisResultDto {

    private String repoPath; // 저장된 레포 정보를 찾기 위함(API 요청에도 사용)

    private String projectId; // gitLab projectId

    private String userName; // 레포 구성원의 아이디(API 요청을 위해 필요함)

    private Long memberId; // CoA Service memberId

//    private Long codeId;

    private Boolean isOwn;

    private Integer percentage;

    @Schema(description="전체 커밋 수, 개인 커밋 수, 리드미, 레포 분석 결과, 커밋 점수, 언어 별 코드 줄 수")
    private AiResultDto result; // readme, commitScore, commitComment, linesOfCode

    public void updateResult(AiResultDto aiResultDto){
        this.result = aiResultDto;
    }


}
