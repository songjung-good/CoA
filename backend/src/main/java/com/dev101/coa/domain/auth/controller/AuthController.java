package com.dev101.coa.domain.auth.controller;

import com.dev101.coa.global.common.BaseResponse;
import com.dev101.coa.global.common.StatusCode;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Objects;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Auth Controller", description = "Auth 및 알람 관련 API")
public class AuthController {



    @PostMapping("/logout")
    @Operation(description = "로그아웃")
    public ResponseEntity<BaseResponse<Objects>> logout(HttpServletResponse response) {
        // 쿠키에서 JWT 삭제
        Cookie jwtCookie = new Cookie("JWT", null); // 쿠키 이름을 "JWT"로 가정
        jwtCookie.setHttpOnly(true); // 클라이언트 사이드 스크립트에서 쿠키 접근 방지
        jwtCookie.setSecure(true); // HTTPS를 통해서만 쿠키를 전송
        jwtCookie.setPath("/"); // 쿠키 경로 설정, 전체 경로에 대해 적용
        jwtCookie.setMaxAge(0); // 쿠키 만료 시간을 0으로 설정하여 즉시 만료
        response.addCookie(jwtCookie); // 응답에 쿠키 추가

        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(StatusCode.SUCCESS));
    }
}
