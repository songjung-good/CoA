package com.dev101.coa.domain.member.controller;

import com.dev101.coa.domain.member.dto.AlarmDto;
import com.dev101.coa.domain.member.dto.BookmarkResDto;
import com.dev101.coa.domain.member.dto.MemberCardDto;
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
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/alarms/count")
    @Operation(description = "로그인한 유저의 확인하지 않은 알람 개수")
    public ResponseEntity<BaseResponse<Long>> getNewAlarmCnt(@AuthenticationPrincipal Long memberId){
        Long result = memberService.getNewAlarmCnt(memberId);
        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(result));
    }

    @GetMapping("/alarms")
    @Operation(description = "로그인한 유저가 받은 알람 목록")
    public ResponseEntity<BaseResponse<List<AlarmDto>>> getAlarmList(@AuthenticationPrincipal Long memberId){
        List<AlarmDto> result = memberService.getAlarmList(memberId);

        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<List<AlarmDto>>(result));
    }

    @PostMapping("/bookmarks/{targetMemberUuid}")
    @Operation(description = "북마크 토글 기능, 북마크 생성시 알람도 함꼐 저장")
    public ResponseEntity<BaseResponse<BookmarkResDto>> toggleBookmark(@AuthenticationPrincipal Long  loginMemberId, @PathVariable("targetMemberUuid") String targetMemberUuid){
        BookmarkResDto result = memberService.toggleBookmark(loginMemberId, targetMemberUuid);
        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(result));
    }

    @GetMapping("/bookmarks")
    @Operation(description = "로그인 한 유저의 북마크 목록 조회")
    public ResponseEntity<BaseResponse<List<MemberCardDto>>> getBookmarkList(@AuthenticationPrincipal Long  loginMemberId){
        List<MemberCardDto> result = memberService.getBookmarkList(loginMemberId);
        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(result));
    }


}
