package com.dev101.coa.domain.member.entity;

import com.dev101.coa.domain.code.entity.Code;
import com.dev101.coa.global.common.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

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

    @Column(name = "member_email", nullable = true, length = 32)
    private String memberEmail;

    @Column(name = "member_nickname", nullable = false, length = 16)
    private String memberNickname;

    @Column(name = "member_img", nullable = true, length = 255)
    private String memberImg;

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

    public void updateMemberImg (String memberImg) {
        this.memberImg = memberImg;
    }

    public void updateMemberLastVisitCheck(LocalDateTime currentTime){
        this.memberLastVisitCheck = currentTime;
    }

    public void updateMemberIntro(String memberIntro) { this.memberIntro = memberIntro; }

}