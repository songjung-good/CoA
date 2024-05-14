package com.dev101.coa.domain.member.controller;

import com.dev101.coa.domain.member.dto.*;
import com.dev101.coa.domain.member.entity.Member;
import com.dev101.coa.domain.member.entity.MemberSkill;
import com.dev101.coa.domain.member.repository.MemberRepository;
import com.dev101.coa.domain.member.repository.MemberSkillRepository;
import com.dev101.coa.domain.member.service.MemberService;
import com.dev101.coa.domain.repo.dto.MyRepoAnalysisResDto;
import com.dev101.coa.domain.repo.dto.RepoCardDto;
import com.dev101.coa.global.common.BaseResponse;
import com.dev101.coa.global.common.StatusCode;
import com.dev101.coa.global.exception.BaseException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

@RestController
@RequestMapping("/api/member")
@RequiredArgsConstructor
@Tag(name = "Member Controller", description = "멤버 및 알람 관련 API")
public class MemberController {

    private final MemberService memberService;
    private final MemberRepository memberRepository;
    private final MemberSkillRepository memberSkillRepository;

    @Operation(description = "로그인한 유저의 정보")
    @GetMapping("")
    public ResponseEntity<BaseResponse<MemberInfoDto>> getMemberInfo(@AuthenticationPrincipal Long memberId){

        MemberInfoDto memberInfoDto = memberService.getMemberInfo(memberId);

        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(memberInfoDto));
    }

    @Operation(description = "페이지 멤버 카드 정보")
    @GetMapping("/{memberUuid}")
    public ResponseEntity<BaseResponse<MemberCardDto>> getMemberCardInfo(@AuthenticationPrincipal Long memberId, @PathVariable("memberUuid") String memberUuid){
        Member currentMember = memberRepository.findByMemberId(memberId).orElseThrow(() -> new BaseException(StatusCode.MEMBER_NOT_EXIST));
        Member pageMember = memberRepository.findByMemberUuid(UUID.fromString(memberUuid)).orElseThrow(() -> new BaseException(StatusCode.MEMBER_NOT_EXIST));

        List<MemberSkill> targetMemberSkillList = memberSkillRepository.findByMember(pageMember);
        MemberCardDto memberCardDto = memberService.getMemberCardDto(currentMember, pageMember, targetMemberSkillList);

        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(memberCardDto));
    }

    @Operation(description = "멤버 정보 수정")
    @PutMapping("/edit")
    public ResponseEntity<BaseResponse<Objects>> editMemberCardInfo(
            @AuthenticationPrincipal Long memberId,
            @RequestBody MemberCardReq memberCardReq) {
        Member member = memberRepository.findByMemberId(memberId).orElseThrow(() -> new BaseException(StatusCode.MEMBER_NOT_EXIST));
        memberService.editMember(member, memberCardReq);

        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(StatusCode.SUCCESS));
    }

    @GetMapping("/alarms/count")
    @Operation(description = "로그인한 유저의 확인하지 않은 알람 개수")
    public ResponseEntity<BaseResponse<Long>> getNewAlarmCnt(@AuthenticationPrincipal Long memberId){
        Long result = memberService.getNewAlarmCnt(memberId);
        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(result));
    }

    @GetMapping("/alarms")
    @Operation(description = "로그인한 유저가 받은 알람 목록")
    public ResponseEntity<BaseResponse<List<AlarmDto>>> getAlarmList(
            @AuthenticationPrincipal Long memberId
            , @RequestParam(value = "page", defaultValue = "0") int page
            , @RequestParam(value = "size", defaultValue = "20") int size
    ){
        List<AlarmDto> result = memberService.getAlarmList(memberId, page, size);

        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(result));
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


    @GetMapping("/{memberUuid}/analysis")
    @Operation(description = "멤버 심층 분석")
    public ResponseEntity<BaseResponse<MyRepoAnalysisResDto>> getMemberAnalysis(
            @AuthenticationPrincipal Long memberId,
            @PathVariable("memberUuid") String memberUuid) {

        Member currentMember = memberRepository.findByMemberId(memberId).orElseThrow(() -> new BaseException(StatusCode.MEMBER_NOT_EXIST));
        Member pageMember = memberRepository.findByMemberUuid(UUID.fromString(memberUuid)).orElseThrow(() -> new BaseException(StatusCode.MEMBER_NOT_EXIST));
        if (currentMember != pageMember) {throw new BaseException(StatusCode.MEMBER_NOT_AUTH);}

        MyRepoAnalysisResDto myRepoAnalysisResDto = memberService.makeMemberAnalysis(pageMember);
        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(myRepoAnalysisResDto));

    }

    @GetMapping("/{memberUuid}/repos")
    @Operation(description = "멤버 레포 목록")
    public ResponseEntity<BaseResponse<List<RepoCardDto>>> getMemberRepoList(
            @PathVariable("memberUuid") String memberUuid) {
        Member pageMember = memberRepository.findByMemberUuid(UUID.fromString(memberUuid)).orElseThrow(() -> new BaseException(StatusCode.MEMBER_NOT_EXIST));

        List<RepoCardDto> repoCardDtoList = memberService.makeMemberRepos(pageMember);


        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(repoCardDtoList));
    }

    @GetMapping("/random")
    @Operation(description = "파도타기")
    public ResponseEntity<BaseResponse<UUID>> getMemberAnalysis(
            @AuthenticationPrincipal Long memberId) {
        UUID result = memberService.getMemberRandom(memberId);
        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(result));
    }

    @GetMapping("/skill-count")
    @Operation(description = "언어 별 사용자 수")
    public ResponseEntity<BaseResponse<List<MemberCntBySkillDto>>> getMemberCntBySkill(){
       List<MemberCntBySkillDto> result = memberService.getMemberCntBySkill();
        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(result));
    }
}
