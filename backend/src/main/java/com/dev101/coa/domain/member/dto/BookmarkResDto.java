package com.dev101.coa.domain.member.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class BookmarkResDto {
    @Schema(description = "변경사항이 적용된 북마크(추가됐으면 true, 취소 됐으면 false)", example = "true/false")
    private Boolean currentStatus;
}
