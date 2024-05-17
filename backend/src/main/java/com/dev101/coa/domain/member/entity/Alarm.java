package com.dev101.coa.domain.member.entity;

import com.dev101.coa.domain.member.dto.AlarmDto;
import com.dev101.coa.domain.repo.entity.RepoView;
import com.dev101.coa.global.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "alarm")
public class Alarm extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "alarm_id")
    private Long alarmId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member alarmMember;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "repo_view_id", nullable = true)
    private RepoView alarmRepoView;

    @Column(name = "alarm_target_id", nullable = false)
    private Long alarmTargetId;

    public AlarmDto convertToDto(){
        return AlarmDto.builder()
                .memberUuid(this.alarmMember.getMemberUuid())
                .memberNickName(this.alarmMember.getMemberNickname())
                .createAt(LocalDateTime.now())
                .build();
    }
}