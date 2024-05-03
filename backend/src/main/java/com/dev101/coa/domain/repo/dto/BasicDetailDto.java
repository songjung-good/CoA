package com.dev101.coa.domain.repo.dto;

import com.dev101.coa.domain.code.dto.CodeCntDto;
import lombok.Builder;
import lombok.Getter;

import java.util.List;
import java.util.Map;

@Getter
@Builder
public class BasicDetailDto {
    private String repoReadme;
    private String repoViewResult;
    private List<CommitCommentDto> CommentList;
    private Long repoViewTotalCommitCnt;
    private Long repoViewCommitCnt;
    private Map<String, CodeCntDto> repoLineCntMap;
}
