package com.dev101.coa.domain.search.service;

import com.dev101.coa.domain.code.dto.CodeDto;
import com.dev101.coa.domain.member.dto.MemberCardDto;
import com.dev101.coa.domain.member.entity.Member;
import com.dev101.coa.domain.member.entity.MemberSkill;
import com.dev101.coa.domain.member.repository.AccountLinkRepository;
import com.dev101.coa.domain.member.repository.MemberRepository;
import com.dev101.coa.domain.member.repository.MemberSkillRepository;
import com.dev101.coa.domain.member.service.MemberService;
import com.dev101.coa.domain.repo.dto.RepoCardDto;
import com.dev101.coa.domain.repo.entity.Repo;
import com.dev101.coa.domain.repo.entity.RepoView;
import com.dev101.coa.domain.repo.repository.RepoRepository;
import com.dev101.coa.domain.repo.repository.RepoViewRepository;
import com.dev101.coa.global.common.StatusCode;
import com.dev101.coa.global.exception.BaseException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SearchService {

    private final RepoRepository repoRepository;
    private final RepoViewRepository repoViewRepository;
    private final MemberRepository memberRepository;
    private final AccountLinkRepository accountLinkRepository;
    private final MemberSkillRepository memberSkillRepository;
    private final MemberService memberService;


    public List<RepoCardDto> searchRepoView(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        if (keyword.isEmpty()) {
            throw new BaseException(StatusCode.KEYWORD_EMPTY);
        }

        List<Repo> repoList = repoRepository.findByRepoPathContaining(keyword);

        List<RepoCardDto> repoCardDtoList = new ArrayList<>();
        List<RepoView> repoViewList = new ArrayList<>();
        for (Repo repo : repoList) {
            Page<RepoView> pageRepoViewList = repoViewRepository.findAllByRepo(repo, pageable);
            for(RepoView prv: pageRepoViewList){
                repoViewList.add(prv);
            }
        }
        // createdAt 내림차순으로 정렬
//        repoViewList = repoViewList.stream()
//                .sorted(Comparator.comparing(RepoView::getCreatedAt).reversed())
//                .collect(Collectors.toList());

        for (RepoView repoView : repoViewList) {
            System.out.println("repoView.getRepoViewSkillList() = " + repoView.getRepoViewSkillList());

            Member member = repoView.getMember();

            List<CodeDto> codeDtoList = new ArrayList<>();
            repoView.getRepoViewSkillList().stream().forEach((sk) -> {
                codeDtoList.add(sk.getSkillCode().convertToDto());
            });

            repoCardDtoList.add(RepoCardDto.builder()
                    .memberUuid(member.getMemberUuid())
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

    public List<MemberCardDto> searchMember(Member currentMember,String keyword, int page, int size) {

        Pageable pageable = PageRequest.of(page, size);

        if (keyword.isEmpty()) {
            throw new BaseException(StatusCode.KEYWORD_EMPTY);
        }

        // JPA는 같은 트랜젝션 내의 동일한 엔티티 ID에 대해 중복 관리가 됨. 따라서 멤버 중복 체크를 안해도 됨
        Page<Member> memberList = memberRepository.findMemberByNickname(keyword, pageable);

        // memberCardDto List 만들기
        List<MemberCardDto> memberCardDtoList = new ArrayList<>();
        for (Member member : memberList) {
            // skillList
            List<MemberSkill> memberSkillList = memberSkillRepository.findByMember(member);

            MemberCardDto memberCardDto = memberService.getMemberCardDto(currentMember, member, memberSkillList);
            memberCardDtoList.add(memberCardDto);
        }

        return memberCardDtoList;
    }
}