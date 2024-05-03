package com.dev101.coa.domain.code.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CodeCntDto {
    private String codeName;
    private Long lineCnt;
}
