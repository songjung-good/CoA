package com.dev101.coa.domain.member.repository;

import com.dev101.coa.domain.member.entity.Member;
import com.dev101.coa.domain.member.entity.MemberJob;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MemberJobRepository extends JpaRepository<MemberJob, Long> {

    MemberJob findByMember(Member member);
}
