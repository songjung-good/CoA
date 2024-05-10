package com.dev101.coa.domain.repo.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RepoAnalysisDto {
    private Long repoViewId;
    private String repoTitle;
    private String repoSubTitle;
    private LocalDate repoStartDate;
    private LocalDate repoEndDate;

    private CommitScoreDto commitScoreDto;
}
