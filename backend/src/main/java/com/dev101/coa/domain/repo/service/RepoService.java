package com.dev101.coa.domain.repo.service;

import com.dev101.coa.domain.code.entity.Code;
import com.dev101.coa.domain.code.repository.CodeRepository;
import com.dev101.coa.domain.repo.dto.CommitCommentDto;
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
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RepoService {

    private final RepoViewRepository repoViewRepository;
    private final CommentRepository commentRepository;
    private final RepoViewSkillRepository repoViewSkillRepository;
    private final CodeRepository codeRepository;

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

    public void saveAnalysis(Long repoViewId, Long analysisId) {
        // 레포 뷰 존재확인
        RepoView repoView = repoViewRepository.findByRepoViewId(repoViewId)
                .orElseThrow(() -> new BaseException(StatusCode.REPO_VIEW_NOT_FOUND));

        // TODO: 로그인 사용자 예외처리

        // 레디스에 저장된 정보 가져오기

        // mysql 디비에 저장
    }
}
