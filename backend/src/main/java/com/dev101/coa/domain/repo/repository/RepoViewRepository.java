package com.dev101.coa.domain.repo.repository;

import com.dev101.coa.domain.member.entity.Member;
import com.dev101.coa.domain.repo.entity.Repo;
import com.dev101.coa.domain.repo.entity.RepoView;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RepoViewRepository extends JpaRepository<RepoView, Long> {
    Optional<RepoView> findByRepoViewId(Long repoViewId);

    List<RepoView> findAllByRepo(Repo repo);

    // 쿼리 메소드를 사용하여 repoId 리스트에 있는 모든 RepoView 검색
    @Query("SELECT rv FROM RepoView rv WHERE rv.repo.repoId IN :repoIdList")
    Page<RepoView> findByRepoIdList(@Param("repoIdList") List<Long> repoIdList, Pageable pageable);

    List<RepoView> findAllByMember(Member member);
}
