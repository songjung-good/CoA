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
import reactor.core.publisher.Mono;

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

//    @GetMapping("/events/{memberUuid}")
//    public ResponseEntity<BaseResponse<Map<String, Object>>> getUserEvents(@PathVariable String memberUuid) throws Exception {
//        Member member = memberRepository.findByMemberUuid(UUID.fromString(memberUuid)).orElseThrow(() -> new BaseException(StatusCode.MEMBER_NOT_EXIST));
//        AccountLink gitLabAccountLink = accountLinkRepository.findByMemberAndCodeCodeId(member, 1003L).orElseThrow(() -> new BaseException(StatusCode.ACCOUNT_LINK_NOT_EXIST));
//        AccountLink githubAccountLink = accountLinkRepository.findByMemberAndCodeCodeId(member, 1002L).orElseThrow(() -> new BaseException(StatusCode.ACCOUNT_LINK_NOT_EXIST));
//
//        String gitLabUserName = gitLabAccountLink.getAccountLinkNickname();
//        String gitLabAccessToken = encryptionUtils.decrypt(gitLabAccountLink.getAccountLinkReceiveToken());
//        String githubUserName = githubAccountLink.getAccountLinkNickname();
//        String githubAccessToken = encryptionUtils.decrypt(githubAccountLink.getAccountLinkReceiveToken());
//
//        Mono<Map<String, Object>> resultMono = externalApiService.processUserEvents(gitLabUserName, gitLabAccessToken, githubUserName, githubAccessToken);
//
//        // 결과를 동기적으로 받아옴
//        Map<String, Object> result = resultMono.block();
//
//        // 결과의 세부 항목을 검증
//        if (result != null) {
//            System.out.println("Total contributions: " + result.get("total"));
//        } else {
//            System.out.println("No data received or error occurred.");
//        }
//        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(result));
//    }


    @GetMapping("/events/{memberUuid}")
    public Mono<ResponseEntity<BaseResponse<Map<String, Object>>>> getUserEvents(@PathVariable String memberUuid) {
        return Mono.fromCallable(() -> {
                    Member member = memberRepository.findByMemberUuid(UUID.fromString(memberUuid)).orElseThrow(() -> new BaseException(StatusCode.MEMBER_NOT_EXIST));
                    AccountLink gitLabAccountLink = null;
                    AccountLink githubAccountLink = null;
                    gitLabAccountLink = accountLinkRepository.findByMemberAndCodeCodeId(member, 1003L).orElseThrow(() -> new BaseException(StatusCode.ACCOUNT_LINK_NOT_EXIST));
                    githubAccountLink = accountLinkRepository.findByMemberAndCodeCodeId(member, 1002L).orElseThrow(() -> new BaseException(StatusCode.ACCOUNT_LINK_NOT_EXIST));

                    return new Object[]{member, gitLabAccountLink, githubAccountLink};
                })
                .flatMap(objects -> {
                    Member member = (Member) objects[0];
                    AccountLink gitLabAccountLink = (AccountLink) objects[1];
                    AccountLink githubAccountLink = (AccountLink) objects[2];


                    String gitLabUserName = gitLabAccountLink.getAccountLinkNickname();
                    String githubUserName = githubAccountLink.getAccountLinkNickname();

                    String gitLabAccessToken = null;
                    try {
                        gitLabAccessToken = encryptionUtils.decrypt(gitLabAccountLink.getAccountLinkReceiveToken());
                    } catch (Exception e) {
                        return Mono.error(new RuntimeException(e));
                    }
                    String githubAccessToken = null;
                    try {
                        githubAccessToken = encryptionUtils.decrypt(githubAccountLink.getAccountLinkReceiveToken());
                    } catch (Exception e) {
                        return Mono.error(new RuntimeException(e));
                    }

                    return externalApiService.processUserEvents(gitLabUserName, gitLabAccessToken, githubUserName, githubAccessToken);
                })
                .map(result -> ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(result)))
                .defaultIfEmpty(ResponseEntity.status(HttpStatus.NO_CONTENT).build())
                .onErrorResume(e -> Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new BaseResponse<>(null))));
    }

}
