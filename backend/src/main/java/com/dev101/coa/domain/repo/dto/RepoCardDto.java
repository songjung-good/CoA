package com.dev101.coa.domain.repo.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

@Builder
@Getter
public class RepoCardDto {
    private Long memberId;

    private String memberNickname;

    private String memberImg;

    private Long repoViewId;

    private String repoViewTitle;

    private String repoViewSubtitle;

    private List<String> skillList;

    private LocalDate repoStartDate;

    private LocalDate repoEndDate;

    private Boolean isMine;
}
