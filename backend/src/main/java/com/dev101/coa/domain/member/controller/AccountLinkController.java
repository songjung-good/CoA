package com.dev101.coa.domain.member.controller;

import com.dev101.coa.domain.code.entity.Code;
import com.dev101.coa.domain.code.repository.CodeRepository;
import com.dev101.coa.domain.member.dto.AccountLinkInfoDto;
import com.dev101.coa.domain.member.dto.NickNameDto;
import com.dev101.coa.domain.member.entity.AccountLink;
import com.dev101.coa.domain.member.entity.Member;
import com.dev101.coa.domain.member.repository.AccountLinkRepository;
import com.dev101.coa.domain.member.repository.MemberRepository;
import com.dev101.coa.domain.member.service.MemberService;
import com.dev101.coa.global.common.BaseResponse;
import com.dev101.coa.global.common.StatusCode;
import com.dev101.coa.global.exception.BaseException;
import com.dev101.coa.global.security.service.EncryptionUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/accountLink")
@RequiredArgsConstructor
@Tag(name = "AccountLink Controller", description = "AccountLink 관련 API")
public class AccountLinkController {


    private final MemberRepository memberRepository;
    private final CodeRepository codeRepository;
    private final AccountLinkRepository accountLinkRepository;
    private final EncryptionUtils encryptionUtils;
    private final MemberService memberService;

    @Operation(description = "연결 페이지 정보")
    @GetMapping("")
    public ResponseEntity<BaseResponse<AccountLinkInfoDto>> getAccountLinkInfo(@AuthenticationPrincipal Long memberId) {
        Member member = memberRepository.findByMemberId(memberId).orElseThrow(() -> new BaseException(StatusCode.MEMBER_NOT_EXIST));
        List<AccountLink> accountLinks = accountLinkRepository.findAllByMember(member);

        AccountLinkInfoDto dto = accountLinks.stream()
                .collect(Collectors.collectingAndThen(
                        Collectors.toList(),
                        memberService::aggregateLinksIntoDto));

        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(dto));
    }

    @Operation(description = "멤버 SolvedAc 닉네임 저장")
    @PostMapping("/solvedac")
    public ResponseEntity<BaseResponse<String>> saveNickNameSolved(@AuthenticationPrincipal Long memberId, @RequestBody NickNameDto nickNameDto) {
        Member member = memberRepository.findByMemberId(memberId).orElseThrow(() -> new BaseException(StatusCode.MEMBER_NOT_EXIST));
        Code code = codeRepository.findByCodeId(1004L).orElseThrow(() -> new BaseException(StatusCode.CODE_NOT_FOUND));
        String nickName = nickNameDto.getNickName();

        saveAccountLinkNickName(nickName, member, code);

        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(nickName));
    }

    @Operation(description = "멤버 Codeforces 닉네임 저장")
    @PostMapping("/codeforces")
    public ResponseEntity<BaseResponse<String>> saveNickNameCodeforces(@AuthenticationPrincipal Long memberId, @RequestBody NickNameDto nickNameDto) {
        Member member = memberRepository.findByMemberId(memberId).orElseThrow(() -> new BaseException(StatusCode.MEMBER_NOT_EXIST));
        Code code = codeRepository.findByCodeId(1005L).orElseThrow(() -> new BaseException(StatusCode.CODE_NOT_FOUND));
        String nickName = nickNameDto.getNickName();

        saveAccountLinkNickName(nickName, member, code);

        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(nickName));
    }

    private void saveAccountLinkNickName(String nickName, Member member, Code code) {
        Optional<AccountLink> existingAccountLink = accountLinkRepository.findByMemberAndCode(member, code);
        AccountLink accountLink;
        if (existingAccountLink.isPresent()) {
            accountLink = existingAccountLink.get();
            accountLink.updateNickName(nickName);
        } else {
            accountLink = AccountLink.builder()
                    .member(member)
                    .code(code)
                    .accountLinkNickname(nickName)
                    .build();
        }
        accountLinkRepository.save(accountLink);
    }

    @Operation(description = "멤버 Github 토큰 저장")
    @PostMapping("/github")
    public ResponseEntity<BaseResponse<Object>> saveAccessTokenGithub(@AuthenticationPrincipal Long memberId, @RequestHeader("Access-Token") String receiveToken) throws Exception {
        Member member = memberRepository.findByMemberId(memberId).orElseThrow(() -> new BaseException(StatusCode.MEMBER_NOT_EXIST));
        getHttpHeaders(1002L, receiveToken, member);

        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(StatusCode.SUCCESS));
    }

    @Operation(description = "멤버 GitLab 토큰 저장")
    @PostMapping("/gitlab")
    public ResponseEntity<BaseResponse<Object>> saveAccessTokenGitLab(@AuthenticationPrincipal Long memberId, @RequestHeader("Access-Token") String receiveToken) throws Exception {

        Member member = memberRepository.findByMemberId(memberId).orElseThrow(() -> new BaseException(StatusCode.MEMBER_NOT_EXIST));
        getHttpHeaders(1003L, receiveToken, member);

        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(StatusCode.SUCCESS));
    }

    private void getHttpHeaders(long codeId, String receiveToken, Member member) throws Exception {
        Code platCode = codeRepository.findByCodeId(codeId).orElseThrow(() -> new BaseException(StatusCode.CODE_NOT_FOUND));
        // 멤버, 코드로 AccountLink 찾기
        AccountLink accountLink = accountLinkRepository.findByMemberAndCode(member, platCode).orElseThrow(() -> new BaseException(StatusCode.ACCOUNT_LINK_NOT_EXIST));

        saveAccountLink(receiveToken, accountLink);
        return;
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
