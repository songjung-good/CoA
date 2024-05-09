package com.dev101.coa.domain.search.controller;

import com.dev101.coa.domain.member.dto.MemberCardDto;
import com.dev101.coa.domain.repo.dto.RepoCardDto;
import com.dev101.coa.domain.search.service.SearchService;
import com.dev101.coa.global.common.BaseResponse;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    @Operation(description = "레포 URL로 레포 검색")
    @GetMapping("/repos")
    public ResponseEntity<BaseResponse<List<RepoCardDto>>> searchRepoView(
            @RequestParam("keyword") String keyword
            , @RequestParam(value = "page", defaultValue = "0") int page
            , @RequestParam(value = "size", defaultValue = "20") int size) {
        List<RepoCardDto> result = searchService.searchRepoView(keyword, page, size);

        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(result));
    }

    @Operation(description = "키워드로 멤버 검색(범위: CoA 멤버 닉네임 + 연동된 계정 닉네임")
    @GetMapping("/members")
    public ResponseEntity<BaseResponse<List<MemberCardDto>>> searchMember(
            @RequestParam(value = "keyword") String keyword
            , @RequestParam(value = "page", defaultValue = "0") int page
            , @RequestParam(value = "size", defaultValue = "20") int size) {
        List<MemberCardDto> result = searchService.searchMember(keyword, page, size);

        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(result));
    }

}
