import { useState, useEffect } from "react";
import useResultStore from "@/store/result";

// mdEditor-------------------------------------------
import type { NextPage } from "next";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
// mdEditor-------------------------------------------

// 줄 수 계산해서 에디터 높이 동적 구현
// 높이 계산 로직이나 이거에 대해서 추후 고민해볼 것
const calculateHeight = (text: string) => {
  const lines = text.split("\n").length;
  const lineHeight = 25;
  const minEditorHeight = 300;
  const calculatedHeight = lines * lineHeight;

  return Math.max(calculatedHeight, minEditorHeight);
};

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
});
const ResultReadme: NextPage = () => {
  const [md, setMd] = useState<string | undefined>(
    useResultStore.getState().result.basicDetailDto.repoReadme,
  );
  const isMine = useResultStore((state) => state.result.repoCardDto.isMine);
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
    </div>
  );
};

export default ResultReadme;
