package com.dev101.coa.domain.repo.service;

import com.dev101.coa.domain.code.entity.Code;
import com.dev101.coa.domain.code.repository.CodeRepository;
import com.dev101.coa.domain.member.AccountLinkRepository;
import com.dev101.coa.domain.member.entity.Member;
import com.dev101.coa.domain.repo.dto.*;
import com.dev101.coa.domain.repo.entity.Comment;
import com.dev101.coa.domain.repo.entity.Repo;
import com.dev101.coa.domain.repo.entity.RepoView;
import com.dev101.coa.domain.repo.entity.RepoViewSkill;
import com.dev101.coa.domain.repo.repository.CommentRepository;
import com.dev101.coa.domain.repo.repository.RepoViewRepository;
import com.dev101.coa.domain.repo.repository.RepoViewSkillRepository;
import com.dev101.coa.global.common.StatusCode;
import com.dev101.coa.global.exception.BaseException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RepoService {


    @Value("${url.ai}")
    private String aiServerUrl;


    private final RepoViewRepository repoViewRepository;
    private final CommentRepository commentRepository;
    private final RepoViewSkillRepository repoViewSkillRepository;
    private final CodeRepository codeRepository;
    private final AccountLinkRepository accountLinkRepository;

    private final RedisTemplate<String, String> redisTemplate;
    private final RedisTemplate<String, Object> redisTemplateRepo;

    // AI server 통신을 위한 WebClient
    private final WebClient webClient;

    public void editReadme(Long repoViewId, EditReadmeReqDto editReadmeReqDto) {
        // 레포 뷰 존재 유무 확인
        RepoView repoView = repoViewRepository.findByRepoViewId(repoViewId)
                .orElseThrow(() -> new BaseException(StatusCode.REPO_VIEW_NOT_FOUND));

        // TODO: 로그인 사용자 예외 처리 (작성자 확인)

        // commentList db 내의 코멘트 목록을 삭제
        List<Long> commentIdList = repoView.getCommentList().stream()
                .map(Comment::getCommentId)
                .collect(Collectors.toList());

        commentIdList.forEach(commentRepository::deleteById);

        // 요청으로 받은 commitcommentList 저장
        List<Comment> commentList = new ArrayList<>();
        editReadmeReqDto.getCommitCommentDtoList().forEach((cd -> {
            Comment comment = Comment.builder()
                    .repoView(repoView)
                    .commentStartIndex(cd.getCommentStartIndex())
                    .commentEndIndex(cd.getCommentEndIndex())
                    .commentContent(cd.getCommentContent())
                    .build();
            commentList.add(comment);
            commentRepository.save(comment);
        }));

        // 요청으로 받은 codeList 삭제 후 저장
        List<RepoViewSkill> repoViewSkillList = new ArrayList<>();
        List<Long> skillIdList = repoView.getRepoViewSkillList().stream()
                .map(RepoViewSkill::getSkillId)
                .toList();

        skillIdList.forEach(repoViewSkillRepository::deleteById);

        editReadmeReqDto.getCodeList().forEach((codeId) -> {
            Code code = codeRepository.findByCodeId(codeId).orElseThrow(() -> new BaseException(StatusCode.CODE_NOT_FOUND));
            RepoViewSkill repoviewSkill = RepoViewSkill.builder()
                    .repoView(repoView)
                    .skillCode(code)
                    .build();
            repoViewSkillList.add(repoviewSkill);
            repoViewSkillRepository.save(repoviewSkill);
        });


        // 레포 뷰 저장
        repoView.updateReadme(editReadmeReqDto.getRepoViewReadme());
        repoView.updateCommentList(commentList);
        repoView.updateCodeList(repoViewSkillList);
        repoViewRepository.save(repoView);
    }

    public void saveAnalysis(Long memberId, String analysisId) {
        // redis에서 analysisId 로 값 조회시 존재 여부 판단
        Map<Object, Object> redisData = redisTemplateRepo.opsForHash().entries(analysisId);
        if(redisData.isEmpty()){
            throw new BaseException(StatusCode.REPO_VIEW_NOT_FOUND);
        }
        // TODO: 로그인 사용자 예외처리
        // 로그인 사용자와 분석 요구자 일치 여부 확인
        Long redisMemberId = ((Integer)redisData.get("memberId")).longValue();
        if(!memberId.equals(redisMemberId)){
            throw new BaseException(StatusCode.REPO_REQ_MEMBER_NOT_MATCH);
        }
        // repo 저장(platformCodeId, repoPath, repoReadmeOrigin, repoCommtCnt,
        // TODO: platformCodeId에 따른 분기처리



        // repoView 저장




        // mysql 저장

        // repo 저장 - repoPath로 찾은 후, 존재하면 업데이트 존재하지 않으면 생성

        // repoView 저장

    }


    /**
     * repo 분석 시작
     * - AI 서버로 레포 분석 요청 보내기
     *
     * @param analysisReqDto
     * @return
     */
    public String startAnalysis(Long memberId, Long codeId, AnalysisReqDto analysisReqDto) {


        // TODO: 로그인한 member 받아오기
        // TODO: codeId(github/gitlab) 받아오기 - 아마 dto도 바꿔야 할거야.

        Member member = null;

        // codeId githb, gitlab 인지 판단하기
        Set<Long> platformList = new HashSet<>();
        platformList.add(1002L);
        platformList.add(1003L);
        if(!platformList.contains(codeId)){
            throw new BaseException(StatusCode.NOT_FOUND_PLAT);
        }

        // isOwn 값 처리하기
        Boolean isOwn = accountLinkRepository.existsAccountLinkByMemberAndAccountLinkAccountId(member, analysisReqDto.getUserName());

        // analysisId 만들기
        String analysisId = UUID.randomUUID().toString();

        // redis에 저장할 수 있는 값 저장하기
        // key: analysisId, fields:repoPath, useranme, memaberId, isOwn, percent 0
        // Redis에 저장하기 전에 객체의 모든 데이터를 JSON 형식으로 저장하도록 설정
        HashMap<String, Object> map = new HashMap<>();
        map.put("repoPath", analysisReqDto.getRepoUrl());
        map.put("userName", analysisReqDto.getUserName());
        map.put("memberId", member.getMemberId());
        map.put("codeId", codeId);
        map.put("isOwn", isOwn.toString()); // Boolean 값을 문자열로 저장
        map.put("percentage", "0"); // 초기 비율을 문자열로 저장

        redisTemplateRepo.opsForHash().putAll(analysisId, map);
        redisTemplateRepo.expire(analysisId, 24, TimeUnit.HOURS); // 레디스에 보관하고 있을 시간

        // AI 서버로 요청 보내기 (body: repoUrl, userName, memberId, isOwn)
        String aiUrl = "";
        if(codeId == 1002) aiUrl = aiServerUrl + "/github";
        else if(codeId == 1003) aiUrl = aiServerUrl + "/gitlab";

        String response = webClient.post()
                .uri(aiUrl)
                .contentType(MediaType.APPLICATION_JSON)
                .body(Mono.just(
                        AiAnalysisReqDto.builder()
                                .repoUrl(analysisReqDto.getRepoUrl())
                                .userName(analysisReqDto.getUserName())
                                .memberId(member.getMemberId())
                                .isOwn(isOwn)
                                .build()
                ), AiAnalysisReqDto.class)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        if (response.equals("false")) {
            throw new BaseException(StatusCode.AI_SERVER_ERROR);
        }

        return analysisId;
    }

    public AnalysisResultDto checkAnalysis(Long memberId, String analysisId) {

        // =========== redis test data
        CommitScoreDto commitScoreDto = CommitScoreDto.builder()
                .readability(10)
                .performance(20)
                .reusability(30)
                .testability(40)
                .exception(50)
                .total(30)
                .scoreComment("good!")
                .build();

        Map<Long, Integer> linesOfCode = new HashMap<>();
        linesOfCode.put(3001L, 11);
        linesOfCode.put(3002L, 22);

        AiResultDto resultTest = AiResultDto.builder()
                .readme("this is readme")
                .repoViewResult("this is repoViewResult")
                .commitScore(commitScoreDto)
                .linesOfCode(linesOfCode)
                .build();

        AnalysisResultDto analysisResultDtoTest = AnalysisResultDto.builder()
                .repoPath("http://repopath.com/hellong")
                .userName("ha09368")
                .memberId(1L)
                .isOwn(true)
                .percentage(100)
                .result(resultTest)
                .build();

        Map<String, Object> map = new HashMap<>();
        map.put("repoPath", analysisResultDtoTest.getRepoPath());
        map.put("userName", analysisResultDtoTest.getUserName());
        map.put("memberId", analysisResultDtoTest.getMemberId());
        map.put("isOwn", analysisResultDtoTest.getIsOwn());
        map.put("percentage", analysisResultDtoTest.getPercentage());
        map.put("result", analysisResultDtoTest.getResult());  // 'result' is another complex object, serialized as JSON

        System.out.println("map = " + map);

        redisTemplateRepo.opsForHash().putAll(analysisId, map);

        System.out.println("json 저장 완료");

        // =============== testData

        Map<Object, Object> redisData = redisTemplateRepo.opsForHash().entries(analysisId);

        // redis에서 analysisId에 해당하는 요소를 가져온다.
        String redisRepoPath = (String)redisData.get("repoPath");
        if (redisRepoPath == null) {
            throw new BaseException(StatusCode.REPO_VIEW_NOT_FOUND);
        }


        // memberId와 요소의 memberId의 일치여부를 확인한다.
        Long redisMemberId = ((Integer)redisData.get("memberId")).longValue();
        if (!Objects.equals(memberId, redisMemberId)) {
            // 일치하지 않으면 예외 발생
            throw new BaseException(StatusCode.REPO_REQ_MEMBER_NOT_MATCH);
        }

        // 일치하면 요소에서 percentage를 가져온다.
        // percentage가 100이 아니면, AnalysisResultDto 반환한다.
        AnalysisResultDto analysisResultDto = AnalysisResultDto.builder()
                .repoPath(redisRepoPath)
                .userName((String) redisData.get("userName"))
                .memberId(redisMemberId)
                .isOwn((Boolean) redisData.get("isOwn"))
                .percentage((Integer) redisData.get("percentage"))
                .build();

        if ((Integer) redisData.get("percentage") != 100) {
            return analysisResultDto;
        }

        // percentage가 100이면, 저장된 result를 반환 Dto에 담는다.
        else {
            AiResultDto result = (AiResultDto) redisData.get("result");
            analysisResultDto.updateResult(result);
            return analysisResultDto;
        }
    }
}
