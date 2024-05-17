package com.dev101.coa.domain.member.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Builder
public class AlarmDto {
    private UUID memberUuid;
    private String memberNickName;
    private Long repoViewId;
    private String repoViewTitle;
    private LocalDateTime createAt;

    public void updateRepoViewInfo(Long repoViewId, String repoViewTitle){
        this.repoViewId = repoViewId;
        this.repoViewTitle = repoViewTitle;
    }
}
