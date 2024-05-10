package com.dev101.coa.domain.member.dto;

import com.dev101.coa.domain.code.dto.CodeDto;
import com.dev101.coa.domain.code.entity.Code;
import com.dev101.coa.domain.member.entity.Member;
import com.dev101.coa.domain.member.entity.MemberSkill;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MemberCardDto {
    private UUID memberUuid;
    private String memberNickName;
    private String memberImg;
    private String memberIntro;
    private List<CodeDto> skillList;
    private Boolean isMine;
    private Boolean isBookmark;

    public static MemberCardDto createDto(Member member, List<MemberSkill> memberSkillList, Boolean isMine, Boolean isBookmark){

        List<CodeDto> skillList = new ArrayList<>();
        for (MemberSkill memberSkill : memberSkillList) {
            Code code = memberSkill.getSkillCode();
            skillList.add(CodeDto.builder()
                    .codeId(code.getCodeId())
                    .codeName(code.getCodeName())
                    .build());
        }

        return MemberCardDto.builder()
                .memberUuid(member.getMemberUuid())
                .memberNickName(member.getMemberNickname())
                .memberImg(member.getMemberImg())
                .memberIntro(member.getMemberIntro())
                .isMine(isMine)
                .isBookmark(isBookmark)
                .skillList(skillList)
                .build();

    }
}
