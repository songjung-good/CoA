package com.dev101.coa.domain.repo.dto;

import lombok.Getter;

import java.util.List;

@Getter
public class EditReadmeReqDto {
    private String repoViewReadme;
    private List<CommitCommentDto> commitCommentDtoList;
}
