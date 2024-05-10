package com.dev101.coa.domain.repo.repository;

import com.dev101.coa.domain.member.entity.Member;
import com.dev101.coa.domain.repo.entity.Repo;
import com.dev101.coa.domain.repo.entity.RepoView;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RepoViewRepository extends JpaRepository<RepoView, Long> {
    Optional<RepoView> findByRepoViewId(Long repoViewId);

    List<RepoView> findAllByRepo(Repo repo);

    Page<RepoView> findAllByRepo(Repo repo, Pageable pageable);

    List<RepoView> findAllByMember(Member member);
}
