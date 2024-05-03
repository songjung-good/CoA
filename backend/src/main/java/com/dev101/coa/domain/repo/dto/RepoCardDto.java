package com.dev101.coa.domain.repo.dto;

import java.time.LocalDate;

public class RepoCardDto {
    private Long memberId;

    private String memberNickname;

    private String memberImg;

    private Long repoViewId;

    private String repoViewTitle;

    private String repoViewSubtitle;

    private String[] skillList;

    private LocalDate repoStartDate;

    private LocalDate repoEndDate;

    private Boolean isMine;
}
