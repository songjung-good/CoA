"use client";
import React, { useState, useRef, useEffect } from "react";
import useRepoDetailStore from "@/store/repodetail";
import CommentItem from "./CommentItem";
import UseAxios from "@/api/common/useAxios";
import { useParams } from "next/navigation";
import CommonButton from "@/components/result/CommonButton";

interface Comment {
  commentStartIndex: number;
  commentEndIndex: number;
  commentContent: string;
  commentTargetString: string;
}

interface RepoViewCommentProps {
  setShowModal: (show: boolean) => void;
}

const RepoViewComment: React.FC<RepoViewCommentProps> = ({ setShowModal }) => {
  const result = useRepoDetailStore.getState().result.basicDetailDto;

  const axios = UseAxios();
  const params = useParams();

  const [comments, setComments] = useState<Comment[]>([]);
  const [startIndex, setStartIndex] = useState<number | null>(null);
  const [endIndex, setEndIndex] = useState<number | null>(null);
  const [commentContent, setCommentContent] = useState("");
  const [commentTargetString, setcommentTargetString] = useState(""); // 선택한 텍스트를 저장할 상태
  const [warning, setWarning] = useState(""); // 경고 메시지를 저장할 상태
  const textRef = useRef<HTMLDivElement>(null);

  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (selection && textRef.current && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(textRef.current);
      preCaretRange.setEnd(range.startContainer, range.startOffset);
      const start = preCaretRange.toString().length;
      const end = start + range.toString().length;
      const text = selection.toString(); // 선택한 텍스트 추출

      setStartIndex(start);
      setEndIndex(end);
      setcommentTargetString(text); // 선택한 텍스트 상태 업데이트
      setWarning(""); // 경고 메시지 초기화
    }
  };

  const addComment = () => {
    if (startIndex !== null && endIndex !== null && commentContent) {
      const newComment = {
        commentStartIndex: startIndex,
        commentEndIndex: endIndex,
        commentContent,
        commentTargetString: commentTargetString,
      };
      setComments((prevComments) => [
        ...(Array.isArray(prevComments) ? prevComments : []),
        newComment,
      ]);
      setCommentContent(""); // 입력 필드 초기화
      setStartIndex(null);
      setEndIndex(null);
      setcommentTargetString("");
    } else {
      setWarning("선택한 텍스트와 코멘트 내용을 모두 입력해주세요."); // 경고 메시지 설정
    }
  };

  const deleteComment = (index: number) => {
    setComments((prevComments) =>
      prevComments.filter((_, idx) => idx !== index),
    );
  };

  useEffect(() => {
    // useResultStore에서 반환된 값을 배열로 확정
    const initialComments = useRepoDetailStore.getState().result.basicDetailDto
      .commentList as Comment[];
    setComments(Array.isArray(initialComments) ? initialComments : []);
  }, []);

  const handleSave = async () => {
    await axios
      .put(`/api/repos/comments/${params.id}`, comments)
      .then((res) => {
        // console.log(res.data);
        // console.log("코멘트 저장 성공");
      })
      .catch((err) => {
        console.log(err);
        console.log("코멘트 저장 실패");
      });

    await setShowModal(true);
  };

  return (
    <div className="w-4/5 flex flex-col items-center">
      <div className="flex justify-center items-center w-full min-h-20 p-5 bg-white shadow-lg rounded-lg mt-2 text-xl lg:text-xl">
        <div ref={textRef} onMouseUp={handleMouseUp}>
          {result.repoViewResult}
        </div>
      </div>
      {commentTargetString ? (
        <div className="mt-2 p-2 text-xl text-gray-600">
          "{commentTargetString}"
        </div>
      ) : warning ? (
        <div className="mt-2 p-2 text-xl text-red-500">{warning}</div>
      ) : (
        <div className="mt-2 p-2 text-xl text-gray-600">
          코멘트를 작성 할 텍스트를 선택해주세요.
        </div>
      )}
      <input
        type="text"
        value={commentContent}
        onChange={(e) => setCommentContent(e.target.value)}
        placeholder="코멘트를 작성해주세요."
        className="mt-2 p-2 w-full border rounded"
      />
      <button
        onClick={addComment}
        className="mt-2 p-2 bg-blue-500 text-white rounded"
      >
        추가하기
      </button>
      <hr className=" border-black w-full my-4" />
      {comments === null ? (
        <div>코멘트를 작성해주세요.</div>
      ) : (
        <div className="flex flex-col w-full">
          {comments.map((e, index) => (
            <CommentItem
              key={index}
              commentTargetString={e.commentTargetString}
              commentContent={e.commentContent}
              deleteComment={() => deleteComment(index)}
            />
          ))}
        </div>
      )}
      <div className="mb-4">
        <CommonButton onClick={handleSave} text="코멘트 저장" />
      </div>
    </div>
  );
};

export default RepoViewComment;
