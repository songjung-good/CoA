package com.dev101.coa.domain.repo.entity;

import com.dev101.coa.domain.repo.dto.CommitCommentDto;
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
    private Integer commentStartIndex;

    @Column(name = "comment_end_index")
    private Integer commentEndIndex;

    @Column(name = "comment_target_string")
    private String commentTargetString;

    @Column(name = "comment_content", length = 255)
    private String commentContent;

    public CommitCommentDto convertToDto(){
        return CommitCommentDto.builder()
                .commentStartIndex(this.commentStartIndex)
                .commentEndIndex(this.commentEndIndex)
                .commentTargetString(this.commentTargetString)
                .commentContent(this.commentContent)
                .build();
    }
}
