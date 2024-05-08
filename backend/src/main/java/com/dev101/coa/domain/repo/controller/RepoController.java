package com.dev101.coa.domain.repo.controller;

import com.dev101.coa.domain.repo.dto.*;
import com.dev101.coa.domain.repo.service.RepoService;
import com.dev101.coa.global.common.BaseResponse;
import com.dev101.coa.global.common.StatusCode;
import com.dev101.coa.global.exception.BaseException;
import com.dev101.coa.global.security.oauth2user.CustomOAuth2User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Repo Controller", description = "Repo와 관련된 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/repos")
public class RepoController {

    private final RepoService repoService;

    @Operation(description = "리드미 수정")
    @PutMapping("/{repoViewId}")
    public ResponseEntity<BaseResponse<Object>> editReadme(@AuthenticationPrincipal Long currentMemberId, @PathVariable Long repoViewId, @RequestBody EditReadmeReqDto editReadmeReqDto) {
        repoService.editReadme(currentMemberId, repoViewId, editReadmeReqDto);
        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(StatusCode.SUCCESS));
    }

    @Operation(description = "분석 결과 저장")
    @PostMapping("/{analysisId}")
    public ResponseEntity<BaseResponse<Object>> saveAnalysis(@AuthenticationPrincipal Long currentMemberId, @PathVariable String analysisId, @RequestBody SaveAnalysisReqDto saveAnalysisReqDto) {

        repoService.saveAnalysis(currentMemberId, analysisId, saveAnalysisReqDto);
        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(StatusCode.SUCCESS));
    }

    @Operation(description = "분석 요청")
    @PostMapping("/analysis")
    public ResponseEntity<BaseResponse<String>> startAnalysis(@AuthenticationPrincipal Long currentMemberId, HttpServletRequest request, @RequestBody AnalysisReqDto analysisReqDto) {

        String analysisId = repoService.startAnalysis(currentMemberId, analysisReqDto);
        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<String>(analysisId));
    }

    @Operation(description = "분석 진척도 체크")
    @GetMapping("/analysis/{analysisId}")
    public ResponseEntity<BaseResponse<AnalysisCheckResDto>> checkAnalysis(@AuthenticationPrincipal Long currentMemberId, HttpServletRequest request, @PathVariable String analysisId) {

        AnalysisCheckResDto result = repoService.checkAnalysis(currentMemberId, analysisId);
        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(result));
    }


    @Operation(description = "완료된 분석 결과 가져오기")
    @GetMapping("/analysis/done/{analysisId}")
    public ResponseEntity<BaseResponse<RepoDetailResDto>> getDoneAnalysis(@AuthenticationPrincipal Long currentMemberId, HttpServletRequest request, @PathVariable String analysisId) {

        RepoDetailResDto result = repoService.getDoneAnalysis(currentMemberId, analysisId);
        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(result));
    }

    @Operation(description = "특정 레포 뷰 조회")
    @GetMapping("/{repoViewId}")
    public ResponseEntity<BaseResponse<RepoDetailResDto>> readRepoView(@AuthenticationPrincipal Long currentMemberId, @PathVariable("repoViewId") Long repoViewId){

        RepoDetailResDto result = repoService.readRepoView(currentMemberId, repoViewId);

        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(result));
    }


    @Operation(description = "더미데이터 주입을 위한 컨트롤러! 무시해도 됩니다!")
    @GetMapping("/test")
    public ResponseEntity<BaseResponse<Object>> test() {
        repoService.test();
        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(StatusCode.SUCCESS));
    }
}