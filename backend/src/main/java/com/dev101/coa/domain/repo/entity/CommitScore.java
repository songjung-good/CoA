package com.dev101.coa.domain.repo.entity;

import com.dev101.coa.global.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.Objects;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class CommitScore extends BaseEntity {

    @Id
    @OneToOne
    @JoinColumn(name = "repo_view_id", nullable = false)
    private RepoView repoView;


    private Short scoreReadability;

    private Short scorePerformance;

    private Short scoreReusability;

    private Short scoreTestability;

    private Short scoreException;

    private Short scoreTotal;

    @Column(columnDefinition = "TEXT")
    private String scoreComment;


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof CommitScore other)) return false;
        return Objects.equals(repoView, other.getRepoView());
    }

    @Override
    public int hashCode() {
        return Objects.hash(repoView);
    }

}
