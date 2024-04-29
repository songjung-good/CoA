package com.dev101.coa.domain.repo.controller;

import com.dev101.coa.domain.repo.dto.AnalysisReqDto;
import com.dev101.coa.domain.repo.dto.EditReadmeReqDto;
import com.dev101.coa.domain.repo.service.RepoService;
import com.dev101.coa.global.common.BaseResponse;
import com.dev101.coa.global.common.StatusCode;
import com.dev101.coa.global.exception.BaseException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
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

    @PostMapping("/{analysisId}")
    public ResponseEntity<BaseResponse<Object>> saveAnalysis(@PathVariable Long analysisId){

        repoService.saveAnalysis(analysisId);
        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(StatusCode.SUCCESS));
    }

    @PostMapping("/analysis")
    public ResponseEntity<BaseResponse<String>> startAnalysis(HttpServletRequest request, @RequestBody AnalysisReqDto analysisReqDto){
        Cookie[] cookies = request.getCookies();
        Cookie cookie = null;
        if(cookies != null){
            for(Cookie c : cookies){
                if("JWT".equals(c.getName())){
                    cookie = c;
                    break;
                }
            }
        }
        if(cookie == null) throw new BaseException(StatusCode.COOKIE_NOT_FOUND);

        // TODO: memberId를 쿠키로부터 가져오기
        Long memberId = 0L;

        String analysisId = repoService.startAnalysis(memberId, analysisReqDto);
        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<String>(analysisId));
    }
}