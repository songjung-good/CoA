package com.dev101.coa.domain.repo.service;

import com.dev101.coa.domain.code.dto.CodeCntDto;
import com.dev101.coa.domain.code.dto.CodeDto;
import com.dev101.coa.domain.code.entity.Code;
import com.dev101.coa.domain.code.repository.CodeRepository;
import com.dev101.coa.domain.member.entity.AccountLink;
import com.dev101.coa.domain.member.entity.Alarm;
import com.dev101.coa.domain.member.entity.Member;
import com.dev101.coa.domain.member.repository.AccountLinkRepository;
import com.dev101.coa.domain.member.repository.AlarmRepository;
import com.dev101.coa.domain.member.repository.MemberRepository;
import com.dev101.coa.domain.redis.RedisRepoRepository;
import com.dev101.coa.domain.redis.RedisResult;
import com.dev101.coa.domain.repo.dto.*;
import com.dev101.coa.domain.repo.entity.*;
import com.dev101.coa.domain.repo.repository.*;
import com.dev101.coa.global.common.StatusCode;
import com.dev101.coa.global.exception.BaseException;
import com.dev101.coa.global.security.service.EncryptionUtils;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RepoService {


    @Value("${url.ai}")
    private String aiServerUrl;

    @Value("${url.gitHubApi}")
    private String gitHubApiUrl;


    private final RepoRepository repoRepository;
    private final RepoViewRepository repoViewRepository;
    private final CommentRepository commentRepository;
    private final RepoViewSkillRepository repoViewSkillRepository;
    private final CodeRepository codeRepository;
    private final AccountLinkRepository accountLinkRepository;
    private final MemberRepository memberRepository;
    private final LineOfCodeRepository lineOfCodeRepository;
    private final CommitScoreRepository commitScoreRepository;
    private final AlarmRepository alarmRepository;

    private final RedisRepoRepository redisRepoRepository;

    // AI server 통신을 위한 WebClient
    private final WebClient webClient;

    // 토큰 복호화를 위한 클래스
    private final EncryptionUtils encryptionUtils;


    public void editReadme(Long memberId, Long repoViewId, String editReadmeReq) {
        Member loginMember = memberRepository.findById(memberId).orElseThrow(() -> new BaseException(StatusCode.MEMBER_NOT_EXIST));

        // 레포 뷰 존재 유무 확인
        RepoView repoView = repoViewRepository.findByRepoViewId(repoViewId)
                .orElseThrow(() -> new BaseException(StatusCode.REPO_VIEW_NOT_FOUND));

        // 로그인 사용자 예외 처리 (작성자 확인)
        if (loginMember.getMemberId() != repoView.getMember().getMemberId()) {
            throw new BaseException(StatusCode.MEMBER_NOT_OWN_REPO);
        }

        // 레포 뷰
        repoView.updateReadme(editReadmeReq);
        repoRepository.save(repoView.getRepo());
    }

    public void editComment(Long currentMemberId, Long repoViewId, List<CommitCommentDto> editCommentListReq) {
        Member loginMember = memberRepository.findById(currentMemberId).orElseThrow(() -> new BaseException(StatusCode.MEMBER_NOT_EXIST));

        RepoView repoView = repoViewRepository.findById(repoViewId).orElseThrow(() -> new BaseException(StatusCode.REPO_VIEW_NOT_FOUND));

        // 본인의 레포 뷰인지 확인
        if (loginMember.getMemberId() != repoView.getMember().getMemberId()) {
            throw new BaseException(StatusCode.MEMBER_NOT_OWN_REPO);
        }

        // 수정
        // commentList db 내의 코멘트 목록을 삭제
        List<Long> commentIdList = repoView.getCommentList().stream()
                .map(Comment::getCommentId)
                .collect(Collectors.toList());

        commentIdList.forEach(commentRepository::deleteById);

        // 요청으로 받은 commitcommentList 저장
        List<Comment> commentList = new ArrayList<>();
        editCommentListReq.forEach((cd -> {
            Comment comment = Comment.builder()
                    .repoView(repoView)
                    .commentStartIndex(cd.getCommentStartIndex())
                    .commentEndIndex(cd.getCommentEndIndex())
                    .commentTargetString(cd.getCommentTargetString())
                    .commentContent(cd.getCommentContent())
                    .build();
            System.out.println("comment = " + comment);
            commentList.add(comment);
            commentRepository.save(comment);
        }));


        // 저장
        repoView.updateCommentList(commentList);
        repoRepository.save(repoView.getRepo());


    }

    public void editRepoCard(Long currentMemberId, Long repoViewId, RepoCardEditReqDto repoCardEditReqDto) {
        Member loginMember = memberRepository.findById(currentMemberId).orElseThrow(() -> new BaseException(StatusCode.MEMBER_NOT_EXIST));

        RepoView repoView = repoViewRepository.findById(repoViewId).orElseThrow(() -> new BaseException(StatusCode.REPO_VIEW_NOT_FOUND));

        // 본인의 레포 뷰인지 확인
        if (loginMember.getMemberId() != repoView.getMember().getMemberId()) {
            throw new BaseException(StatusCode.MEMBER_NOT_OWN_REPO);
        }

        // 수정
        repoView.updateRepoCard(repoCardEditReqDto);

        // 스킬리스트 삭제 후 저장 수정
        // 요청으로 받은 codeList 삭제 후 저장
        List<RepoViewSkill> repoViewSkillList = new ArrayList<>();
        List<Long> skillIdList = repoView.getRepoViewSkillList().stream()
                .map(RepoViewSkill::getSkillId)
                .toList();

        skillIdList.forEach(repoViewSkillRepository::deleteById);

        if (!repoCardEditReqDto.getSkillIdList().isEmpty()) {

            repoCardEditReqDto.getSkillIdList().forEach((codeId) -> {
                Code code = codeRepository.findByCodeId(codeId).orElseThrow(() -> new BaseException(StatusCode.CODE_NOT_FOUND));
                RepoViewSkill repoviewSkill = RepoViewSkill.builder()
                        .repoView(repoView)
                        .skillCode(code)
                        .build();
                repoViewSkillList.add(repoviewSkill);
                repoViewSkillRepository.save(repoviewSkill);
            });


            repoView.updateCodeList(repoViewSkillList);
        }

        repoRepository.save(repoView.getRepo());
        repoViewRepository.save(repoView);
    }

    public Long saveAnalysis(Long memberId, String analysisId, SaveAnalysisReqDto saveAnalysisReqDto) {

        // redis에서 analysisId 로 값 조회시 존재 여부 판단
        RedisResult redisData = redisRepoRepository.findById(analysisId).orElseThrow(() -> new BaseException(StatusCode.ANALYSIS_RESULT_NOT_EXIST));

        // 로그인 사용자와 분석 요구자 일치 여부 확인
        Member member = memberRepository.findByMemberId(memberId).orElseThrow(() -> new BaseException(StatusCode.MEMBER_NOT_EXIST));
        Long redisMemberId = redisData.getMemberId();
//        Long redisMemberId = ((Integer) redisData.get("memberId")).longValue();
        if (!memberId.equals(redisMemberId)) {
            throw new BaseException(StatusCode.REPO_REQ_MEMBER_NOT_MATCH);
        }

        // repo 저장(platformCodeId, repoPath, repoReadmeOrigin, repoCommtCnt,
        // - repoPath로 찾은 후, 존재하면 업데이트 존재하지 않으면 생성
        RepoInfo repoInfo = getRepoInfo(redisData);

        Repo repo = null;
        Optional<Repo> optionalRepo = repoRepository.findByRepoPath(redisData.getRepoPath());

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
                    .repoMemberCnt(redisData.getRepoMemberCnt())
                    .build();

            repoRepository.save(repo);
        }


        // repoView 저장
        // 분석 요구자와 레포의 주인이 일치하는 경우(redisData.get("isOwn") == true)만 저장
        if (!redisData.getIsOwn())
            throw new BaseException(StatusCode.CANNOT_SAVE_OTHERS_REPO_VIEW);

        List<Long> skillCodeIdList = saveAnalysisReqDto.getRepoViewSkillList();
        List<Code> skillCodeList = new ArrayList<>();
        for (Long id : skillCodeIdList) {
            Code code = codeRepository.findByCodeId(id).orElseThrow(() -> new BaseException(StatusCode.CODE_NOT_FOUND));
            skillCodeList.add(code);
        }
        AiResultDto aiResult = redisData.getResult();
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

        RepoView saveRepoView = repoViewRepository.save(repoView);


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
        for (Map.Entry<Long, Integer> entry : linesOfCodeList) {
            Code code = codeRepository.findByCodeId(entry.getKey()).orElseThrow(() -> new BaseException(StatusCode.CODE_NOT_FOUND));
            LineOfCode lineOfCode = LineOfCode.builder()
                    .repoView(repoView)
                    .skillCode(code)
                    .lineCount(entry.getValue())
                    .build();
            lineOfCodeRepository.save(lineOfCode);
        }

        // commitScore 저장
        CommitScoreDto commitScoreDto = redisData.getResult().getCommitScore();
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

        // 레디스에 임시 저장된 분석결과 삭제
        redisRepoRepository.deleteById(analysisId);

        return saveRepoView.getRepoViewId();

    }

    private RepoInfo getRepoInfo(RedisResult redisData) {
        Integer redisProjectId = redisData.getProjectId();

        // gitHub
        if (redisProjectId == null) { // ex: https://api.github.com/repos/rlagkdud/Spring-Pay-System
            // 0. repoCodeId
            Code repoCode = codeRepository.findByCodeId(1002L).orElseThrow(() -> new BaseException(StatusCode.NOT_FOUND_PLAT));

            // 1. repoPath로부터 사용자 이름과 레포이름을 받아오기
            String repoPath = redisData.getRepoPath();

            // 2. redis에서 repoReadmeOrigin
            String repoReadmeOrigin = redisData.getResult().getReadme();
            // 3. repoCommitCnt 가져오기
            Long repoCommitCnt = redisData.getResult().getTotalCommitCnt();

            return RepoInfo.builder()
                    .repoCode(repoCode) //
                    .repoPath(repoPath)
                    .repoReadmeOrigin(repoReadmeOrigin)
                    .repoCommitCnt(repoCommitCnt)
                    .repoMemberCnt(redisData.getRepoMemberCnt())
                    .build();

        }

        // gitLab {
        else { // ex; https://lab.ssafy.com/api/v4/projects/565790
            // 0. repoCodeId
            Code repoCode = codeRepository.findByCodeId(1003L).orElseThrow(() -> new BaseException(StatusCode.NOT_FOUND_PLAT));

            // 1. repoPath
            String repoPath = redisData.getRepoPath(); //https://lab.ssafy.com/s10-final/S10P31E101

            // 2 repoReadmeOrigin
            String repoReadmeOrigin = redisData.getResult().getReadme();

            // 3. repoCommitCnt
            Long repoCommitCnt = redisData.getResult().getTotalCommitCnt();

            // 4.
            // gitLab api 요청 보내 repoStartDate, repoEndDate, repoMemberCnt 받아오기

            return RepoInfo.builder()
                    .repoCode(repoCode)
                    .repoPath(repoPath)
                    .repoReadmeOrigin(repoReadmeOrigin)
                    .repoCommitCnt(repoCommitCnt)
                    .repoMemberCnt(redisData.getRepoMemberCnt())
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

    private JsonObject getJsonObject(String url, String accessToken){
        try {
            String jsonStrResponse = webClient.get()
                    .uri(url)
                    .header("Authorization", "Bearer " + accessToken)  // Authorization 헤더 추가
                    .accept(MediaType.APPLICATION_JSON)
                    .retrieve()  // 응답을 검색
                    .bodyToMono(String.class)  // 응답 본문을 String의 Mono로 변환
                    .block();  // Mono를 블로킹하여 실제 값 가져오기

            if (jsonStrResponse == null) throw new BaseException(StatusCode.DATA_NOT_EXIST);

            // 문자열 -> json object
            return JsonParser.parseString(jsonStrResponse).getAsJsonObject();
        } catch (Exception e) {
            System.out.println("e = " + e);
            throw new BaseException(StatusCode.RETRY_AI_ANALYSIS);
        }
    }

    private Integer getRepoMemberCnt(String url, String accessToken) {
        // 4-3. contributors
        String jsonStrResponse = webClient.get()
                .uri(url)
                .header("Authorization", "Bearer " + accessToken)  // Authorization 헤더 추가
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
    public String startAnalysis(Long memberId, AnalysisReqDto analysisReqDto) throws Exception {

        // 로그인한 member 받아오기
        Member member = memberRepository.findByMemberId(memberId).orElseThrow(() -> new BaseException(StatusCode.MEMBER_NOT_EXIST));

        Integer projectId = analysisReqDto.getProjectId();

        // isOwn 값 처리하기 : 로그인한 사용자의 본인 레포를 분석하는지 여부
        Boolean isOwn = accountLinkRepository.existsAccountLinkByMemberAndAccountLinkNickname(member, analysisReqDto.getUserName());

        // analysisId 만들기
        String analysisId = UUID.randomUUID().toString();

        // redis에 저장할 수 있는 값 저장하기
        // key: analysisId, fields:repoPath, useranme, memaberId, isOwn, percent 0, repoStartDate, repoEndDate
        Map<String, LocalDate> projectPeriod;
        Integer repoMemberCnt;

        // ai 서버 요청 디티오
        AiGithubAnalysisReqDto githubAnalysisReqDto = null;
        AiGitlabAnalysisReqDto gitlabAnalysisReqDto = null;

        // 키 초기화
        encryptionUtils.init();

        if (analysisReqDto.getProjectId() == null) { // github
            // 엑세스 토큰 가져오기
            Code code = codeRepository.findById(1002L).orElseThrow(() -> new BaseException(StatusCode.CODE_NOT_FOUND));
            AccountLink accountLink = accountLinkRepository.findByMemberAndCode(member, code).orElseThrow(() -> new BaseException(StatusCode.ACCOUNT_LINK_NOT_EXIST));

            String accessToken = encryptionUtils.decrypt(accountLink.getAccountLinkReceiveToken());

            String[] split = analysisReqDto.getRepoUrl().split("/");
            String repoName = split[split.length - 1];
            String userName = split[split.length - 2];

            JsonObject jsonObject = getJsonObject(gitHubApiUrl + "/repos/" + userName + "/" + repoName, accessToken);
//            JsonObject jsonObject = getJsonObject(gitHubApiUrl + "/repos/" + "ffjfjfjjfjffjfjffjfjfjfjffjjfjfjfjfjfjfjfjjfjfjf" + "/" + "Spring-Pay-System", accessToken);

            projectPeriod = getGetProjectPeriod(jsonObject, "created_at", "pushed_at");

            repoMemberCnt = getRepoMemberCnt(gitHubApiUrl + "/repos/" + userName + "/" + repoName + "/" + "contributors", accessToken);

            // ai 요청 디티오
            githubAnalysisReqDto = AiGithubAnalysisReqDto.builder()
                    .analysisId(analysisId)
                    .repoPath(analysisReqDto.getRepoUrl())
                    .userName(analysisReqDto.getUserName())
                    .accessToken(accessToken)
                    .build();

        } else { // gitlab
            // 엑세스 토큰 가져오기
            Code code = codeRepository.findById(1003L).orElseThrow(() -> new BaseException(StatusCode.CODE_NOT_FOUND));
            AccountLink accountLink = accountLinkRepository.findByMemberAndCode(member, code).orElseThrow(() -> new BaseException(StatusCode.ACCOUNT_LINK_NOT_EXIST));

            String accessToken = encryptionUtils.decrypt(accountLink.getAccountLinkReceiveToken());

            String[] split = analysisReqDto.getRepoUrl().split("/");
            String baseUrl = split[split.length - 5];
            String gitLabApiUrl = "https://" + baseUrl + "/api/v4/projects/" + projectId;

            JsonObject jsonObject = getJsonObject(gitLabApiUrl, accessToken);
            projectPeriod = getGetProjectPeriod(jsonObject, "created_at", "updated_at");

            repoMemberCnt = getRepoMemberCnt(gitLabApiUrl + "/" + "contributors", accessToken);

            // ai 요청 디티오
            gitlabAnalysisReqDto = AiGitlabAnalysisReqDto.builder()
                    .analysisId(analysisId)
                    .baseUrl(baseUrl)
                    .projectId(projectId)
                    .userName(analysisReqDto.getUserName())
                    .privateToken(accessToken)
                    .build();
        }


        // Redis에 저장하기 전에 객체의 모든 데이터를 JSON 형식으로 저장하도록 설정
        redisRepoRepository.save(RedisResult.builder()
                .analysisId(analysisId)
                .repoPath(analysisReqDto.getRepoUrl())
                .projectId(projectId)
                .userName(analysisReqDto.getUserName())
                .memberId(member.getMemberId()) // 분석 요청자
                .isOwn(isOwn)
                .percentage(0)
                .repoStartDate(projectPeriod.get("repoStartDate"))
                .repoEndDate(projectPeriod.get("repoEndDate"))
                .repoMemberCnt(repoMemberCnt)
                .status("000")
                .expireSec(86400L)
                .build());

        // AI 서버로 요청 보내기 (body: repoUrl, userName, memberId, isOwn)
        // platform code에 따라 요청 보낼 url 분기처리
        String response;
        if (projectId == null) {
            String aiUrl = aiServerUrl + "/analysis/github";

            response = webClient.post()
                    .uri(aiUrl)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Mono.just(
                            githubAnalysisReqDto
                    ), AiGithubAnalysisReqDto.class)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
        } else {
            String aiUrl = aiServerUrl + "/analysis/gitlab";

            response = webClient.post()
                    .uri(aiUrl)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Mono.just(
                            gitlabAnalysisReqDto
                    ), AiGitlabAnalysisReqDto.class)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
        }

        if (response.equals("false")) {
            throw new BaseException(StatusCode.AI_SERVER_ERROR);
        }

        return analysisId;
    }

    public RepoDetailResDto getDoneAnalysis(Long memberId, String analysisId) {

        // redis에서 analysisId에 해당하는 요소를 가져온다.
        RedisResult redisData = redisRepoRepository.findById(analysisId).orElseThrow(() -> new BaseException(StatusCode.ANALYSIS_RESULT_NOT_EXIST));
        String redisRepoPath = redisData.getRepoPath();


        // 분석 결과 title에 쓰일 레포 이름을 가져온다.
        String[] split = redisRepoPath.split("/");
        String title = split[split.length - 1];


        // memberId와 요청한 memberId의 일치여부를 확인한다.(로그인한 유저와 분석 요청자 일치 여부 확인)
        Long redisMemberId = redisData.getMemberId();
        if (!Objects.equals(memberId, redisMemberId)) {
            // 일치하지 않으면 예외 발생
            throw new BaseException(StatusCode.REPO_REQ_MEMBER_NOT_MATCH);
        }

        // 일치하면 완성된 분석 결과를 반환한다. (로그인한 멤버가 분석 요청 멤버임이 확인 됨)
        // isMine이 true이면, 커밋스코어까지 반환하고, 아니면 커밋스코은 반환하지 않는다.

        // isMine: 분석 요청자가 자신의 레포를 분석하는지 여부
        Boolean isMine = redisData.getIsOwn();

        // RepoCardDto(repoPath, repoTitle,repoStartDate, repoEndDate, isMine)
        RepoCardDto repoCardDto = RepoCardDto.builder()
                .repoViewPath(redisRepoPath)
                .repoViewTitle(title)
                .repoMemberCnt(redisData.getRepoMemberCnt())
                .repoStartDate(redisData.getRepoStartDate())
                .repoEndDate(redisData.getRepoEndDate())
                .isMine(isMine)
                .build();

        // BasicDetailDto
        AiResultDto aiResult = redisData.getResult();
        BasicDetailDto basicDetailDto = BasicDetailDto.builder()
                .repoReadme(aiResult.getReadme())
                .repoViewResult(aiResult.getRepoViewResult())
                .repoViewTotalCommitCnt(aiResult.getTotalCommitCnt())
                .repoViewCommitCnt(aiResult.getPersonalCommitCnt())
                .repoViewMemberCnt(redisData.getRepoMemberCnt())
                .build();

        if (!isMine) {
            return RepoDetailResDto.builder()
                    .repoCardDto(repoCardDto)
                    .basicDetailDto(basicDetailDto)
                    .build();
        }

        // CommitScoreDto
        CommitScoreDto commitScoreDto = aiResult.getCommitScore();
        return RepoDetailResDto.builder()
                .repoCardDto(repoCardDto)
                .basicDetailDto(basicDetailDto)
                .commitScoreDto(commitScoreDto)
                .build();
    }


    public AnalysisCheckResDto checkAnalysis(Long memberId, String analysisId) {

        // redis에서 analysisId에 해당하는 요소를 가져온다.
        RedisResult redisData = redisRepoRepository.findById(analysisId).orElseThrow(() -> new BaseException(StatusCode.ANALYSIS_RESULT_NOT_EXIST));
        String redisRepoPath = redisData.getRepoPath();


        // memberId와 요소의 memberId의 일치여부를 확인한다.(로그인한 유저와 분석요청 유저의 일치 여부)
        Long redisMemberId = redisData.getMemberId();
        if (!Objects.equals(memberId, redisMemberId)) {
            // 일치하지 않으면 예외 발생
            throw new BaseException(StatusCode.REPO_REQ_MEMBER_NOT_MATCH);
        }

        // 분석 상태를 체크한다.
        // PROCESSING 이나 DONE 이 아니면 redis 데이터를 삭제하고 예외를 발생시킨다.
        if (!redisData.getStatus().equals("100") && !redisData.getStatus().equals("200")) {
            redisRepoRepository.deleteById(analysisId);
            throw new BaseException(StatusCode.RETRY_AI_ANALYSIS);
        }

        // 일치하면 요소에서 percentage를 가져온다.
        return AnalysisCheckResDto.builder()
                .analysisId(analysisId)
                .percentage(redisData.getPercentage())
                .build();
    }


    public RepoDetailResDto readRepoView(Long memberId, Long repoViewId) {
        // 레포 뷰 존재 여부 확인
        RepoView repoView = repoViewRepository.findById(repoViewId).orElseThrow(() -> new BaseException(StatusCode.REPO_VIEW_NOT_FOUND));
        Member member = memberRepository.findByMemberId(memberId).orElseThrow(() -> new BaseException(StatusCode.MEMBER_NOT_EXIST));

        // 레포 카드
        List<RepoViewSkill> repoViewSkillList = repoViewSkillRepository.findAllByRepoView(repoView);
        List<CodeDto> skillList = new ArrayList<>();
        for (RepoViewSkill repoViewSkill : repoViewSkillList) {
            skillList.add(repoViewSkill.getSkillCode().convertToDto());
        }

        RepoCardDto repoCardDto = RepoCardDto.createRepoCardDto(repoView, member.getMemberUuid());
        repoCardDto.updateSkillList(skillList);

        // 베이직 디테일
        // - commentList
        List<Comment> commentList = commentRepository.findAllByRepoView(repoView);
        List<CommitCommentDto> commentDtoList = new ArrayList<>();
        for (Comment comment : commentList) {
            commentDtoList.add(comment.convertToDto());
        }
        // - repoViewTotalCommitCnt
        // - repoLineCntList
        List<LineOfCode> lineOfCodeList = lineOfCodeRepository.findAllByRepoView(repoView);
        List<CodeCntDto> lineCntList = new ArrayList<>();
        for (LineOfCode loc : lineOfCodeList) {
            CodeCntDto codeCntDto = CodeCntDto.builder()
                    .codeName(loc.getSkillCode().getCodeName())
                    .lineCnt(loc.getLineCount())
                    .build();
            lineCntList.add(codeCntDto);
        }

        BasicDetailDto basicDetailDto = BasicDetailDto.builder()
                .repoReadme(repoView.getRepoViewReadme())
                .repoViewResult(repoView.getRepoViewResult())
                .commentList(commentDtoList)
                .repoViewTotalCommitCnt(repoView.getRepo().getRepoCommitCnt())
                .repoViewCommitCnt(repoView.getRepoViewCommitCnt())
                .repoViewMemberCnt(repoView.getRepo().getRepoMemberCnt())
                .repoLineCntList(lineCntList)
                .build();

        //  로그인한 유저 != 레포 주인 (commit score만 뺴고)
        if (!Objects.equals(memberId, repoView.getMember().getMemberId())) {

            // 알림 기능 추가
            Member loginMember = memberRepository.findById(memberId).orElseThrow(() -> new BaseException(StatusCode.MEMBER_NOT_EXIST));
            alarmRepository.save(Alarm.builder()
                    .alarmMember(loginMember)
                    .alarmRepoView(repoView)
                    .alarmTargetId(repoView.getMember().getMemberId())
                    .build());

            return RepoDetailResDto.builder()
                    .repoCardDto(repoCardDto)
                    .basicDetailDto(basicDetailDto)
                    .build();
        }

        // 커밋 스코어 디티오
        CommitScore commitScore = commitScoreRepository.findByRepoView(repoView)
                .orElseThrow(() -> new BaseException(StatusCode.REPO_COMMIT_SCORE_NOT_EXIST));

        //  로그인한 유저 == 레포 주인 (3가지 전부)
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

        RedisResult redisResult = RedisResult.builder()
                .repoPath("https://github.com/rlagkdud/Spring-Pay-System")
                .projectId(null)
                .userName("rlagkdud")
                .memberId(12L)
                .isOwn(true)
                .percentage(100)
                .repoStartDate(LocalDate.now())
                .repoEndDate(LocalDate.now())
                .result(resultTest)
                .repoMemberCnt(6)
                .status("200")
                .expireSec(86400L)
                .build();

        redisRepoRepository.save(redisResult);

        System.out.println("json 저장 완료");
        // =============== testData
    }

}
