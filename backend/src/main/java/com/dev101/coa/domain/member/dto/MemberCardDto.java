package com.dev101.coa.domain.member.dto;

import lombok.*;

import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MemberCardDto {
    private Long memberId;
    private String memberNickName;
    private String memberImg;
    private String memberIntro;
    private List<String> skillList;

    // Constructors, getters, setters, and additional methods
}
