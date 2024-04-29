package com.dev101.coa.domain.repo.service;

import com.dev101.coa.domain.code.entity.Code;
import com.dev101.coa.domain.code.repository.CodeRepository;
import com.dev101.coa.domain.member.AccountLinkRepository;
import com.dev101.coa.domain.member.entity.Member;
import com.dev101.coa.domain.repo.dto.*;
import com.dev101.coa.domain.repo.entity.Comment;
import com.dev101.coa.domain.repo.entity.RepoView;
import com.dev101.coa.domain.repo.entity.RepoViewSkill;
import com.dev101.coa.domain.repo.repository.CommentRepository;
import com.dev101.coa.domain.repo.repository.RepoViewRepository;
import com.dev101.coa.domain.repo.repository.RepoViewSkillRepository;
import com.dev101.coa.global.common.StatusCode;
import com.dev101.coa.global.exception.BaseException;
import lombok.RequiredArgsConstructor;
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

    private final RepoViewRepository repoViewRepository;
    private final CommentRepository commentRepository;
    private final RepoViewSkillRepository repoViewSkillRepository;
    private final CodeRepository codeRepository;
    private final AccountLinkRepository accountLinkRepository;

    private final RedisTemplate<String, String> redisTemplate;
    private final RedisTemplate<String, AnalysisResultDto> redisTemplateRepo;

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

    public void saveAnalysis(Long analysisId) {
        // TODO: 로그인 사용자 예외처리

//        // test) 레디스에 저장된 정보 가져오기
//        ValueOperations<String, String> valueOps = redisTemplate.opsForValue();
//        String value = valueOps.get("test_key");
//        System.out.println("Value for key '" + "test_key" + "' is: " + value);
//
//
//        // TODO:  test) 레디스에 json 저장해보기
//        //    commitScoreDto done
//        //    analysisResultDto done
//        //    레디스에 json 저장 done
//        //    저장된 json 조회해보기  done
//
//        CommitScoreDto commitScoreDto = CommitScoreDto.builder()
//                .readability(10)
//                .performance(20)
//                .reusability(30)
//                .testability(40)
//                .exception(50)
//                .total(30)
//                .scoreComment("good!")
//                .build();
//
//        Map<Long, Integer> linesOfCode = new HashMap<>();
//        linesOfCode.put(3001L,11);
//        linesOfCode.put(3002L, 22);
//
//        AnalysisResultDto analysisResultDto = AnalysisResultDto.builder()
//                .analysisId(1L)
//                .memberId(1L)
//                .isComplete(true)
//                .readme("readme~ mario!")
//                .repoViewResult("this is repoViewResult")
//                .commitScore(commitScoreDto)
//                .linesOfCode(linesOfCode)
//                .build();
//
//        redisTemplateJson.opsForValue().set(analysisResultDto.getAnalysisId(), analysisResultDto);
//
//        System.out.println("json 저장 완료");
//
//        System.out.println((AnalysisResultDto)redisTemplateJson.opsForValue().get(1L));

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
    public String startAnalysis(Long memberId, AnalysisReqDto analysisReqDto) {


        // TODO: 로그인한 member 받아오기

        Member member = null;

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
        map.put("isOwn", isOwn.toString()); // Boolean 값을 문자열로 저장
        map.put("percentage", "0"); // 초기 비율을 문자열로 저장

        redisTemplateRepo.opsForHash().putAll(analysisId, map);
        redisTemplateRepo.expire(analysisId, 24, TimeUnit.HOURS); // 레디스에 보관하고 있을 시간

        // Redis에서 데이터 검색
//        Map<Object, Object> retrievedData = redisTemplateRepo.opsForHash().entries(analysisId);
//        System.out.println("Retrieved Data: " + retrievedData);

        // AI 서버로 요청 보내기 (body: repoUrl, userName, memberId, isOwn)
        String aiUrl = "https://k10e101.p.ssafy.io:7777";
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

        if(response.equals("false")){
            throw new BaseException(StatusCode.AI_SERVER_ERROR);
        }

        return analysisId;
    }
}
