package com.dev101.coa.domain.repo.dto;

import com.dev101.coa.domain.code.dto.CodeCntDto;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

import java.util.List;
import java.util.Map;

@Getter
@Builder
public class BasicDetailDto {
    private String repoReadme;
    private String repoViewResult;
    private List<CommitCommentDto> commentList;
    private Long repoViewTotalCommitCnt;
    private Long repoViewCommitCnt;
    private Integer repoViewMemberCnt;
    @Schema(description = "언어 별 코드 줄 수")
    private List<CodeCntDto> repoLineCntList;
}
