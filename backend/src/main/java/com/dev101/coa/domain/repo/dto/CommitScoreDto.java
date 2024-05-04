package com.dev101.coa.domain.repo.dto;

import com.dev101.coa.domain.repo.entity.CommitScore;
import lombok.*;

import java.io.Serializable;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class CommitScoreDto {
    private Short readability;
    private Short performance;
    private Short reusability;
    private Short testability;
    private Short exception;
    private Short total;
    private String scoreComment;

}
