package com.dev101.coa.domain.search.dto;

import com.dev101.coa.domain.member.dto.MemberCardDto;
import com.dev101.coa.domain.repo.dto.RepoCardDto;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class MemberResultResDto {
    private boolean isNext;
    List<MemberCardDto> memberCardDtoList;
}
