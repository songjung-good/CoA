package com.dev101.coa.domain.member.service;

import com.dev101.coa.domain.code.entity.Code;
import com.dev101.coa.domain.code.repository.CodeRepository;
import com.dev101.coa.domain.member.dto.*;
import com.dev101.coa.domain.member.entity.*;
import com.dev101.coa.domain.member.repository.*;
import com.dev101.coa.domain.repo.dto.CommitScoreDto;
import com.dev101.coa.domain.repo.dto.MyRepoAnalysisResDto;
import com.dev101.coa.domain.repo.dto.RepoAnalysisDto;
import com.dev101.coa.domain.repo.entity.CommitScore;
import com.dev101.coa.domain.repo.entity.RepoView;
import com.dev101.coa.domain.repo.repository.CommitScoreRepository;
import com.dev101.coa.global.common.StatusCode;
import com.dev101.coa.global.exception.BaseException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final AlarmRepository alarmRepository;
    private final MemberRepository memberRepository;
    private final AccountLinkRepository accountLinkRepository;
    private final BookmarkRepository bookmarkRepository;
    private final MemberSkillRepository memberSkillRepository;
    private final CodeRepository codeRepository;
    private final CommitScoreRepository commitScoreRepository;
    private final MemberJobRepository memberJobRepository;


    public MemberInfoDto getMemberInfo(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        List<AccountLink> accountLinks = accountLinkRepository.findAllByMember(member);

        MemberInfoDto.MemberInfoDtoBuilder builder = MemberInfoDto.builder()
                .memberUuid(member.getMemberUuid())
                .memberImg(member.getMemberImg())
                .memberNickName(member.getMemberNickname());

        AccountLinkInfoDto accountLinkInfoDto = accountLinks.stream()
                .collect(Collectors.collectingAndThen(Collectors.toList(), this::aggregateLinksIntoDto));

        builder.accountLinkInfoDto(accountLinkInfoDto);

        return builder.build();
    }

    public List<AlarmDto> getAlarmList(Long memberId, int page, int size) {

        Pageable pageable = PageRequest.of(page, size);
        Member targetMember = memberRepository.findById(memberId).orElseThrow(() -> new BaseException(StatusCode.MEMBER_NOT_EXIST));

        Page<Alarm> alarmList = alarmRepository.findByAlarmTargetIdOrderByCreatedAtDesc(memberId, pageable);


        List<AlarmDto> alarmDtoList = new ArrayList<>();
        for (Alarm alarm : alarmList) {
            AlarmDto alarmDto = alarm.convertToDto();
            if(alarm.getAlarmRepoView() != null){
                alarmDto.updateRepoViewInfo(alarm.getAlarmRepoView().getRepoViewId(), alarm.getAlarmRepoView().getRepoViewTitle());
            }
            alarmDtoList.add(alarmDto);
        }

        targetMember.updateMemberLastVisitCheck(LocalDateTime.now());
        memberRepository.save(targetMember);

        return alarmDtoList;

    }

    public Long getNewAlarmCnt(Long memberId) {
        Member targetMember = memberRepository.findById(memberId).orElseThrow(() -> new BaseException(StatusCode.MEMBER_NOT_EXIST));

        LocalDateTime checkedTime = targetMember.getMemberLastVisitCheck();

        return alarmRepository.countAllByAlarmTargetIdAndCreatedAtGreaterThan(memberId, checkedTime);
    }

    public AccountLinkInfoDto aggregateLinksIntoDto(List<AccountLink> links) {
        AccountLinkInfoDto.AccountLinkInfoDtoBuilder dtoBuilder = AccountLinkInfoDto.builder();
        for (AccountLink link : links) {
            switch (link.getCode().getCodeName()) {
                case "Github":
                    dtoBuilder.githubNickName(link.getAccountLinkNickname())
                            .isGithubToken(link.getAccountLinkReceiveToken() != null);
                    break;
                case "GitLab":
                    dtoBuilder.gitlabNickName(link.getAccountLinkNickname())
                            .isGitlabToken(link.getAccountLinkReceiveToken() != null);
                    break;
                case "solvedac":
                    dtoBuilder.solvedacNickName(link.getAccountLinkNickname());
                    break;
                case "Codeforces":
                    dtoBuilder.codeforcesNickName(link.getAccountLinkNickname());
                    break;
            }
        }
        return dtoBuilder.build();
    }

    public BookmarkResDto toggleBookmark(Long loginMemberId, String targetMemberUuid) {
        // 멤버 존재 유무
        Member loginMember = memberRepository.findById(loginMemberId).orElseThrow(() -> new BaseException(StatusCode.MEMBER_NOT_EXIST));
        Member targetMember = memberRepository.findByMemberUuid(UUID.fromString(targetMemberUuid)).orElseThrow(() -> new BaseException(StatusCode.MEMBER_NOT_EXIST));

        // 북마크 존재 유무 확인
        Optional<Bookmark> optionalBookmark = bookmarkRepository.findByBookmarkMemberAndBookmarkTargetMember(loginMember, targetMember);

        if (optionalBookmark.isPresent()) {
            // 북마크 삭제
            bookmarkRepository.delete(optionalBookmark.get());
            return BookmarkResDto.builder()
                    .currentStatus(false)
                    .build();
        }
        // 북마크 저장 또는 삭제
        else {
            // 북마크 저장
            bookmarkRepository.save(Bookmark.builder()
                    .bookmarkMember(loginMember)
                    .bookmarkTargetMember(targetMember)
                    .build());
            // 알람 저장
            alarmRepository.save(Alarm.builder()
                    .alarmMember(loginMember)
                    .alarmTargetId(targetMember.getMemberId())
                    .build());

            return BookmarkResDto.builder()
                    .currentStatus(true)
                    .build();

        }
    }

    public List<MemberCardDto> getBookmarkList(Long loginMemberId) {
        // 로그인 멤버 찾기
        Member loginMember = memberRepository.findById(loginMemberId).orElseThrow(()->new BaseException(StatusCode.MEMBER_NOT_EXIST));

        // 북마크 목록 가져오기
        List<Bookmark> bookmarkList = bookmarkRepository.findByBookmarkMember(loginMember);

        // MemberCardDto로 바꾸기
        List<MemberCardDto> memberCardDtoList = new ArrayList<>();
        for(Bookmark bookmark : bookmarkList){
            Member targetMember = bookmark.getBookmarkTargetMember();
            List<MemberSkill> targetMemberSkillList = memberSkillRepository.findByMember(targetMember);
            memberCardDtoList.add(getMemberCardDto(loginMember, targetMember, targetMemberSkillList));
        }
        return memberCardDtoList;
    }

    public MemberCardDto getMemberCardDto(
            Member currentMember,
            Member targetMember,
            List<MemberSkill> targetMemberSkillList) {
        Boolean isMine = (currentMember == targetMember);
        Boolean isBookmark = bookmarkRepository.findByBookmarkMemberAndBookmarkTargetMember(currentMember, targetMember).isPresent();
        Long jobCodeId = memberJobRepository.findByMember(targetMember).getJobCode().getCodeId();
        return MemberCardDto.createDto(currentMember, targetMemberSkillList, isMine, isBookmark, jobCodeId);
    }

    public void editMember(Member member, MemberCardReq memberCardReq) {
        member.updateMemberIntro(memberCardReq.getIntroduce());

        Code jobCode = codeRepository.findByCodeId(memberCardReq.getJobCodeId())
                .orElseThrow(() -> new BaseException(StatusCode.CODE_NOT_FOUND));

        MemberJob memberJob = new MemberJob(member, jobCode);
        memberJobRepository.save(memberJob);

        List<MemberSkill> currentSkillList = memberSkillRepository.findAllByMember(member);
        List<Long> skillIdList = currentSkillList.stream()
                .map(MemberSkill::getMemberSkillId)
                .toList();
        skillIdList.forEach(memberSkillRepository::deleteById);


        memberCardReq.getSkillIdList().forEach((codeId) -> {
            Code code = codeRepository.findByCodeId(codeId).orElseThrow(() -> new BaseException(StatusCode.CODE_NOT_FOUND));
            MemberSkill memberSkill = MemberSkill.builder()
                    .member(member)
                    .skillCode(code)
                    .build();
            memberSkillRepository.save(memberSkill);
        });
        return;
    }


    public MyRepoAnalysisResDto makeMemberAnalysis(Member member) {

        List<CommitScore> allCommitScore = commitScoreRepository.findAll();
        List<CommitScore> memberCommitScore = commitScoreRepository.findAllByRepoViewMember(member);
        MemberJob memberJob = memberJobRepository.findByMember(member);
        return MyRepoAnalysisResDto.builder()
                .jobs(getMyRepoAnalysisByJob(allCommitScore))
                .myScoreAverage(getMyRepoAnalysisByJob(memberCommitScore).get(memberJob.getJobCode().getCodeId()))
                .repos(getMyReposCommitScore(memberCommitScore))
                .build();
    }

    public List<RepoAnalysisDto> getMyReposCommitScore(List<CommitScore> commitScores) {
        List<RepoAnalysisDto> repoAnalysisDtoList = new ArrayList<>();
        for (CommitScore commitScore : commitScores) {
            CommitScoreDto commitScoreDto = new CommitScoreDto(commitScore);
            RepoView repoView = commitScore.getRepoView();

            repoAnalysisDtoList.add(RepoAnalysisDto.builder()
                    .repoTitle(repoView.getRepoViewTitle())
                    .repoSubTitle(repoView.getRepoViewSubtitle())
                    .repoStartDate(repoView.getRepoStartDate())
                    .repoEndDate(repoView.getRepoEndDate())
                    .commitScoreDto(commitScoreDto).build());
        }

        return repoAnalysisDtoList;
    }

    public Map<Long, Map<String, Double>> getMyRepoAnalysisByJob(List<CommitScore> commitScores) {

        // repoViewId를 키로 하고 Member 객체를 값으로 하는 맵 생성
        Map<Long, Member> memberMap = commitScores.stream()
                .map(CommitScore::getRepoView)
                .distinct()
                .collect(Collectors.toMap(RepoView::getRepoViewId, RepoView::getMember));

        // 직업별로 점수를 분류하고 평균 계산
        Map<Long, Map<String, List<Short>>> scoresByJob = new HashMap<>();
        Map<Long, Map<String, Double>> averageScoresByJob = new HashMap<>();
        scoresByJob.put(2000L, new HashMap<>());

        // 각 직업별 점수와 카운트 집계
        for (CommitScore score : commitScores) {
            Member member = memberMap.get(score.getRepoView().getRepoViewId());
            MemberJob memberJob = memberJobRepository.findByMember(member);
            Long jobCodeId = memberJob.getJobCode().getCodeId();

            Map<String, List<Short>> scores = scoresByJob.computeIfAbsent(jobCodeId, k -> new HashMap<>());
            accumulateScores(scores, score);
            accumulateScores(scoresByJob.get(2000L), score);  // Accumulate scores in the 2000L map
        }

        System.out.println("scoresByJob = " + scoresByJob);

        // 평균 점수 계산
        for (Map.Entry<Long, Map<String, List<Short>>> entry : scoresByJob.entrySet()) {
            Map<String, Double> averageScores = new HashMap<>();
            Map<String, List<Short>> scores = entry.getValue();
            scores.forEach((key, valueList) -> averageScores.put(key, valueList.stream().mapToInt(Short::intValue).average().orElse(0.0)));
            averageScoresByJob.put(entry.getKey(), averageScores);
        }
        return averageScoresByJob;

    }

    private void accumulateScores(Map<String, List<Short>> scores, CommitScore score) {
        scores.computeIfAbsent("readability", k -> new ArrayList<>()).add(score.getScoreReadability());
        scores.computeIfAbsent("performance", k -> new ArrayList<>()).add(score.getScorePerformance());
        scores.computeIfAbsent("reusability", k -> new ArrayList<>()).add(score.getScoreReusability());
        scores.computeIfAbsent("testability", k -> new ArrayList<>()).add(score.getScoreTestability());
        scores.computeIfAbsent("exception", k -> new ArrayList<>()).add(score.getScoreException());
        scores.computeIfAbsent("total", k -> new ArrayList<>()).add(score.getScoreTotal());
    }
}
