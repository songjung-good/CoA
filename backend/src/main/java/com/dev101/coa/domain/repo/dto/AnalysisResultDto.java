package com.dev101.coa.domain.repo.dto;

import lombok.*;

import java.util.Map;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalysisResultDto {
    private Long analysisId;
    private Long memberId;

    private Boolean isComplete;

    private String readme;

    private String repoViewResult;

    private CommitScoreDto commitScore;

    private Map<Long, Integer> linesOfCode;


}
