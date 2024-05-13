package com.dev101.coa.domain.member.entity;

import com.dev101.coa.domain.code.entity.Code;
import com.dev101.coa.global.common.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class MemberJob extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long memberJobId;


    @ManyToOne
    @JoinColumn(name = "code_id", nullable = false)
    private Code jobCode;


    @OneToOne
    @JoinColumn(name = "member_id")
    private Member member;

    // 직접 정의한 생성자
    public MemberJob(Member member, Code jobCode) {
        this.member = member;
        this.jobCode = jobCode;
    }
}