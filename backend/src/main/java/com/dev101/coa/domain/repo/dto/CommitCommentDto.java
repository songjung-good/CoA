package com.dev101.coa.domain.repo.dto;


import lombok.*;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommitCommentDto {
    private Integer commentStartIndex;
    private Integer commentEndIndex;
    private String commentTargetString;
    private String commentContent;

    // Getters and setters
}
