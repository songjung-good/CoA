package com.dev101.coa.domain.member.repository;

import com.dev101.coa.domain.member.entity.Bookmark;
import com.dev101.coa.domain.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
    Optional<Bookmark> findByBookmarkMemberAndAndBookmarkTargetMember(Member member, Member targetMember);

    List<Bookmark> findByBookmarkMember(Member member);
}
