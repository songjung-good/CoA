package com.dev101.coa.domain.repo.service;

import com.dev101.coa.domain.code.dto.CodeCntDto;
import com.dev101.coa.domain.code.entity.Code;
import com.dev101.coa.domain.code.repository.CodeRepository;
import com.dev101.coa.domain.member.AccountLinkRepository;
import com.dev101.coa.domain.member.entity.Member;
import com.dev101.coa.domain.member.repository.MemberRepository;
import com.dev101.coa.domain.repo.dto.*;
import com.dev101.coa.domain.repo.entity.*;
import com.dev101.coa.domain.repo.repository.*;
import com.dev101.coa.global.common.StatusCode;
import com.dev101.coa.global.exception.BaseException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RepoService {


    @Value("${url.ai}")
    private String aiServerUrl;

    @Value("${url.gitHubApi}")
    private String gitHubApiUrl;


    @Value("${token.github}")
    private String githubToken;


    private final RepoRepository repoRepository;
    private final RepoViewRepository repoViewRepository;
    private final CommentRepository commentRepository;
    private final RepoViewSkillRepository repoViewSkillRepository;
    private final CodeRepository codeRepository;
    private final AccountLinkRepository accountLinkRepository;
    private final MemberRepository memberRepository;
    private final LineOfCodeRepository lineOfCodeRepository;
    private final CommitScoreRepository commitScoreRepository;

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

    public void saveAnalysis(Long memberId, String analysisId, SaveAnalysisReqDto saveAnalysisReqDto) {

        // redis에서 analysisId 로 값 조회시 존재 여부 판단
        Map<Object, Object> redisData = redisTemplateRepo.opsForHash().entries(analysisId);
        if (redisData.isEmpty()) {
            throw new BaseException(StatusCode.REPO_VIEW_NOT_FOUND);
        }
        // TODO: 로그인 사용자 예외처리
        // 로그인 사용자와 분석 요구자 일치 여부 확인
        Member member = memberRepository.findByMemberId(memberId).orElseThrow(() -> new BaseException(StatusCode.MEMBER_NOT_EXIST));
        Long redisMemberId = ((Integer) redisData.get("memberId")).longValue();
        if (!memberId.equals(redisMemberId)) {
            throw new BaseException(StatusCode.REPO_REQ_MEMBER_NOT_MATCH);
        }

        // repo 저장(platformCodeId, repoPath, repoReadmeOrigin, repoCommtCnt,
        // - repoPath로 찾은 후, 존재하면 업데이트 존재하지 않으면 생성
        RepoInfo repoInfo = getRepoInfo(redisData);

        Repo repo = null;
        Optional<Repo> optionalRepo = repoRepository.findByRepoPath((String) redisData.get("repoPath"));

        if (optionalRepo.isPresent()) {
            // update repo
            repo = optionalRepo.get();
            repo.updateRepo(repoInfo);
            repoRepository.save(repo);
        } else {
            // save repo
            repo = Repo.builder()
                    .platCode(repoInfo.getRepoCode())
                    .repoPath(repoInfo.getRepoPath())
                    .repoReadmeOrigin(repoInfo.getRepoReadmeOrigin())
                    .repoCommitCnt(repoInfo.getRepoCommitCnt())
                    .repoGitlabProjectId(repoInfo.getRepoGitLabProjectId())
                    .repoMemberCnt(repoInfo.getRepoMemberCnt())
                    .build();
            repoRepository.save(repo);
        }


        // repoView 저장
        List<Long> skillCodeIdList = saveAnalysisReqDto.getRepoViewSkillList();
        List<Code> skillCodeList = new ArrayList<>();
        for (Long id : skillCodeIdList) {
            Code code = codeRepository.findByCodeId(id).orElseThrow(() -> new BaseException(StatusCode.CODE_NOT_FOUND));
            skillCodeList.add(code);
        }
        AiResultDto aiResult = (AiResultDto) redisData.get("result");
        RepoView repoView = RepoView.builder()
                .repo(repo)
                .member(member)
                .repoViewReadme(aiResult.getReadme())
                .repoViewResult(aiResult.getRepoViewResult())
                .repoViewCommitCnt(aiResult.getPersonalCommitCnt())
                .repoViewTitle(saveAnalysisReqDto.getRepoViewTitle())
                .repoViewSubtitle(saveAnalysisReqDto.getRepoViewSubtitle())
                .repoStartDate(saveAnalysisReqDto.getRepoStartDate())
                .repoEndDate(saveAnalysisReqDto.getRepoEndDate())
                .build();

        repoViewRepository.save(repoView);

        // skillCode 업데이트
        for (Code code : skillCodeList) {
            RepoViewSkill repoViewSkill = RepoViewSkill.builder()
                    .repoView(repoView)
                    .skillCode(code)
                    .build();
            repoViewSkillRepository.save(repoViewSkill);

        }

        // lines of code 저장
        Map<Long, Integer> linesOfCodeMap = aiResult.getLinesOfCode();
        List<Map.Entry<Long, Integer>> linesOfCodeList = linesOfCodeMap.entrySet().stream().toList();
        for(Map.Entry<Long, Integer> entry : linesOfCodeList){
            Code code = codeRepository.findByCodeId(entry.getKey()).orElseThrow(()->new BaseException(StatusCode.CODE_NOT_FOUND));
            LineOfCode lineOfCode = LineOfCode.builder()
                    .repoView(repoView)
                    .skillCode(code)
                    .lineCount(entry.getValue())
                    .build();
            lineOfCodeRepository.save(lineOfCode);
        }

        // commitScore 저장
        CommitScoreDto commitScoreDto = ((AiResultDto) redisData.get("result")).getCommitScore();
        commitScoreRepository.save(CommitScore.builder()
                        .repoView(repoView)
                        .scoreReadability(commitScoreDto.getReadability())
                        .scorePerformance(commitScoreDto.getPerformance())
                        .scoreReusability(commitScoreDto.getReusability())
                        .scoreTestability(commitScoreDto.getTestability())
                        .scoreException(commitScoreDto.getException())
                        .scoreTotal(commitScoreDto.getTotal())
                        .scoreComment(commitScoreDto.getScoreComment())
                .build());

    }

    private RepoInfo getRepoInfo(Map<Object, Object> redisData) {
        String redisProjectId = (String) redisData.get("projectId");
        // gitHub
        if (redisProjectId == null) { // ex: https://api.github.com/repos/rlagkdud/Spring-Pay-System
            // 0. repoCodeId
            Code repoCode = codeRepository.findByCodeId(1002L).orElseThrow(() -> new BaseException(StatusCode.NOT_FOUND_PLAT));

            // 1. repoPath로부터 사용자 이름과 레포이름을 받아오기
            String repoPath = (String) redisData.get("repoPath");
            String[] split = repoPath.split("/");
            String repoName = split[split.length - 1];
            String userName = split[split.length - 2];

            // 2. redis에서 repoReadmeOrigin
            String repoReadmeOrigin = ((AiResultDto) redisData.get("result")).getReadme();
            // 3. repoCommitCnt 가져오기
            Long repoCommitCnt = ((AiResultDto) redisData.get("result")).getTotalCommitCnt();

            // 4.
            // github api 요청 보내 repoStartDate, repoEndDate, repoMemberCnt 받아오기
            JsonObject jsonObject = getJsonObject(gitHubApiUrl + "/repos/" + userName + "/" + repoName);

            // 4-1. repoStartDate
            // 4-2. repoEndDate
            Map<String, LocalDate> projectPeriod = getGetProjectPeriod(jsonObject, "created_at", "pushed_at");

            // 4-3. contributors
            Integer repoMemberCnt = getRepoMemberCnt(gitHubApiUrl + "/repos/" + userName + "/" + repoName + "/" + "contributors");

            return RepoInfo.builder()
                    .repoCode(repoCode)
                    .repoPath(repoPath)
                    .repoReadmeOrigin(repoReadmeOrigin)
                    .repoCommitCnt(repoCommitCnt)
                    .repoStartDate(projectPeriod.get("repoStartDate"))
                    .repoEndDate(projectPeriod.get("repoEndDate"))
                    .repoMemberCnt(repoMemberCnt)
                    .build();
        }

        // gitLab {
        else { // ex; https://lab.ssafy.com/api/v4/projects/565790
            // 0. repoCodeId
            Code repoCode = codeRepository.findByCodeId(1003L).orElseThrow(() -> new BaseException(StatusCode.NOT_FOUND_PLAT));

            // 1. repoPath
            String repoPath = (String) redisData.get("repoPath"); //https://lab.ssafy.com/s10-final/S10P31E101
            String[] split = repoPath.split("/");
            String projectId = split[split.length - 1];
            String projectUrl = split[split.length - 5];

            // 2 repoReadmeOrigin
            String repoReadmeOrigin = ((AiResultDto) (redisData.get("result"))).getReadme();

            // 3. repoCommitCnt
            Long repoCommitCnt = ((AiResultDto) (redisData.get("result"))).getTotalCommitCnt();

            // 4.
            // gitLab api 요청 보내 repoStartDate, repoEndDate, repoMemberCnt 받아오기
            String gitLabApiUrl = "https://" + projectUrl + "/api/v4/projects/" + projectId;
            JsonObject jsonObject = getJsonObject(gitLabApiUrl);

            // 4-1. repoStartDate
            // 4-2. repoEndDate
            Map<String, LocalDate> projectPeriod = getGetProjectPeriod(jsonObject, "created_at", "updated_at");


            // 4-3. repoMemberCnt
            Integer repoMemberCnt = getRepoMemberCnt(gitLabApiUrl + "/" + "contributors");

            return RepoInfo.builder()
                    .repoCode(repoCode)
                    .repoPath(repoPath)
                    .repoReadmeOrigin(repoReadmeOrigin)
                    .repoCommitCnt(repoCommitCnt)
                    .repoStartDate(projectPeriod.get("repoStartDate"))
                    .repoEndDate(projectPeriod.get("repoEndDate"))
                    .repoMemberCnt(repoMemberCnt)
                    .build();

        }
    }

    private Map<String, LocalDate> getGetProjectPeriod(JsonObject jsonObject, String startDateKey, String
            endDateKey) {
        // 문자열을 LocaDateTime으로 바꾸기 위한 formatter
        DateTimeFormatter formatter = DateTimeFormatter.ISO_INSTANT;
        // 4-1. repoStartDate
        String repoStartDateStr = jsonObject.get(startDateKey).getAsString();
        Instant startInstant = Instant.parse(repoStartDateStr);
        LocalDate repoStartDate = startInstant.atZone(ZoneId.systemDefault()).toLocalDate();


        // 4-2. repoEndDate
        String repoEndDateStr = jsonObject.get(endDateKey).getAsString();
        Instant endInstant = Instant.parse(repoEndDateStr);
        LocalDate repoEndDate = endInstant.atZone(ZoneId.systemDefault()).toLocalDate();

        Map<String, LocalDate> map = new HashMap<>();
        map.put("repoStartDate", repoStartDate);
        map.put("repoEndDate", repoEndDate);

        return map;
    }

    private JsonObject getJsonObject(String url) {
        String jsonStrResponse = webClient.get()
                .uri(url)
                .header("Authorization", "Bearer " + githubToken)  // Authorization 헤더 추가
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()  // 응답을 검색
                .bodyToMono(String.class)  // 응답 본문을 String의 Mono로 변환
                .block();  // Mono를 블로킹하여 실제 값 가져오기

        if (jsonStrResponse == null) throw new BaseException(StatusCode.DATA_NOT_EXIST);

        // 문자열 -> json object
        return JsonParser.parseString(jsonStrResponse).getAsJsonObject();
    }

    private Integer getRepoMemberCnt(String url) {
        // 4-3. contributors
        String jsonStrResponse = webClient.get()
                .uri(url)
                .header("Authorization", "Bearer " + githubToken)  // Authorization 헤더 추가
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()  // 응답을 검색
                .bodyToMono(String.class)  // 응답 본문을 String의 Mono로 변환
                .block();  // Mono를 블로킹하여 실제 값 가져오기

        if (jsonStrResponse == null) throw new BaseException(StatusCode.DATA_NOT_EXIST);

        // 문자열 -> json object
        JsonElement jsonElement = JsonParser.parseString(jsonStrResponse);

        // contributor cnt
        Integer repoMemberCnt = 0;
        if (jsonElement.isJsonArray()) {
            JsonArray jsonArray = jsonElement.getAsJsonArray();
            repoMemberCnt = jsonArray.size();
        } else {
            throw new BaseException(StatusCode.CANNOT_GET_CONTRIBUTOR);
        }
        return repoMemberCnt;
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
        // TODO: projectId(github/gitlab) (있으면 gitLab, 없으면 gitHub)받아오기 - 아마 dto도 바꿔야 할거야.

        Member member = null;

//        // projectId githb, gitlab 인지 판단하기
//        if(analysisReqDto.getProjectId() == null) codeId = 1002L;
//        else codeId = 1003L;

//        if (!platformIdSet.contains(codeId)) {
//            throw new BaseException(StatusCode.REPO_PLAT_NOT_EXIST);
//        }

        String projectId = analysisReqDto.getProjectId();

        // isOwn 값 처리하기
        Boolean isOwn = accountLinkRepository.existsAccountLinkByMemberAndAccountLinkAccountId(member, analysisReqDto.getUserName());

        // analysisId 만들기
        String analysisId = UUID.randomUUID().toString();

        // redis에 저장할 수 있는 값 저장하기
        // key: analysisId, fields:repoPath, useranme, memaberId, isOwn, percent 0
        // Redis에 저장하기 전에 객체의 모든 데이터를 JSON 형식으로 저장하도록 설정
        HashMap<String, Object> map = new HashMap<>();
        map.put("repoPath", analysisReqDto.getRepoUrl());
        map.put("projectId", projectId);
        map.put("userName", analysisReqDto.getUserName());
        map.put("memberId", member.getMemberId());
//        map.put("codeId", codeId);
        map.put("isOwn", isOwn.toString()); // Boolean 값을 문자열로 저장
        map.put("percentage", "0"); // 초기 비율을 문자열로 저장

        redisTemplateRepo.opsForHash().putAll(analysisId, map);
        redisTemplateRepo.expire(analysisId, 24, TimeUnit.HOURS); // 레디스에 보관하고 있을 시간

        // AI 서버로 요청 보내기 (body: repoUrl, userName, memberId, isOwn)
        // platform code에 따라 요청 보낼 url 분기처리
        String aiUrl = "";
        if (projectId == null) aiUrl = aiServerUrl + "/github";
        else aiUrl = aiServerUrl + "/gitlab";

        String response = webClient.post()
                .uri(aiUrl)
                .contentType(MediaType.APPLICATION_JSON)
                .body(Mono.just(
                        AiAnalysisReqDto.builder()
                                .repoUrl(analysisReqDto.getRepoUrl())
                                .projectId(projectId)
                                .userName(analysisReqDto.getUserName())
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
        Map<Object, Object> redisData = redisTemplateRepo.opsForHash().entries(analysisId);

        // redis에서 analysisId에 해당하는 요소를 가져온다.
        String redisRepoPath = (String) redisData.get("repoPath");
        if (redisRepoPath == null) {
            throw new BaseException(StatusCode.REPO_VIEW_NOT_FOUND);
        }


        // memberId와 요소의 memberId의 일치여부를 확인한다.
        Long redisMemberId = ((Integer) redisData.get("memberId")).longValue();
        if (!Objects.equals(memberId, redisMemberId)) {
            // 일치하지 않으면 예외 발생
            throw new BaseException(StatusCode.REPO_REQ_MEMBER_NOT_MATCH);
        }

        // 일치하면 요소에서 percentage를 가져온다.
        // percentage가 100이 아니면, AnalysisResultDto 반환한다.
        AnalysisResultDto analysisResultDto = AnalysisResultDto.builder()
                .repoPath(redisRepoPath)
                .projectId((String) redisData.get("projectId"))
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

    public RepoDetailResDto readRepoView(Long memberId, Long repoViewId) {
        // 레포 뷰 존재 여부 확인
        RepoView repoView = repoViewRepository.findById(repoViewId).orElseThrow(()->new BaseException(StatusCode.REPO_VIEW_NOT_FOUND));


        // 현재 로그인한 memberId와 레포 뷰의 주인 매치 여부 확인
        Boolean isMine = false;
        if(memberId == repoView.getMember().getMemberId()) isMine = true;

        // 레포 카드
        List<RepoViewSkill> repoViewSkillList = repoViewSkillRepository.findAllByRepoView(repoView);
        List<String> skillNameList = new ArrayList<>();
        for(RepoViewSkill repoViewSkill : repoViewSkillList){
            skillNameList.add(repoViewSkill.getSkillCode().getCodeName());
        }

        RepoCardDto repoCardDto = RepoCardDto.builder()
                .memberId(repoView.getMember().getMemberId())
                .memberNickname(repoView.getMember().getMemberNickname())
                .memberImg(repoView.getMember().getMemberImg())
                .repoViewId(repoViewId)
                .repoViewTitle(repoView.getRepoViewTitle())
                .repoViewSubtitle(repoView.getRepoViewSubtitle())
                .skillList(skillNameList)
                .repoStartDate(repoView.getRepoStartDate())
                .repoEndDate(repoView.getRepoEndDate())
                .isMine(isMine)
                .build();

        // 베이직 디테일
        // - commentList
        List<Comment> commentList = commentRepository.findAllByRepoView(repoView);
        List<CommitCommentDto> commentDtoList = new ArrayList<>();
        for(Comment comment : commentList){
            commentDtoList.add(comment.convertToDto());
        }
        // - repoViewTotalCommitCnt
        // - repoLineCntMap
        List<LineOfCode> lineOfCodeList = lineOfCodeRepository.findAllByRepoView(repoView);
        Map<String, CodeCntDto> lineCntMap = new HashMap<>();
        for(LineOfCode loc : lineOfCodeList){
            String codeName = loc.getSkillCode().getCodeName();
            CodeCntDto codeCntDto = CodeCntDto.builder()
                    .codeName(codeName)
                    .lineCnt(loc.getLineCount())
                    .build();
            lineCntMap.put(codeName, codeCntDto);
        }

        BasicDetailDto basicDetailDto = BasicDetailDto.builder()
                .repoReadme(repoView.getRepoViewReadme())
                .repoViewResult(repoView.getRepoViewResult())
                .commentList(commentDtoList)
                .repoViewTotalCommitCnt(repoView.getRepo().getRepoCommitCnt())
                .repoViewCommitCnt(repoView.getRepoViewCommitCnt())
                .repoViewMemberCnt(repoView.getRepo().getRepoMemberCnt())
                .repoLineCntMap(lineCntMap)
                .build();

        // 커밋 스코어 디티오
        CommitScore commitScore = commitScoreRepository.findByRepoView(repoView)
                .orElseThrow(()->new BaseException(StatusCode.REPO_COMMIT_SCORE_NOT_EXIST));

        return RepoDetailResDto.builder()
                .repoCardDto(repoCardDto)
                .basicDetailDto(basicDetailDto)
                .commitScoreDto(commitScore.converToDto())
                .build();
    }

    public void test() {
        CommitScoreDto commitScoreDto = CommitScoreDto.builder()
                .readability((short) 10)
                .performance((short) 20)
                .reusability((short) 30)
                .testability((short) 40)
                .exception((short) 50)
                .total((short) 30)
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
                .repoPath("https://github.com/rlagkdud/Spring-Pay-System")
                .projectId(null)
                .userName("rlagkdud")
                .memberId(7L)
                .isOwn(true)
                .percentage(100)
                .result(resultTest)
                .build();

        Map<String, Object> map = new HashMap<>();
        map.put("repoPath", analysisResultDtoTest.getRepoPath());
        map.put("projectId", analysisResultDtoTest.getProjectId());
        map.put("userName", analysisResultDtoTest.getUserName());
        map.put("memberId", analysisResultDtoTest.getMemberId());
        map.put("isOwn", analysisResultDtoTest.getIsOwn());
        map.put("percentage", analysisResultDtoTest.getPercentage());
        map.put("result", analysisResultDtoTest.getResult());  // 'result' is another complex object, serialized as JSON


        String analysisId = UUID.randomUUID().toString();
        redisTemplateRepo.opsForHash().putAll(analysisId, map);

        System.out.println("json 저장 완료");
        // =============== testData
    }
}
