package com.dev101.coa.domain.member.repository;

import com.dev101.coa.domain.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
    Member findByMemberEmail(String email);
    Optional<Member> findByMemberId(Long memberId);
    List<Member> findByMemberNicknameContaining(String keyword);

    Optional<Member> findByMemberUuid(UUID memberUuid);
}
