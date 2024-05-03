import { useState, useEffect } from "react";
import useResultStore from "@/store/result";

// mdEditor-------------------------------------------
import type { NextPage } from "next";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
// mdEditor-------------------------------------------

const testMd = `# 예제 프로젝트

이 저장소는 예제 웹 애플리케이션을 위한 것으로, 사용자 친화적인 기능을 구현하여 데이터 관리의 용이성을 증진시킵니다.

## 시작 방법

로컬 환경에서 이 프로젝트를 실행하기 위한 단계별 가이드입니다.

### 필요 조건

프로젝트를 시작하기 전에 다음이 설치되어 있어야 합니다:

- Node.js
- npm (Node.js 패키지 매니저)

### 설치하기

프로젝트 의존성을 설치하려면, 다음을 실행합니다:`;

// 줄 수 계산해서 에디터 높이 동적 구현
// 높이 계산 로직이나 이거에 대해서 추후 고민해볼 것
const calculateHeight = (text: string) => {
  const lines = text.split("\n").length;
  const lineHeight = 35;
  const minEditorHeight = 200;
  const calculatedHeight = lines * lineHeight;

  return Math.max(calculatedHeight, minEditorHeight);
};

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
});
const ResultReadme: NextPage = () => {
  const [md, setMd] = useState<string | undefined>(testMd);
  const { isOwn, setIsOther, setIsOwn } = useResultStore((state) => state);
  const [editorHeight, setEditorHeight] = useState(calculateHeight(md || "")); // 초기 높이 계산

  useEffect(() => {
    setEditorHeight(calculateHeight(md || ""));
  }, [md]);

  // MDEditor props는 노션에 정리해서 올려놨습니다.
  return (
    <div className="flex flex-col justify-center items-center w-full p-4 bg-white shadow-lg rounded-2xl">
      <MDEditor
        value={md}
        onChange={setMd}
        preview="preview"
        hideToolbar={true}
        height={editorHeight}
        style={{ width: "100%" }}
      />

      <div className=" ">
        <button onClick={setIsOwn}>본인</button>
        <button onClick={setIsOther}>타인</button>
      </div>
    </div>
  );
};

export default ResultReadme;
