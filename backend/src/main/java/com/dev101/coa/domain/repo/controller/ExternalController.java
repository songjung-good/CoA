package com.dev101.coa.domain.repo.controller;


import com.dev101.coa.domain.member.entity.AccountLink;
import com.dev101.coa.domain.member.entity.Member;
import com.dev101.coa.domain.member.repository.AccountLinkRepository;
import com.dev101.coa.domain.member.repository.MemberRepository;
import com.dev101.coa.domain.repo.service.ExternalApiService;
import com.dev101.coa.global.common.BaseResponse;
import com.dev101.coa.global.common.StatusCode;
import com.dev101.coa.global.exception.BaseException;
import com.dev101.coa.global.security.service.EncryptionUtils;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.UUID;

@Tag(name = "External Controller", description = "외부 관련된 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/external")
public class ExternalController {
    private final ExternalApiService externalApiService;
    private final MemberRepository memberRepository;
    private final AccountLinkRepository accountLinkRepository;
    private final EncryptionUtils encryptionUtils;

    @GetMapping("/github/repos/{userName}")
    public ResponseEntity<BaseResponse<String>> getGithubRepos(@AuthenticationPrincipal Long currentId, @PathVariable("userName") String userName) throws Exception {
        Member member = memberRepository.findByMemberId(currentId).orElseThrow(() -> new BaseException(StatusCode.MEMBER_NOT_EXIST));
        AccountLink accountLink = accountLinkRepository.findByMemberAndCodeCodeId(member, 1002L).orElseThrow(() -> new BaseException(StatusCode.ACCOUNT_LINK_NOT_EXIST));
        String accessToken = encryptionUtils.decrypt(accountLink.getAccountLinkReceiveToken());
        String result = externalApiService.fetchGithubReposSync(userName, accessToken);

        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(result));
    }


    @GetMapping("/gitlab/repos/{userName}")
    public ResponseEntity<BaseResponse<String>> getGitlabRepos(@AuthenticationPrincipal Long currentId, @PathVariable("userName") String userName) throws Exception {
        Member member = memberRepository.findByMemberId(currentId).orElseThrow(() -> new BaseException(StatusCode.MEMBER_NOT_EXIST));
        AccountLink accountLink = accountLinkRepository.findByMemberAndCodeCodeId(member, 1003L).orElseThrow(() -> new BaseException(StatusCode.ACCOUNT_LINK_NOT_EXIST));
        String accessToken = encryptionUtils.decrypt(accountLink.getAccountLinkReceiveToken());

        String result = externalApiService.fetchGitlabRepos(userName, accessToken);

        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(result));
    }

    @GetMapping("/github/members/{userName}/{projectName}")
    public ResponseEntity<BaseResponse<String>> getGitHubMembers(@AuthenticationPrincipal Long currentId, @PathVariable("userName") String userName, @PathVariable("projectName") String projectName) throws Exception {
        Member member = memberRepository.findByMemberId(currentId).orElseThrow(()-> new BaseException(StatusCode.MEMBER_NOT_EXIST));
        AccountLink accountLink = accountLinkRepository.findByMemberAndCodeCodeId(member, 1002L).orElseThrow(() -> new BaseException(StatusCode.ACCOUNT_LINK_NOT_EXIST));
        String accessToken = encryptionUtils.decrypt(accountLink.getAccountLinkReceiveToken());

        String result = externalApiService.fetchGitHubMembers(userName, projectName, accessToken);
        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(result));
    }

    @GetMapping("/gitlab/projects/{userName}")
    public ResponseEntity<BaseResponse<String>> getGitlabUserId(@AuthenticationPrincipal Long currentId, @PathVariable("userName") String userName) throws Exception {
        Member member = memberRepository.findByMemberId(currentId).orElseThrow(() -> new BaseException(StatusCode.MEMBER_NOT_EXIST));
        AccountLink accountLink = accountLinkRepository.findByMemberAndCodeCodeId(member, 1003L).orElseThrow(() -> new BaseException(StatusCode.ACCOUNT_LINK_NOT_EXIST));
        String accessToken = encryptionUtils.decrypt(accountLink.getAccountLinkReceiveToken());

        String result = externalApiService.fetchGitlabProjects(userName,accessToken);
        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(result));
    }

    @GetMapping("/gitlab/members/{projectId}")
    public ResponseEntity<BaseResponse<String>> getGitlabMembers(@AuthenticationPrincipal Long currentId, @PathVariable("projectId") String projectId) throws Exception {
        Member member = memberRepository.findByMemberId(currentId).orElseThrow(() -> new BaseException(StatusCode.MEMBER_NOT_EXIST));
        AccountLink accountLink = accountLinkRepository.findByMemberAndCodeCodeId(member, 1003L).orElseThrow(() -> new BaseException(StatusCode.ACCOUNT_LINK_NOT_EXIST));
        String accessToken = encryptionUtils.decrypt(accountLink.getAccountLinkReceiveToken());

        String result = externalApiService.fetchGitlabMembers(projectId, accessToken);
        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(result));
    }

    @GetMapping("/gitlab/events/{memberUuid}")
    public ResponseEntity<BaseResponse<Map<String, Object>>> getUserEvents(@PathVariable String memberUuid) throws Exception {
        Member member = memberRepository.findByMemberUuid(UUID.fromString(memberUuid)).orElseThrow(() -> new BaseException(StatusCode.MEMBER_NOT_EXIST));
        AccountLink accountLink = accountLinkRepository.findByMemberAndCodeCodeId(member, 1003L).orElseThrow(() -> new BaseException(StatusCode.ACCOUNT_LINK_NOT_EXIST));

        String userName = accountLink.getAccountLinkNickname();
        String accessToken = encryptionUtils.decrypt(accountLink.getAccountLinkReceiveToken());
        externalApiService.processUserEvents(userName, accessToken);
        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(StatusCode.SUCCESS));
    }

}
