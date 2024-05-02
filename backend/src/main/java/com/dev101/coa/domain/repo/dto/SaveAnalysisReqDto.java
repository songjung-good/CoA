package com.dev101.coa.domain.repo.dto;

import com.dev101.coa.domain.repo.entity.RepoViewSkill;
import lombok.Getter;
import lombok.ToString;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@ToString
public class SaveAnalysisReqDto {
    private String repoViewTitle;
    private String repoViewSubtitle;
    private LocalDate repoStartDate;
    private LocalDate repoEndDate;
    private List<Long> repoViewSkillList;
}
