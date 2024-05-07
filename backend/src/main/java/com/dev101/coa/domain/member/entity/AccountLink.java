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
@Table(name = "accountLink")
public class AccountLink extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long accountLinkId;

    @ManyToOne
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @ManyToOne
    @JoinColumn(name = "code_id", nullable = false)
    private Code code;

    @Column(nullable = false, length = 64)
    private String accountLinkNickname;

    @Column
    private String accountLinkToken;

    @Column
    private String accountLinkRefreshToken;

    @Column
    private String accountLinkReceiveToken;


    public void updateAccountLinkFields(Long id, String nickName, String token, String refreshToken) {
        this.accountLinkNickname = nickName;
        this.accountLinkToken = token;
        this.accountLinkRefreshToken = refreshToken;
    }
    public void updateReceiveToken(String receiveToken) {
        this.accountLinkReceiveToken = receiveToken;
    }

    public void updateNickName(String nickName) {
        this.accountLinkNickname = nickName;
    }
}
