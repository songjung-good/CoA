package com.dev101.coa.domain.repo.service;

import com.dev101.coa.domain.code.entity.Code;
import com.dev101.coa.domain.code.repository.CodeRepository;
import com.dev101.coa.domain.repo.dto.AnalysisResultDto;
import com.dev101.coa.domain.repo.dto.CommitCommentDto;
import com.dev101.coa.domain.repo.dto.CommitScoreDto;
import com.dev101.coa.domain.repo.dto.EditReadmeReqDto;
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
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RepoService {

    private final RepoViewRepository repoViewRepository;
    private final CommentRepository commentRepository;
    private final RepoViewSkillRepository repoViewSkillRepository;
    private final CodeRepository codeRepository;

    private final RedisTemplate<String, String> redisTemplate;
    private final RedisTemplate<Long, AnalysisResultDto> redisTemplateJson;


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

        // test) 레디스에 저장된 정보 가져오기
        ValueOperations<String, String> valueOps = redisTemplate.opsForValue();
        String value = valueOps.get("test_key");
        System.out.println("Value for key '" + "test_key" + "' is: " + value);


        // TODO:  test) 레디스에 json 저장해보기
        //    commitScoreDto done
        //    analysisResultDto done
        //    레디스에 json 저장 done
        //    저장된 json 조회해보기  done

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
        linesOfCode.put(3001L,11);
        linesOfCode.put(3002L, 22);

        AnalysisResultDto analysisResultDto = AnalysisResultDto.builder()
                .analysisId(1L)
                .memberId(1L)
                .isComplete(true)
                .readme("readme~ mario!")
                .repoViewResult("this is repoViewResult")
                .commitScore(commitScoreDto)
                .linesOfCode(linesOfCode)
                .build();

        redisTemplateJson.opsForValue().set(analysisResultDto.getAnalysisId(), analysisResultDto);

        System.out.println("json 저장 완료");

        System.out.println((AnalysisResultDto)redisTemplateJson.opsForValue().get(1L));

        // mysql 디비에 저장
    }
}
