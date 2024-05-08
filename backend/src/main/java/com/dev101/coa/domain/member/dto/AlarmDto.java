package com.dev101.coa.domain.member.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class AlarmDto {
    private Long memberId;
    private String memberNickName;
    private Long repoViewId;
    private String repoViewTitle;
    private LocalDateTime createAt;
}
