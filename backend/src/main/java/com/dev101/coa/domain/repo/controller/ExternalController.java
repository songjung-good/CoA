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
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Scheduler;
import reactor.core.scheduler.Schedulers;

import java.util.List;
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
    private final Scheduler dbScheduler = Schedulers.boundedElastic();

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
        Member member = memberRepository.findByMemberId(currentId).orElseThrow(() -> new BaseException(StatusCode.MEMBER_NOT_EXIST));
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

        String result = externalApiService.fetchGitlabProjects(userName, accessToken);
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

    @Operation(description = "깃헙 잔디 602 -> 링크 X , 303 -> 토큰 확인(외부 에러)")
    @GetMapping("/events/github/{memberUuid}")
    public ResponseEntity<BaseResponse<Map<String, Object>>> getGitHubUserEvents(@PathVariable String memberUuid) {
        return findMemberByUuid(memberUuid)
                        .flatMap(this::findGithubAccountLink)
                        .flatMap(gitHubAccountLink -> {
                            String githubUserName = gitHubAccountLink.getAccountLinkNickname();
                            return decryptToken(gitHubAccountLink.getAccountLinkReceiveToken())
                                    .flatMap(githubAccessToken -> externalApiService.fetchGithubIssue(githubUserName, githubAccessToken));
                        })
                        .map(result -> ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(result))).block();
    }

    @Operation(description = "깃랩 잔디 602 -> 링크 X , 303 -> 토큰 확인(외부 에러)")
    @GetMapping("/events/gitlab/{memberUuid}")
    public ResponseEntity<BaseResponse<Map<String, Object>>> getGitLabUserEvents(@PathVariable String memberUuid) {
        return findMemberByUuid(memberUuid)
                        .flatMap(this::findGitLabAccountLink)
                        .flatMap(gitLabAccountLink -> {
                            String gitLabUserName = gitLabAccountLink.getAccountLinkNickname();
                            return decryptToken(gitLabAccountLink.getAccountLinkReceiveToken())
                                    .flatMap(gitLabAccessToken -> externalApiService.fetchGitLabIssue(gitLabUserName, gitLabAccessToken));
                        })
                        .map(result -> ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(result))).block();
    }

    @GetMapping("/github/{memberUuid}/lines-of-code")
    public Mono<ResponseEntity<BaseResponse<List<Map<String, Object>>>>> getGitHubUserProjects(@PathVariable String memberUuid) {
        return findMemberByUuid(memberUuid)
                .flatMap(this::findGithubAccountLink)
                .flatMap(gitHubAccountLink -> {
                    String githubUserName = gitHubAccountLink.getAccountLinkNickname();
                    return decryptToken(gitHubAccountLink.getAccountLinkReceiveToken())
                            .flatMap(githubAccessToken -> externalApiService.fetchGitHubContributions(githubUserName, githubAccessToken));
                })
                .map(result -> ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(result)));
    }


    private Mono<Member> findMemberByUuid(String memberUuid) {
        return Mono.fromCallable(() -> memberRepository.findByMemberUuid(UUID.fromString(memberUuid))
                        .orElseThrow(() -> new BaseException(StatusCode.MEMBER_NOT_EXIST)))
                .subscribeOn(dbScheduler);
    }

    private Mono<AccountLink> findGithubAccountLink(Member member) {
        return Mono.fromCallable(() -> accountLinkRepository.findByMemberAndCodeCodeId(member, 1002L)
                        .orElseThrow(() -> new BaseException(StatusCode.ACCOUNT_LINK_NOT_EXIST)))
                .subscribeOn(dbScheduler);
    }

    private Mono<AccountLink> findGitLabAccountLink(Member member) {
        return Mono.fromCallable(() -> accountLinkRepository.findByMemberAndCodeCodeId(member, 1003L)
                        .orElseThrow(() -> new BaseException(StatusCode.ACCOUNT_LINK_NOT_EXIST)))
                .subscribeOn(dbScheduler);
    }

    private Mono<String> decryptToken(String encryptedToken) {
        return Mono.fromCallable(() -> {
            try {
                return encryptionUtils.decrypt(encryptedToken);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }).subscribeOn(Schedulers.boundedElastic());
    }
}
