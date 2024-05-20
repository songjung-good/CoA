package com.dev101.coa.domain.repo.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RepoDetailResDto {
    private RepoCardDto repoCardDto;
    private BasicDetailDto basicDetailDto;
    private CommitScoreDto commitScoreDto;
}
