package com.dev101.coa.domain.search.service;

import com.dev101.coa.domain.code.dto.CodeDto;
import com.dev101.coa.domain.member.entity.Member;
import com.dev101.coa.domain.repo.dto.RepoCardDto;
import com.dev101.coa.domain.repo.entity.Repo;
import com.dev101.coa.domain.repo.entity.RepoView;
import com.dev101.coa.domain.repo.repository.RepoRepository;
import com.dev101.coa.domain.repo.repository.RepoViewRepository;
import com.dev101.coa.global.common.StatusCode;
import com.dev101.coa.global.exception.BaseException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SearchService {

    private final RepoRepository repoRepository;
    private final RepoViewRepository repoViewRepository;

    public List<RepoCardDto> searchRepoView(String keyword) {
        if (keyword.isEmpty()) {
            throw new BaseException(StatusCode.KEYWORD_EMPTY);
        }

        List<Repo> repoList = repoRepository.findByRepoPathContaining(keyword);
        List<RepoCardDto> repoCardDtoList = new ArrayList<>();
        List<RepoView> repoViewList = new ArrayList<>();
        for (Repo repo : repoList) {
            repoViewList.addAll(repoViewRepository.findAllByRepo(repo));
        }
        // createdAt 내림차순으로 정렬
        repoViewList = repoViewList.stream()
                 .sorted(Comparator.comparing(RepoView::getCreatedAt).reversed())
                .collect(Collectors.toList());

        for (RepoView repoView : repoViewList) {
            System.out.println("repoView.getRepoViewSkillList() = " + repoView.getRepoViewSkillList());

            Member member = repoView.getMember();

            List<CodeDto> codeDtoList = new ArrayList<>();
            repoView.getRepoViewSkillList().stream().forEach((sk) -> {
                codeDtoList.add(sk.getSkillCode().convertToDto());
            });

            repoCardDtoList.add(RepoCardDto.builder()
                    .memberId(member.getMemberId())
                    .memberNickname(member.getMemberNickname())
                    .memberImg(member.getMemberImg())
                    .repoViewId(repoView.getRepoViewId())
                    .repoViewPath(repoView.getRepo().getRepoPath())
                    .repoViewTitle(repoView.getRepoViewTitle())
                    .repoViewSubtitle(repoView.getRepoViewSubtitle())
                    .skillList(codeDtoList)
                    .repoStartDate(repoView.getRepoStartDate())
                    .repoEndDate(repoView.getRepoEndDate())
                    .build());
        }

        return repoCardDtoList;
    }
}