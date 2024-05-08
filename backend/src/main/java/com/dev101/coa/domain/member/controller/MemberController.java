package com.dev101.coa.domain.member.controller;

import com.dev101.coa.domain.member.dto.AlarmDto;
import com.dev101.coa.domain.member.service.MemberService;
import com.dev101.coa.global.common.BaseResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/member")
@RequiredArgsConstructor
@Tag(name = "Member Controller", description = "멤버 및 알람 관련 API")
public class MemberController {

    private final MemberService memberService;

    @GetMapping("/alarms")
    @Operation(description = "로그인한 유저가 받은 알람 목록")
    public ResponseEntity<BaseResponse<List<AlarmDto>>> getAlarmList(@AuthenticationPrincipal Long memberId){
        List<AlarmDto> result = memberService.getAlarmList(memberId);

        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<List<AlarmDto>>(result));
    }

    @GetMapping("/alarms/count")
    @Operation(description = "로그인한 유저의 확인하지 않은 알람 개수")
    public ResponseEntity<BaseResponse<Long>> getNewAlarmCnt(@AuthenticationPrincipal Long memberId){
        Long result = memberService.getNewAlarmCnt(memberId);
        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(result));
    }
}
