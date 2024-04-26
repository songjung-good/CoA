package com.dev101.coa.domain.repo.controller;

import com.dev101.coa.domain.repo.dto.EditReadmeReqDto;
import com.dev101.coa.domain.repo.service.RepoService;
import com.dev101.coa.global.common.BaseResponse;
import com.dev101.coa.global.common.StatusCode;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/repos")
public class RepoController {

    private final RepoService repoService;

    @PutMapping("/{repoViewId}")
    public ResponseEntity<BaseResponse<Object>> editReadme(@PathVariable Long repoViewId, @RequestBody EditReadmeReqDto editReadmeReqDto) {
        repoService.editReadme(repoViewId, editReadmeReqDto);
        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(StatusCode.SUCCESS));
    }

    @PostMapping("/{repoViewId}")
    public ResponseEntity<BaseResponse<Object>> saveAnalysis(@PathVariable Long repoViewId, @RequestBody Long analysisId){

        repoService.saveAnalysis(repoViewId, analysisId);
        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(StatusCode.SUCCESS));
    }
}