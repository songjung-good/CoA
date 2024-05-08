package com.dev101.coa.domain.member.controller;

import com.dev101.coa.domain.member.dto.AlarmDto;
import com.dev101.coa.domain.member.dto.MemberInfoDto;
import com.dev101.coa.domain.member.service.MemberService;
import com.dev101.coa.global.common.BaseResponse;
import com.dev101.coa.global.common.StatusCode;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/member")
@RequiredArgsConstructor
@Tag(name = "Member Controller", description = "멤버 및 알람 관련 API")
public class MemberController {

    private final MemberService memberService;

    @Operation(description = "로그인한 유저의 정보")
    @GetMapping("")
    public ResponseEntity<BaseResponse<MemberInfoDto>> getMemberInfo(@AuthenticationPrincipal Long memberId){

        MemberInfoDto memberInfoDto = memberService.getMemberInfo(memberId);

        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(memberInfoDto));
    }

    @GetMapping("/alarms")
    @Operation(description = "로그인한 유저가 받은 알람 목록")
    public ResponseEntity<BaseResponse<List<AlarmDto>>> getAlarmList(@AuthenticationPrincipal Long memberId){
        List<AlarmDto> result = memberService.getAlarmList(memberId);

        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<List<AlarmDto>>(result));
    }


    @PostMapping("/logout")
    @Operation(description = "로그아웃")
    public ResponseEntity<BaseResponse<Objects>> logout(HttpServletRequest request, HttpServletResponse response) {
        // 쿠키에서 JWT 삭제
        Cookie jwtCookie = new Cookie("JWT", null); // 쿠키 이름을 "JWT"로 가정
        jwtCookie.setPath("/"); // 쿠키 경로 설정, 전체 경로에 대해 적용
        jwtCookie.setHttpOnly(true); // 클라이언트 사이드 스크립트에서 쿠키 접근 방지
        jwtCookie.setSecure(true); // HTTPS를 통해서만 쿠키를 전송
        jwtCookie.setMaxAge(0); // 쿠키 만료 시간을 0으로 설정하여 즉시 만료
        response.addCookie(jwtCookie); // 응답에 쿠키 추가

        return ResponseEntity.status(HttpStatus.OK)
                .header(HttpHeaders.SET_COOKIE, response.getHeader(HttpHeaders.SET_COOKIE))
                .body(new BaseResponse<>(StatusCode.SUCCESS));
    }
}
