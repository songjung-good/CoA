package com.dev101.coa.domain.member.entity;

import com.dev101.coa.domain.code.entity.Code;
import com.dev101.coa.global.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "member")
public class Member extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_id")
    private Long memberId;

    @Column(name = "member_email", nullable = false, length = 32)
    private String memberEmail;

    @Column(name = "member_nickname", nullable = false, length = 16)
    private String memberNickname;

    @Column(name = "member_last_visit_check")
    private LocalDateTime memberLastVisitCheck;

    @Column(name = "member_intro", length = 255)
    private String memberIntro;

    @Column(name = "member_uuid", nullable = false)
    private UUID memberUuid;

    @ManyToOne
    @JoinColumn(name = "code_id", nullable = false)
    private Code memberPlatformCode;

    public void updateMemberNickname (String memberNickname) {
        this.memberNickname = memberNickname;
    }
}