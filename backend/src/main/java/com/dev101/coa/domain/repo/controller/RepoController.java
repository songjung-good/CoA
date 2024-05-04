package com.dev101.coa.domain.repo.controller;

import com.dev101.coa.domain.repo.dto.*;
import com.dev101.coa.domain.repo.service.RepoService;
import com.dev101.coa.global.common.BaseResponse;
import com.dev101.coa.global.common.StatusCode;
import com.dev101.coa.global.exception.BaseException;
import com.dev101.coa.global.security.CustomOAuth2User;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

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

    @PostMapping("/{analysisId}")
    public ResponseEntity<BaseResponse<Object>> saveAnalysis(@PathVariable String analysisId, @RequestBody SaveAnalysisReqDto saveAnalysisReqDto) {

        Long memberId = 7L;
        repoService.saveAnalysis(memberId, analysisId, saveAnalysisReqDto);
        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(StatusCode.SUCCESS));
    }

    @PostMapping("/analysis")
    public ResponseEntity<BaseResponse<String>> startAnalysis(@AuthenticationPrincipal CustomOAuth2User currentUser, HttpServletRequest request, @RequestBody AnalysisReqDto analysisReqDto) {
        // TODO: Test login member
        System.out.println("currentUser = " + currentUser.getMember().getMemberId());

        // TODO: memberId를 쿠키로부터 가져오기
        Long memberId = 0L;

        String analysisId = repoService.startAnalysis(memberId, analysisReqDto);
        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<String>(analysisId));
    }


    @GetMapping("/analysis/{analysisId}")
    public ResponseEntity<BaseResponse<Object>> checkAnalysis(HttpServletRequest request, @PathVariable String analysisId) {
        String memberUUID = null;

        // TODO: memberId를 쿠키로부터 가져오기
        Long memberId = 7L;

        AnalysisResultDto result = repoService.checkAnalysis(memberId, analysisId);
        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(result));
    }

    @GetMapping("/{repoViewId}")
    public ResponseEntity<BaseResponse<Object>> readRepoView(@PathVariable Long repoViewId){
        // TODO: 로그인 유저 아이디 가져오기
        Long memberId = 0L;
        RepoDetailResDto result = repoService.readRepoView(memberId, repoViewId);

        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(result));
    }


    @GetMapping("/test")
    public ResponseEntity<BaseResponse<String>> test() {
        repoService.test();
        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(StatusCode.SUCCESS));
    }
}