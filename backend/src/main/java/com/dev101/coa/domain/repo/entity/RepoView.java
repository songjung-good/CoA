package com.dev101.coa.domain.repo.entity;

import com.dev101.coa.domain.code.entity.Code;
import com.dev101.coa.domain.member.entity.Member;
import com.dev101.coa.global.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

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

    private Long repoViewCommitCnt;

    private Integer repoViewPrCnt;

    @Column(length = 200)
    private String repoViewTitle;

    @Column(length = 255)
    private String repoViewSubtitle;

    @Column(name = "repo_start_date")
    private LocalDate repoStartDate;

    @Column(name = "repo_end_date")
    private LocalDate repoEndDate;


    // 참조를 쉽게 하기 위해 양방향 매핑을 함
    @OneToMany(mappedBy = "repoView")
    List<Comment> commentList = new ArrayList<>();

    @OneToMany(mappedBy = "repoView")
    List<RepoViewSkill> repoViewSkillList = new ArrayList<>();



    // repoViewReadme update
    public void updateReadme(String readme){
        this.repoViewReadme = readme;
    }

    public void updateCommentList(List<Comment> commentList){
        this.commentList = commentList;
    }

    public void updateCodeList(List<RepoViewSkill> repoViewSkillList){
        this.repoViewSkillList = repoViewSkillList;
    }
}
