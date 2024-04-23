package com.dev101.coa.domain.member.dto;

import lombok.*;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MemberCardDto {
    private Long memberId;
    private String memberNickName;
    private String memberImg;
    private String memberIntro;
    private String[] skillList;

    // Constructors, getters, setters, and additional methods
}
