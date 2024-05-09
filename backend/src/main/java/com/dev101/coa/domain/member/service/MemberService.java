package com.dev101.coa.domain.member.service;

import com.dev101.coa.domain.code.entity.Code;
import com.dev101.coa.domain.code.repository.CodeRepository;
import com.dev101.coa.domain.member.dto.*;
import com.dev101.coa.domain.member.entity.*;
import com.dev101.coa.domain.member.repository.*;
import com.dev101.coa.global.common.StatusCode;
import com.dev101.coa.global.exception.BaseException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final AlarmRepository alarmRepository;
    private final MemberRepository memberRepository;
    private final AccountLinkRepository accountLinkRepository;
    private final BookmarkRepository bookmarkRepository;
    private final MemberSkillRepository memberSkillRepository;
    private final CodeRepository codeRepository;


    public MemberInfoDto getMemberInfo(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        List<AccountLink> accountLinks = accountLinkRepository.findAllByMember(member);

        MemberInfoDto.MemberInfoDtoBuilder builder = MemberInfoDto.builder()
                .memberUuid(member.getMemberUuid())
                .memberImg(member.getMemberImg())
                .memberNickName(member.getMemberNickname());

        AccountLinkInfoDto accountLinkInfoDto = accountLinks.stream()
                .collect(Collectors.collectingAndThen(Collectors.toList(), this::aggregateLinksIntoDto));

        builder.accountLinkInfoDto(accountLinkInfoDto);

        return builder.build();
    }

    public List<AlarmDto> getAlarmList(Long memberId) {

        Member targetMember = memberRepository.findById(memberId).orElseThrow(() -> new BaseException(StatusCode.MEMBER_NOT_EXIST));

        List<Alarm> alarmList = alarmRepository.findByAlarmTargetIdOrderByCreatedAtDesc(memberId);

        List<AlarmDto> alarmDtoList = new ArrayList<>();
        for (Alarm alarm : alarmList) {
            alarmDtoList.add(alarm.convertToDto());
        }

        targetMember.updateMemberLastVisitCheck(LocalDateTime.now());

        return alarmDtoList;

    }

    public Long getNewAlarmCnt(Long memberId) {
        Member targetMember = memberRepository.findById(memberId).orElseThrow(() -> new BaseException(StatusCode.MEMBER_NOT_EXIST));

        LocalDateTime checkedTime = targetMember.getMemberLastVisitCheck();

        return alarmRepository.countAllByAlarmTargetIdAndCreatedAtGreaterThan(memberId, checkedTime);
    }

    public AccountLinkInfoDto aggregateLinksIntoDto(List<AccountLink> links) {
        AccountLinkInfoDto.AccountLinkInfoDtoBuilder dtoBuilder = AccountLinkInfoDto.builder();
        for (AccountLink link : links) {
            switch (link.getCode().getCodeName()) {
                case "Github":
                    dtoBuilder.githubNickName(link.getAccountLinkNickname())
                            .isGithubToken(link.getAccountLinkReceiveToken() != null);
                    break;
                case "GitLab":
                    dtoBuilder.gitlabNickName(link.getAccountLinkNickname())
                            .isGitlabToken(link.getAccountLinkReceiveToken() != null);
                    break;
                case "solvedac":
                    dtoBuilder.solvedacNickName(link.getAccountLinkNickname());
                    break;
                case "Codeforces":
                    dtoBuilder.codeforcesNickName(link.getAccountLinkNickname());
                    break;
            }
        }
        return dtoBuilder.build();
    }

    public BookmarkResDto toggleBookmark(Long loginMemberId, String targetMemberUuid) {
        // 멤버 존재 유무
        Member loginMember = memberRepository.findById(loginMemberId).orElseThrow(() -> new BaseException(StatusCode.MEMBER_NOT_EXIST));
        Member targetMember = memberRepository.findByMemberUuid(UUID.fromString(targetMemberUuid)).orElseThrow(() -> new BaseException(StatusCode.MEMBER_NOT_EXIST));

        // 북마크 존재 유무 확인
        Optional<Bookmark> optionalBookmark = bookmarkRepository.findByBookmarkMemberAndBookmarkTargetMember(loginMember, targetMember);

        if (optionalBookmark.isPresent()) {
            // 북마크 삭제
            bookmarkRepository.delete(optionalBookmark.get());
            return BookmarkResDto.builder()
                    .currentStatus(false)
                    .build();
        }
        // 북마크 저장 또는 삭제
        else {
            // 북마크 저장
            bookmarkRepository.save(Bookmark.builder()
                    .bookmarkMember(loginMember)
                    .bookmarkTargetMember(targetMember)
                    .build());
            // 알람 저장
            alarmRepository.save(Alarm.builder()
                    .alarmMember(loginMember)
                    .alarmTargetId(targetMember.getMemberId())
                    .build());

            return BookmarkResDto.builder()
                    .currentStatus(true)
                    .build();

        }
    }

    public List<MemberCardDto> getBookmarkList(Long loginMemberId) {
        // 로그인 멤버 찾기
        Member loginMember = memberRepository.findById(loginMemberId).orElseThrow(()->new BaseException(StatusCode.MEMBER_NOT_EXIST));

        // 북마크 목록 가져오기
        List<Bookmark> bookmarkList = bookmarkRepository.findByBookmarkMember(loginMember);

        // MemberCardDto로 바꾸기
        List<MemberCardDto> memberCardDtoList = new ArrayList<>();
        for(Bookmark bookmark : bookmarkList){
            Member targetMember = bookmark.getBookmarkTargetMember();
            List<MemberSkill> targetMemberSkillList = memberSkillRepository.findByMember(targetMember);
            memberCardDtoList.add(getMemberCardDto(loginMember, targetMember, targetMemberSkillList));
        }
        return memberCardDtoList;
    }

    public MemberCardDto getMemberCardDto(
            Member currentMember,
            Member targetMember,
            List<MemberSkill> targetMemberSkillList) {
        Boolean isMine = (currentMember == targetMember);
        Boolean isBookmark = bookmarkRepository.findByBookmarkMemberAndBookmarkTargetMember(currentMember, targetMember).isPresent();
        return MemberCardDto.createDto(currentMember, targetMemberSkillList, isMine, isBookmark);
    }

    public void editMemberCard(Member member, MemberCardReq memberCardReq) {
        List<MemberSkill> currentSkillList = memberSkillRepository.findAllByMember(member);
        List<Long> skillIdList = currentSkillList.stream()
                .map(MemberSkill::getMemberSkillId)
                .toList();
        skillIdList.forEach(memberSkillRepository::deleteById);

        member.updateMemberIntro(memberCardReq.getIntroduce());

        memberCardReq.getSkillIdList().forEach((codeId) -> {
            Code code = codeRepository.findByCodeId(codeId).orElseThrow(() -> new BaseException(StatusCode.CODE_NOT_FOUND));
            MemberSkill memberSkill = MemberSkill.builder()
                    .member(member)
                    .skillCode(code)
                    .build();
            memberSkillRepository.save(memberSkill);
        });
        return;
    }
}
