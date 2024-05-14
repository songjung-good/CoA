package com.dev101.coa.domain.repo.repository;

import com.dev101.coa.domain.code.entity.Code;
import com.dev101.coa.domain.repo.entity.RepoView;
import com.dev101.coa.domain.repo.entity.RepoViewSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RepoViewSkillRepository extends JpaRepository<RepoViewSkill, Long> {

    List<RepoViewSkill> findAllByRepoView(RepoView repoView);

    Optional<Long> countBySkillCode(Code code);
}
