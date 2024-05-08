package com.dev101.coa.domain.member.controller;

import com.dev101.coa.domain.member.dto.AlarmDto;
import com.dev101.coa.domain.member.service.MemberService;
import com.dev101.coa.global.common.BaseResponse;
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
public class MemberController {

    private final MemberService memberService;

    @GetMapping("/alarms")
    public ResponseEntity<BaseResponse<List<AlarmDto>>> getAlarmList(@AuthenticationPrincipal Long memberId){
        List<AlarmDto> result = memberService.getAlarmList(memberId);

        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<List<AlarmDto>>(result));
    }
}
