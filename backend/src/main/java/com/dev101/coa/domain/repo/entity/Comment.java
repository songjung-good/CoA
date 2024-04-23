package com.dev101.coa.domain.repo.entity;

import com.dev101.coa.global.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class Comment extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long commentId;

    @ManyToOne
    @JoinColumn(name = "repo_view_id", nullable = false)
    private RepoView repoView;

    @Column(name = "comment_start_index")
    private Short commentStartIndex;

    @Column(name = "comment_end_index")
    private Short commentEndIndex;

    @Column(name = "comment_content", length = 255)
    private String commentContent;
}
