package com.dev101.coa.domain.repo.dto;

import lombok.*;

import java.io.Serializable;
import java.util.Map;

@Builder
@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class AiResultDto {
    private Long totalCommitCnt;

    private String readme;

    private String repoViewResult;

    private CommitScoreDto commitScore;

    private Map<Long, Integer> linesOfCode;
}
