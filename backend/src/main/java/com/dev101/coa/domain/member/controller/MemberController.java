package com.dev101.coa.domain.member.controller;

import com.dev101.coa.domain.code.entity.Code;
import com.dev101.coa.domain.code.repository.CodeRepository;
import com.dev101.coa.domain.member.entity.AccountLink;
import com.dev101.coa.domain.member.entity.Member;
import com.dev101.coa.domain.member.repository.AccountLinkRepository;
import com.dev101.coa.domain.member.repository.MemberRepository;
import com.dev101.coa.global.common.BaseResponse;
import com.dev101.coa.global.common.StatusCode;
import com.dev101.coa.global.exception.BaseException;
import com.dev101.coa.global.security.service.EncryptionUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Member Controller", description = "Member 관련 API")
public class MemberController {


    private final MemberRepository memberRepository;
    private final CodeRepository codeRepository;
    private final AccountLinkRepository accountLinkRepository;
    private final EncryptionUtils encryptionUtils;

    @Operation(description = "멤버 Github 토큰 저장")
    @PostMapping("/accountLink/github")
    public ResponseEntity<BaseResponse<Object>> saveAccessTokenGithub(@AuthenticationPrincipal Long memberId, @RequestHeader("Access-Token") String receiveToken) {
        try {
            Member member = memberRepository.findByMemberId(memberId).orElseThrow(() -> new BaseException(StatusCode.MEMBER_NOT_EXIST));
            HttpHeaders headers = getHttpHeaders(1002L, receiveToken, member);

            return ResponseEntity.status(HttpStatus.OK).headers(headers).body(new BaseResponse<>(StatusCode.SUCCESS));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new BaseResponse<>(StatusCode.ACCOUNT_LINK_FAIL));
        }
    }

    @Operation(description = "멤버 GitLab 토큰 저장")
    @PostMapping("/accountLink/gitlab")
    public ResponseEntity<BaseResponse<Object>> saveAccessTokenGitLab(@AuthenticationPrincipal Long memberId, @RequestHeader("Access-Token") String receiveToken) {
        try {

            Member member = memberRepository.findByMemberId(memberId).orElseThrow(() -> new BaseException(StatusCode.MEMBER_NOT_EXIST));
            HttpHeaders headers = getHttpHeaders(1003L, receiveToken, member);

            return ResponseEntity.status(HttpStatus.OK).headers(headers).body(new BaseResponse<>(StatusCode.SUCCESS));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new BaseResponse<>(StatusCode.ACCOUNT_LINK_FAIL));
        }
    }

    private HttpHeaders getHttpHeaders(long codeId, String receiveToken, Member member) throws Exception {
        Code platCode = codeRepository.findByCodeId(codeId).orElseThrow(() -> new BaseException(StatusCode.CODE_NOT_FOUND));
        HttpHeaders headers = new HttpHeaders();
        headers.add("Access-Token", receiveToken);
        // 멤버, 코드로 AccountLink 찾기
        AccountLink accountLink = accountLinkRepository.findByMemberAndCode(member, platCode).orElseThrow(() -> new BaseException(StatusCode.ACCOUNT_LINK_NOT_EXIST));

        saveAccountLink(receiveToken, accountLink);
        return headers;
    }

    private void saveAccountLink(String receiveToken, AccountLink accountLink) throws Exception {
        encryptionUtils.init();
        // 외부 토큰 암호화
        String encryptedToken = encryptionUtils.encrypt(receiveToken);
        // 외부 API 토큰 업데이트
        accountLink.updateReceiveToken(encryptedToken);
        accountLinkRepository.save(accountLink);
    }
}
