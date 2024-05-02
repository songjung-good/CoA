package com.dev101.coa.domain.repo.entity;

import com.dev101.coa.domain.code.entity.Code;
import com.dev101.coa.domain.repo.dto.RepoInfo;
import com.dev101.coa.global.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "repo")
public class Repo extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "repo_id")
    private Long repoId;

    @ManyToOne
    @JoinColumn(name = "plat_code_id", nullable = false)
    private Code platCode;

    @Column(name = "repo_path", nullable = false, length = 200)
    private String repoPath;

    @Column(name = "repo_readme_origin")
    private String repoReadmeOrigin;

    @Column(name = "repo_commit_cnt")
    private Long repoCommitCnt;

    @Column(name = "repo_gitlab_project_id")
    private Integer repoGitlabProjectId;

    @Column(name = "repo_member_cnt")
    private Integer repoMemberCnt;


    public void updateRepo(RepoInfo repoInfo){

        this.platCode = repoInfo.getRepoCode();
        this.repoReadmeOrigin = repoInfo.getRepoReadmeOrigin();
        this.repoCommitCnt = repoInfo.getRepoCommitCnt();
        this.repoGitlabProjectId = repoInfo.getRepoGitLabProjectId();
        this.repoMemberCnt = repoInfo.getRepoMemberCnt();
    }
}