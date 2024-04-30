package com.dev101.coa.domain.repo.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class RepoInfo {
    private String repoPath;
    private String repoReadmeOrigin;
    private Long repoCommitCnt;
    private Long repoPrCnt;
    private Integer repoGitLabProjectId;
    private LocalDateTime repoStartDate;
    private LocalDateTime repoEndDate;
    private Integer repoMemberCnt;
}
