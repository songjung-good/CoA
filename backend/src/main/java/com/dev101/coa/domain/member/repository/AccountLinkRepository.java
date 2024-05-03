package com.dev101.coa.domain.member.repository;

import com.dev101.coa.domain.code.entity.Code;
import com.dev101.coa.domain.member.entity.AccountLink;
import com.dev101.coa.domain.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface AccountLinkRepository extends JpaRepository<AccountLink, Long> {
    Boolean existsAccountLinkByMemberAndAccountLinkId(Member member, Long accountLinkId);

    Boolean existsAccountLinkByMemberAndAccountLinkNickname(Member member, String accountLinkNickname);

    AccountLink findByMemberAndCode(Member member, Code code);


    @Modifying
    @Transactional
    @Query("UPDATE AccountLink al SET al.accountLinkNickname = :nickName, al.accountLinkToken = :token, al.accountLinkRefreshToken = :refreshToken WHERE al.accountLinkId = :id")
    void updateAccountLinkFields(Long id, String nickName, String token, String refreshToken);
}
