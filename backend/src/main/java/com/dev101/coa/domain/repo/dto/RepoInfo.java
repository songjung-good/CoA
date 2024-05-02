package com.dev101.coa.domain.repo.dto;

import com.dev101.coa.domain.code.entity.Code;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Builder
public class RepoInfo {
    private Code repoCode;
    private String repoPath;
    private String repoReadmeOrigin;
    private Long repoCommitCnt;
    private Long repoPrCnt;
    private Integer repoGitLabProjectId;
    private LocalDate repoStartDate;
    private LocalDate repoEndDate;
    private Integer repoMemberCnt;
}
