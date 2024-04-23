package com.dev101.coa.domain.repo.dto;

import lombok.*;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RepoAnalysisDto {
    private Long repoViewId;
    private String comment;
    private CommitScoreDto commitScore;

    // Constructors, getters, setters, and additional methods
}
