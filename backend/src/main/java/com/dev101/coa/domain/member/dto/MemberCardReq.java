package com.dev101.coa.domain.member.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MemberCardReq {
    private String introduce;

    private List<Long> skillIdList;

    private Long jobCodeId;
}
