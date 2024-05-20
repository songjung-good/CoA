package com.dev101.coa.domain.code.dto;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class CodeDto {
    private Long codeId;
    private String codeName;
}
