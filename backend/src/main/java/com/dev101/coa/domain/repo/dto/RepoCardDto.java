package com.dev101.coa.domain.repo.dto;

import com.dev101.coa.domain.code.dto.CodeDto;
import com.dev101.coa.domain.repo.entity.RepoView;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

@Builder
@Getter
public class RepoCardDto {
    private Long memberId;

    private String memberNickname;

    private String memberImg;

    private Long repoViewId;

    private String repoViewPath;

    private String repoViewTitle;

    private String repoViewSubtitle;

    private List<CodeDto> skillList;

    private LocalDate repoStartDate;

    private LocalDate repoEndDate;

    private Boolean isMine;

    public static RepoCardDto createRepoCardDto(RepoView repoView, Long memberId){

        // 현재 로그인한 memberId와 레포 뷰의 주인 매치 여부 확인
        Boolean isMine = memberId == repoView.getMember().getMemberId();

        return RepoCardDto.builder()
                .memberId(repoView.getMember().getMemberId())
                .memberNickname(repoView.getMember().getMemberNickname())
                .memberImg(repoView.getMember().getMemberImg())
                .repoViewId(repoView.getRepoViewId())
                .repoViewPath(repoView.getRepo().getRepoPath())
                .repoViewTitle(repoView.getRepoViewTitle())
                .repoViewSubtitle(repoView.getRepoViewSubtitle())
                .repoStartDate(repoView.getRepoStartDate())
                .repoEndDate(repoView.getRepoEndDate())
                .isMine(isMine)
                .build();
    }

    public void updateSkillList(List<CodeDto> skillList){
        this.skillList = skillList;
    }
}
