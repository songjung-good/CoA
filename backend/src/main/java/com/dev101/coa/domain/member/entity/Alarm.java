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

    @ManyToOne
    @JoinColumn(name = "member_id", nullable = false)
    private Member alarmMember;

    @ManyToOne
    @JoinColumn(name = "repo_view_id", nullable = false)
    private RepoView alarmRepoView;

    @Column(name = "alarm_target_id", nullable = false)
    private Long alarmTargetId;

    public AlarmDto convertToDto(){
        return AlarmDto.builder()
                .memberId(this.alarmMember.getMemberId())
                .memberNickName(this.alarmMember.getMemberNickname())
                .repoViewId(this.alarmRepoView.getRepoViewId())
                .repoViewTitle(this.alarmRepoView.getRepoViewTitle())
                .createAt(LocalDateTime.now())
                .build();
    }
}