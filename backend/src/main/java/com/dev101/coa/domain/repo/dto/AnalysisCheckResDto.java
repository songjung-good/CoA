package com.dev101.coa.domain.repo.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AnalysisCheckResDto {
    private String analysisId;
    private Integer percentage;
}
