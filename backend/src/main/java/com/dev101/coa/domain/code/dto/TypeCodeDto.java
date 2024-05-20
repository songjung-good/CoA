package com.dev101.coa.domain.code.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Map;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class TypeCodeDto {
    private String typeId;
    private String typeName;
    @Schema(description = "codeId : codeName", example = "{'1001':'Google', '1002':'Github', ...} ")
    private Map<Long, String> codes;

}
