package com.dev101.coa.domain.repo.dto;

import com.dev101.coa.domain.code.dto.CodeDto;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

@Getter
public class RepoCardEditReqDto {
    private String repoViewTitle;
    private String repoViewSubtitle;
    private Integer repoMemberCnt;
    private List<Long> skillIdList;
    private LocalDate repoStartDate;
    private LocalDate repoEndDate;
}
