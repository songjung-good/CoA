"use client";
import React, { useState, useRef } from "react";
import useResultStore from "@/store/result";

interface Comment {
  commentStartIndex: number;
  commentEndIndex: number;
  commentContent: string;
}

export default function RepoViewComment() {
  const result = useResultStore.getState().result.basicDetailDto;

  const [comments, setComments] = useState<Comment[]>([]);
  const [startIndex, setStartIndex] = useState<number | null>(null);
  const [endIndex, setEndIndex] = useState<number | null>(null);
  const [commentContent, setCommentContent] = useState("");
  const [selectedText, setSelectedText] = useState(""); // 선택한 텍스트를 저장할 상태
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
      setSelectedText(text); // 선택한 텍스트 상태 업데이트
    }
  };

  const addComment = () => {
    if (startIndex !== null && endIndex !== null && commentContent) {
      const newComment = {
        commentStartIndex: startIndex,
        commentEndIndex: endIndex,
        commentContent,
      };
      setComments((prevComments) => [...prevComments, newComment]);
      setCommentContent(""); // 입력 필드 초기화
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex justify-center items-center w-4/5 min-h-20 p-5 bg-white shadow-lg rounded-lg mt-2 text-xl lg:text-xl">
        <div ref={textRef} onMouseUp={handleMouseUp}>
          {result.repoViewResult}
        </div>
      </div>
      {selectedText && ( // 선택한 텍스트가 있으면 화면에 표시
        <div className="mt-2 text-gray-600">
          선택된 텍스트: "{selectedText}"
        </div>
      )}
      <input
        type="text"
        value={commentContent}
        onChange={(e) => setCommentContent(e.target.value)}
        placeholder="Enter comment here"
        className="mt-2 p-2 border rounded"
      />
      <button
        onClick={addComment}
        className="mt-2 p-2 bg-blue-500 text-white rounded"
      >
        Add Comment
      </button>
    </div>
  );
}
