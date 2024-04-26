package com.dev101.coa.domain.repo.repository;

import com.dev101.coa.domain.repo.entity.RepoViewSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepoViewSkillRepository extends JpaRepository<RepoViewSkill, Long> {

}
