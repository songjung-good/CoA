package com.dev101.coa.domain.repo.repository;

import com.dev101.coa.domain.repo.entity.Repo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RepoRepository extends JpaRepository<Repo, Long> {
    Optional<Repo> findByRepoPath(String repoPath);

    List<Repo> findByRepoPathContaining(String keyword);
}
