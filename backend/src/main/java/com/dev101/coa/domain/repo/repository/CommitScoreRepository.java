package com.dev101.coa.domain.repo.repository;

import com.dev101.coa.domain.repo.entity.CommitScore;
import com.dev101.coa.domain.repo.entity.RepoView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CommitScoreRepository extends JpaRepository<CommitScore, RepoView> {
    Optional<CommitScore> findByRepoView(RepoView repoView);

}
