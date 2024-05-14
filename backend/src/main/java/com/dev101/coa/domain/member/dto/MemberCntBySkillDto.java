package com.dev101.coa.domain.member.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Getter
@Builder
@ToString
public class MemberCntBySkillDto {
    private String codeName;
    private Long memberCnt;
}
