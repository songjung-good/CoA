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
    public ResponseEntity<BaseResponse<Object>> editReadme(@PathVariable Long repoViewId, @RequestBody EditReadmeReqDto editReadmeReqDto) {
        repoService.editReadme(repoViewId, editReadmeReqDto);
        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(StatusCode.SUCCESS));
    }

    @Operation(description = "분석 결과 저장")
    @PostMapping("/{analysisId}")
    public ResponseEntity<BaseResponse<Object>> saveAnalysis(@PathVariable String analysisId, @RequestBody SaveAnalysisReqDto saveAnalysisReqDto) {

        Long memberId = 7L;
        repoService.saveAnalysis(memberId, analysisId, saveAnalysisReqDto);
        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(StatusCode.SUCCESS));
    }

    @Operation(description = "분석 요청")
    @PostMapping("/analysis")
    public ResponseEntity<BaseResponse<String>> startAnalysis(@AuthenticationPrincipal CustomOAuth2User currentUser, HttpServletRequest request, @RequestBody AnalysisReqDto analysisReqDto) {
        // TODO: Test login member
        System.out.println("currentUser = " + currentUser.getMember().getMemberId());

        // TODO: memberId를 쿠키로부터 가져오기
        Long memberId = 0L;

        String analysisId = repoService.startAnalysis(memberId, analysisReqDto);
        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<String>(analysisId));
    }


    @Operation(description = "분석 진척도 체크")
    @GetMapping("/analysis/{analysisId}")
    public ResponseEntity<BaseResponse<AnalysisResultDto>> checkAnalysis(HttpServletRequest request, @PathVariable String analysisId) {
        String memberUUID = null;

        // TODO: memberId를 쿠키로부터 가져오기
        Long memberId = 7L;

        AnalysisResultDto result = repoService.checkAnalysis(memberId, analysisId);
        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(result));
    }

    @Operation(description = "특정 레포 뷰 조회")
    @GetMapping("/{repoViewId}")
    public ResponseEntity<BaseResponse<RepoDetailResDto>> readRepoView(@PathVariable Long repoViewId){
        // TODO: 로그인 유저 아이디 가져오기
        Long memberId = 0L;
        RepoDetailResDto result = repoService.readRepoView(memberId, repoViewId);

        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(result));
    }


    @Operation(description = "더미데이터 주입을 위한 컨트롤러! 무시해도 됩니다!")
    @GetMapping("/test")
    public ResponseEntity<BaseResponse<Object>> test() {
        repoService.test();
        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(StatusCode.SUCCESS));
    }
}