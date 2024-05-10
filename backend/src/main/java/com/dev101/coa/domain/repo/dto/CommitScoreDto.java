package com.dev101.coa.domain.repo.dto;

import com.dev101.coa.domain.repo.entity.CommitScore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommitScoreDto {
    private Short readability;
    private Short performance;
    private Short reusability;
    private Short testability;
    private Short exception;
    private Short total;
    private String scoreComment;

    public CommitScoreDto(CommitScore commitScore) {
        this.readability = commitScore.getScoreReadability();
        this.performance = commitScore.getScorePerformance();
        this.reusability = commitScore.getScoreReusability();
        this.testability = commitScore.getScoreTestability();
        this.exception = commitScore.getScoreException();
        this.total = commitScore.getScoreTotal();
        this.scoreComment = commitScore.getScoreComment();
    }

}
