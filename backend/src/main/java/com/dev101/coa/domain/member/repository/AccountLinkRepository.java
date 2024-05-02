package com.dev101.coa.domain.member.repository;

import com.dev101.coa.domain.code.entity.Code;
import com.dev101.coa.domain.member.entity.AccountLink;
import com.dev101.coa.domain.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AccountLinkRepository extends JpaRepository<AccountLink, Long> {
    Boolean existsAccountLinkByMemberAndAccountLinkAccountId(Member member, String accountLinkAccountId);

    AccountLink findByMemberAndCode(Member member, Code code);
}
