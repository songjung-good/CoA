package com.dev101.coa.domain.repo.dto;

import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

@Getter
public class SaveAnalysisReqDto {
    private String repoViewTitle;
    private String repoViewSubtitle;
    private LocalDate repoStartDate;
    private LocalDate repoEndDate;
    private Integer repoViewMemberCnt;
    private List<Long> repoViewSkillList;
}
