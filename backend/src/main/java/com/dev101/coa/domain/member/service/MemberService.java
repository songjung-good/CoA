package com.dev101.coa.domain.member.service;

import com.dev101.coa.domain.member.dto.AccountLinkInfoDto;
import com.dev101.coa.domain.member.dto.AlarmDto;
import com.dev101.coa.domain.member.dto.MemberInfoDto;
import com.dev101.coa.domain.member.entity.AccountLink;
import com.dev101.coa.domain.member.entity.Alarm;
import com.dev101.coa.domain.member.entity.Member;
import com.dev101.coa.domain.member.repository.AccountLinkRepository;
import com.dev101.coa.domain.member.repository.AlarmRepository;
import com.dev101.coa.domain.member.repository.MemberRepository;
import com.dev101.coa.global.common.StatusCode;
import com.dev101.coa.global.exception.BaseException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final AlarmRepository alarmRepository;
    private final MemberRepository memberRepository;
    private final AccountLinkRepository accountLinkRepository;


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

        Member targetMember = memberRepository.findById(memberId).orElseThrow(()->new BaseException(StatusCode.MEMBER_NOT_EXIST));

        List<Alarm> alarmList = alarmRepository.findByAlarmTargetIdOrderByCreatedAtDesc(memberId);

        List<AlarmDto> alarmDtoList = new ArrayList<>();
        for(Alarm alarm : alarmList){
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

}
