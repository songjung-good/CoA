package com.dev101.coa.domain.member.entity;

import com.dev101.coa.domain.code.entity.Code;
import com.dev101.coa.global.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "accountLink")
public class AccountLink extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long accountLinkId;

    @ManyToOne
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @OneToOne
    @JoinColumn(name = "code_id", nullable = false)
    private Code code;

    @Column(length = 64)
    private String accountLinkAccountId;

    @Column(nullable = false, length = 64)
    private String accountLinkNickname;

    @Column
    private String account_link_token;

    @Column
    private String account_link_refresh_token;
}
