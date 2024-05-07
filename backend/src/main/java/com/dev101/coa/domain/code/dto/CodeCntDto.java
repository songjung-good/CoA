package com.dev101.coa.domain.code.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class CodeCntDto {
    private String codeName;
    private Integer lineCnt;
}
