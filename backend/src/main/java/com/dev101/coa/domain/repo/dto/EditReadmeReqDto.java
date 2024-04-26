package com.dev101.coa.domain.repo.dto;

import lombok.Getter;

import java.util.List;

@Getter
public class EditReadmeReqDto {
    private Long repoViewId;
    private String repoViewReadme;
    private List<CommitCommentDto> commitCommentDtoList;
    private List<Long> codeList;
}
