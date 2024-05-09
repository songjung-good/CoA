package com.dev101.coa.domain.repo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MyRepoAnalysis {

    private Map<Long, Map<String, Double>> jobs;
    private CommitScoreDto myScoreAverage;
    private List<RepoAnalysisDto> repos;
}