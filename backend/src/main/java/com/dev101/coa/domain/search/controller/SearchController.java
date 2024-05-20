package com.dev101.coa.domain.search.controller;

import com.dev101.coa.domain.member.dto.MemberCardDto;
import com.dev101.coa.domain.member.entity.Member;
import com.dev101.coa.domain.member.repository.MemberRepository;
import com.dev101.coa.domain.repo.dto.RepoCardDto;
import com.dev101.coa.domain.search.dto.MemberResultResDto;
import com.dev101.coa.domain.search.dto.RepoViewResultResDto;
import com.dev101.coa.domain.search.service.SearchService;
import com.dev101.coa.global.common.BaseResponse;
import com.dev101.coa.global.common.StatusCode;
import com.dev101.coa.global.exception.BaseException;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/search")
public class SearchController {

    private final SearchService searchService;
    private final MemberRepository memberRepository;

    @Operation(description = "레포 URL로 레포 검색")
    @GetMapping("/repos")
    public ResponseEntity<BaseResponse<RepoViewResultResDto>> searchRepoView(
            @RequestParam("keyword") String keyword
            , @RequestParam(value = "page", defaultValue = "0") int page
            , @RequestParam(value = "size", defaultValue = "20") int size) {

        RepoViewResultResDto result = searchService.searchRepoView(keyword, page, size);
        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(result));
    }

    @Operation(description = "키워드로 멤버 검색(범위: CoA 멤버 닉네임 + 연동된 계정 닉네임")
    @GetMapping("/members")
    public ResponseEntity<BaseResponse<MemberResultResDto>> searchMember(
            @AuthenticationPrincipal Long memberId
            , @RequestParam(value = "keyword") String keyword
            , @RequestParam(value = "page", defaultValue = "0") int page
            , @RequestParam(value = "size", defaultValue = "20") int size) {

        Member member = memberRepository.findByMemberId(memberId).orElseThrow(() -> new BaseException(StatusCode.MEMBER_NOT_EXIST));
        MemberResultResDto result = searchService.searchMember(member, keyword, page, size);

        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(result));
    }

}
