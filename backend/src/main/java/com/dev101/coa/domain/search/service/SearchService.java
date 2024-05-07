package com.dev101.coa.domain.search.service;

import com.dev101.coa.domain.code.dto.CodeDto;
import com.dev101.coa.domain.code.entity.Code;
import com.dev101.coa.domain.member.dto.MemberCardDto;
import com.dev101.coa.domain.member.entity.AccountLink;
import com.dev101.coa.domain.member.entity.Member;
import com.dev101.coa.domain.member.entity.MemberSkill;
import com.dev101.coa.domain.member.repository.AccountLinkRepository;
import com.dev101.coa.domain.member.repository.MemberRepository;
import com.dev101.coa.domain.member.repository.MemberSkillRepository;
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
    private final MemberRepository memberRepository;
    private final AccountLinkRepository accountLinkRepository;
    private final MemberSkillRepository memberSkillRepository;


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

    public List<MemberCardDto> searchMember(String keyword) {
        if (keyword.isEmpty()) {
            throw new BaseException(StatusCode.KEYWORD_EMPTY);
        }

        List<Member> memberList = memberRepository.findByMemberNicknameContaining(keyword);
        List<AccountLink> accountLinkList = accountLinkRepository.findByAccountLinkNicknameContaining(keyword);

        // AccountLinkList에서 멤버 추출
        accountLinkList.forEach(acl -> {
            memberList.add(acl.getMember());
        });
        // 중복 제거 - CoA 서비스 닉네임 일치도 우선, 연동계정 닉네임 일치도 후순위
        List<Member> mergedMemberList = memberList.stream().distinct().toList();

        // memberCardDto List 만들기
        List<MemberCardDto> memberCardDtoList = new ArrayList<>();
        for (Member member : mergedMemberList) {
            // skillList
            List<MemberSkill> memberSkillList = memberSkillRepository.findByMember(member);

            MemberCardDto memberCardDto = MemberCardDto.createDto(member, memberSkillList);
            memberCardDtoList.add(memberCardDto);
        }

        return memberCardDtoList;
    }
}