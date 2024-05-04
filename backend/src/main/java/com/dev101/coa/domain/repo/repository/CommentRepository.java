package com.dev101.coa.domain.repo.repository;

import com.dev101.coa.domain.repo.entity.Comment;
import com.dev101.coa.domain.repo.entity.RepoView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findAllByRepoView(RepoView repoView);
}
