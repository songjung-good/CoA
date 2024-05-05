package com.dev101.coa.domain.search.controller;

import com.dev101.coa.domain.repo.dto.RepoCardDto;
import com.dev101.coa.domain.search.service.SearchService;
import com.dev101.coa.global.common.BaseResponse;
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

    @GetMapping("/repos")
    public ResponseEntity<BaseResponse<List<RepoCardDto>>> searchRepoView(@RequestParam String keyword){
        List<RepoCardDto> result = searchService.searchRepoView(keyword);

        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(result));
    }

}
