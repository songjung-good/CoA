package com.dev101.coa.domain.member.repository;

import com.dev101.coa.domain.code.entity.Code;
import com.dev101.coa.domain.member.entity.Member;
import com.dev101.coa.domain.member.entity.MemberSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MemberSkillRepository extends JpaRepository<MemberSkill, Long> {

    List<MemberSkill> findByMember(Member member);

    List<MemberSkill> findAllByMember(Member member);

    Optional<Long> countAllBySkillCode(Code code);
}
