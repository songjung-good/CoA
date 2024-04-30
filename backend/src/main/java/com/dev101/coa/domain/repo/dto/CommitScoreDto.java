package com.dev101.coa.domain.repo.dto;

import lombok.*;

import java.io.Serializable;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class CommitScoreDto {
    private Integer readability;
    private Integer performance;
    private Integer reusability;
    private Integer testability;
    private Integer exception;
    private Integer total;
    private String scoreComment;

    // Constructors, getters, setters, and additional methods
}
