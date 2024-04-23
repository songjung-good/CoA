package com.dev101.coa.domain.code.dto;

import java.util.Map;

public class TypeCodeDto {
    private String typeId;
    private String typeName;
    private Map<Long, String> codes;

    public TypeCodeDto(String typeId, String typeName, Map<Long, String> codes) {
        this.typeId = typeId;
        this.typeName = typeName;
        this.codes = codes;
    }

}
