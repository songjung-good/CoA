package com.dev101.coa.domain.member.controller;

import com.dev101.coa.domain.member.dto.AlarmDto;
import com.dev101.coa.domain.member.dto.BookmarkResDto;
import com.dev101.coa.domain.member.dto.MemberCardDto;
import com.dev101.coa.domain.member.dto.MemberInfoDto;
import com.dev101.coa.domain.member.service.MemberService;
import com.dev101.coa.global.common.BaseResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
