package com.dev101.coa.domain.member.service;

import com.dev101.coa.domain.member.dto.AlarmDto;
import com.dev101.coa.domain.member.entity.Alarm;
import com.dev101.coa.domain.member.entity.Member;
import com.dev101.coa.domain.member.repository.AlarmRepository;
import com.dev101.coa.domain.member.repository.MemberRepository;
import com.dev101.coa.global.common.StatusCode;
import com.dev101.coa.global.exception.BaseException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final AlarmRepository alarmRepository;
    private final MemberRepository memberRepository;
    public List<AlarmDto> getAlarmList(Long memberId) {
        
        Member targetMember = memberRepository.findById(memberId).orElseThrow(()->new BaseException(StatusCode.MEMBER_NOT_EXIST));

        List<Alarm> alarmList = alarmRepository.findByAlarmTargetIdOrderByCreatedAtDesc(memberId);

        List<AlarmDto> alarmDtoList = new ArrayList<>();
        for(Alarm alarm : alarmList){
            alarmDtoList.add(alarm.convertToDto());
        }

        return alarmDtoList;

    }
}
