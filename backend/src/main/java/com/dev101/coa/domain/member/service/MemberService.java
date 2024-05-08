package com.dev101.coa.domain.member.service;

import com.dev101.coa.domain.member.dto.AlarmDto;
import com.dev101.coa.domain.member.dto.BookmarkResDto;
import com.dev101.coa.domain.member.dto.MemberInfoDto;
import com.dev101.coa.domain.member.entity.AccountLink;
import com.dev101.coa.domain.member.entity.Alarm;
import com.dev101.coa.domain.member.entity.Bookmark;
import com.dev101.coa.domain.member.entity.Member;
import com.dev101.coa.domain.member.repository.AccountLinkRepository;
import com.dev101.coa.domain.member.repository.AlarmRepository;
import com.dev101.coa.domain.member.repository.BookmarkRepository;
import com.dev101.coa.domain.member.repository.MemberRepository;
import com.dev101.coa.global.common.StatusCode;
import com.dev101.coa.global.exception.BaseException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final AlarmRepository alarmRepository;
    private final MemberRepository memberRepository;
    private final AccountLinkRepository accountLinkRepository;
    private final BookmarkRepository bookmarkRepository;


    public MemberInfoDto getMemberInfo(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        List<AccountLink> accountLinks = accountLinkRepository.findAllByMember(member);

        MemberInfoDto.MemberInfoDtoBuilder builder = MemberInfoDto.builder()
                .memberId(member.getMemberId())
                .memberImg(member.getMemberImg())
                .memberNickName(member.getMemberNickname());

        for (AccountLink link : accountLinks) {
            switch (link.getCode().getCodeName()) {
                case "Github":
                    builder.githubNickName(link.getAccountLinkNickname());
                    break;
                case "GitLab":
                    builder.gitlabNickName(link.getAccountLinkNickname());
                    break;
                case "solvedac":
                    builder.solvedNickName(link.getAccountLinkNickname());
                    break;
                case "Codeforces":
                    builder.codeforcesNickName(link.getAccountLinkNickname());
                    break;
            }
        }
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

    public BookmarkResDto toggleBookmark(Long loginMemberId, String targetMemberUuid) {
        // 멤버 존재 유무
        Member loginMember = memberRepository.findById(loginMemberId).orElseThrow(() -> new BaseException(StatusCode.MEMBER_NOT_EXIST));
        Member targetMember = memberRepository.findByMemberUuid(UUID.fromString(targetMemberUuid)).orElseThrow(() -> new BaseException(StatusCode.MEMBER_NOT_EXIST));

        // 북마크 존재 유무 확인
        Optional<Bookmark> optionalBookmark = bookmarkRepository.findByBookmarkMemberAndAndBookmarkTargetMember(loginMember, targetMember);

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
}
