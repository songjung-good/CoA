package com.dev101.coa.domain.repo.entity;

import com.dev101.coa.domain.code.entity.Code;
import com.dev101.coa.global.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class RepoViewSkill extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long skillId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "repo_view_id", nullable = false)
    private RepoView repoView;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "skill_code_id")
    private Code skillCode;
}
