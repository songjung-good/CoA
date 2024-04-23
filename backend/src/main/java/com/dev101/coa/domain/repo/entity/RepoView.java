package com.dev101.coa.domain.repo.entity;

import com.dev101.coa.domain.member.entity.Member;
import com.dev101.coa.global.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class RepoView extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long repoViewId;

    @ManyToOne
    @JoinColumn(name = "repo_id", nullable = false)
    private Repo repo;

    @ManyToOne
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Column(columnDefinition = "TEXT")
    private String repoViewReadme;

    @Column(columnDefinition = "TEXT")
    private String repoViewResult;

    private Integer repoViewCommitCnt;

    private Integer repoViewPrCnt;

    @Column(length = 200)
    private String repoViewTitle;

    @Column(length = 255)
    private String repoViewSubtitle;
}
