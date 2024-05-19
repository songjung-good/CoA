import { useState } from "react";
import useResultStore from "@/store/result";
import CommitRate from "./CommitRate";

export default function ResultCommit() {
  const repo = useResultStore.getState().result.repoCardDto;
  const result = useResultStore.getState().result.basicDetailDto;
  const commentList = result.commentList;
  const [currentComment, setCurrentComment] = useState<Comment | null>(null);

  const parts = splitTextByComments(
    result.repoViewResult,
    commentList as Comment[],
  );

  const handleCommentClick = (comment: Comment) => {
    // 클릭된 코멘트가 이미 표시 중인 코멘트와 같다면 해제
    if (
      currentComment &&
      currentComment.commentContent === comment.commentContent
    ) {
      setCurrentComment(null);
    } else {
      setCurrentComment(comment);
    }
  };

  return (
    <div className="flex flex-col w-full justify-between">
      <div className="flex flex-col justify-evenly items-center min-h-80">
        <CommitRate />
        <div className="flex flex-col items-center">
          <p className=" mb-4">프로젝트에 사용한 언어</p>
          {repo.isMine ? (
            <p className="text-center whitespace-pre-wrap break-words">
              분석 결과를 저장하고 가장 많이 사용한 언어를 확인하세요
            </p>
          ) : (
            <p className="text-center whitespace-pre-wrap break-words">
              레포지토리 소유자에게만 공개되는 데이터 입니다.
            </p>
          )}
        </div>
      </div>
      <p className="text-base sm:text-xl lg:text-2xl mt-2">
        <span className="text-appBlue1">{repo.memberNickname}</span> 님의{" "}
        <span className="text-appBlue1">{repo.repoViewTitle}</span> 프로젝트
        분석결과
      </p>
      <div className="flex justify-center items-center w-full min-h-20 bg-white shadow-lg rounded-lg mt-2 text-xl lg:text-xl px-5 py-2">
        <div>
          {parts.map((part, index) =>
            part.isComment ? (
              <span
                key={index}
                className="text-appBlue1 relative cursor-pointer"
                onClick={() => part.comment && handleCommentClick(part.comment)}
              >
                {part.text}
                {currentComment &&
                  part.comment &&
                  currentComment.commentContent ===
                    part.comment.commentContent && (
                    <div
                      className="absolute -top-20 right-0 min-w-[300px] h-full bg-white bg-opacity-50 flex justify-center items-center"
                      onClick={() => setCurrentComment(null)}
                    >
                      <div className="bg-white p-4 shadow-xl rounded text-black text-center">
                        <p>{currentComment.commentContent}</p>
                      </div>
                    </div>
                  )}
              </span>
            ) : (
              <span key={index}>{part.text}</span>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

function splitTextByComments(text: string, comments: Comment[]) {
  let lastEnd = 0;
  const parts: { text: string; isComment: boolean; comment?: Comment }[] = [];

  // comments 배열이 유효한지 확인하고, 유효하지 않은 요소를 제거합니다.
  if (!comments) {
    comments = []; // 또는 적절한 기본값 할당
  } else {
    comments = comments.filter((comment) => comment != null);
  }

  // comments 배열을 시작 인덱스에 따라 정렬합니다.
  comments.sort((a, b) => a.commentStartIndex - b.commentStartIndex);

  comments.forEach((comment) => {
    if (comment.commentStartIndex > lastEnd) {
      parts.push({
        text: text.slice(lastEnd, comment.commentStartIndex),
        isComment: false,
      });
    }
    parts.push({
      text: text.slice(comment.commentStartIndex, comment.commentEndIndex),
      isComment: true,
      comment: comment,
    });
    lastEnd = comment.commentEndIndex;
  });

  if (lastEnd < text.length) {
    parts.push({
      text: text.slice(lastEnd),
      isComment: false,
    });
  }

  return parts;
}

interface Comment {
  commentStartIndex: number;
  commentEndIndex: number;
  commentContent: string;
}
