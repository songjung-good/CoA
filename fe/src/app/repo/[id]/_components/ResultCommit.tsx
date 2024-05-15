import { useState, useRef, useEffect } from "react";
import useRepoDetailStore from "@/store/repodetail";

export default function ResultCommit() {
  const repo = useRepoDetailStore.getState().result.repoCardDto;
  const result = useRepoDetailStore.getState().result.basicDetailDto;
  const commentList = result.commentList;
  const [currentComment, setCurrentComment] = useState<Comment | null>(null);
  const [modalPosition, setModalPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const parts = splitTextByComments(
    result.repoViewResult,
    commentList as Comment[],
  );

  const handleCommentClick = (comment: Comment, event: React.MouseEvent) => {
    // 클릭된 코멘트가 이미 표시 중인 코멘트와 같다면 해제
    if (
      currentComment &&
      currentComment.commentContent === comment.commentContent
    ) {
      setCurrentComment(null);
      setModalPosition(null);
    } else {
      setCurrentComment(comment);
      // 클릭된 텍스트의 위치를 기준으로 모달 위치 설정
      const rect = (event.target as HTMLElement).getBoundingClientRect();
      setModalPosition({
        top: rect.top - 10,
        left: rect.left + rect.width / 2,
      });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        currentComment &&
        !document
          .querySelector(".modal-content")
          ?.contains(event.target as Node)
      ) {
        setCurrentComment(null);
        setModalPosition(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [currentComment]);

  return (
    <div className="flex flex-col w-full justify-between">
      <div className="flex flex-col justify-center items-center min-h-80">
        커밋 그래프
      </div>
      <p className="text-base sm:text-xl lg:text-2xl mt-2">
        <span className="text-appBlue1">{repo.memberNickname}</span> 님의{" "}
        <span className="text-appBlue1">{repo.repoViewTitle}</span> 프로젝트
        분석결과
      </p>
      <div className="flex justify-center items-center w-full min-h-20 bg-white shadow-lg rounded-lg mt-2 text-xl lg:text-xl border hover:border-appBlue2">
        <div className="w-full flex justify-center">
          {parts.map((part, index) =>
            part.isComment ? (
              <span
                key={index}
                className="text-appBlue1 relative cursor-pointer"
                onClick={(event) =>
                  part.comment && handleCommentClick(part.comment, event)
                }
                style={{ whiteSpace: "pre-wrap" }} // 공백을 유지하기 위한 스타일 추가
              >
                {part.text}
                {currentComment &&
                  part.comment &&
                  currentComment.commentContent ===
                    part.comment.commentContent &&
                  modalPosition && (
                    <div
                      className="absolute bg-white p-4 shadow-lg rounded-lg border border-gray-300 text-gray-800 text-left min-w-[350px] w-fit break-words cursor-pointer modal-content"
                      onClick={() => setCurrentComment(null)}
                    >
                      <p className="font-semibold w-full">{`${currentComment.commentTargetString} 코멘트`}</p>
                      <p className="mt-2 text-sm">{`${currentComment.commentContent}`}</p>
                    </div>
                  )}
              </span>
            ) : (
              <span key={index} style={{ whiteSpace: "pre-wrap" }}>
                {part.text}
              </span>
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
  commentTargetString: string;
}
