package com.dev101.coa.domain.member.repository;

import com.dev101.coa.domain.member.entity.Member;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
    Member findByMemberEmail(String email);
    Optional<Member> findByMemberId(Long memberId);

    @Query("SELECT m FROM Member m JOIN AccountLink al on m.memberId = al.member.memberId WHERE m.memberNickname LIKE %:keyword% OR al.accountLinkNickname LIKE %:keyword% ORDER BY m.memberUuid")
    Page<Member> findMemberByNickname(@Param("keyword") String keyword, Pageable pageable);

    Optional<Member> findByMemberUuid(UUID memberUuid);

    Member findByMemberNickname(String userName);
}
