package com.dev101.coa.domain.repo.dto;

import lombok.*;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommitScoreDto {
    private Integer readability;
    private Integer performance;
    private Integer reusability;
    private Integer testability;
    private Integer exception;
    private Integer total;

    // Constructors, getters, setters, and additional methods
}
