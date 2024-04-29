package com.dev101.coa.domain.repo.dto;

import lombok.*;

import java.util.Map;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class AnalysisResultDto {

    private String repoPath; // 저장된 레포 정보를 찾기 위함(API 요청에도 사용)

    private String userName; // 레포 구성원의 아이디(API 요청을 위해 필요함)

    private Long memberId; // CoA Service memberId

    private Boolean isOwn;

    private Integer percentage;

    private String readme;

    private String repoViewResult;

    private CommitScoreDto commitScore;

    private Map<Long, Integer> linesOfCode;


}
