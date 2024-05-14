package com.dev101.coa.domain.redis;

import com.dev101.coa.domain.repo.dto.AiResultDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.TimeToLive;

import java.time.LocalDate;

@RedisHash("result")
@AllArgsConstructor
@Builder
@Getter
@ToString
public class RedisResult {
    @Id
    private String analysisId;
    private String repoPath;
    private Integer projectId;
    private String userName;
    private Long memberId;
    private Boolean isOwn;
    private Integer percentage;
    private LocalDate repoStartDate;
    private LocalDate repoEndDate;
    private Integer repoMemberCnt;
    private AiResultDto result;
    private String status;
    @TimeToLive
    private Long expireSec;

}
