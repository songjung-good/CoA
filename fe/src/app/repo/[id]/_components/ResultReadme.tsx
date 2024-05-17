import { useState, useEffect } from "react";
import useRepoDetailStore from "@/store/repodetail";
import dynamic from "next/dynamic";
import type { NextPage } from "next";

import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
});

const calculateHeight = (text: string) => {
  const lines = text.split("\n").length;
  const lineHeight = 35;
  const minEditorHeight = 300;
  const calculatedHeight = lines * lineHeight;
  return Math.max(calculatedHeight, minEditorHeight);
};

const ResultReadme: NextPage = () => {
  const [md, setMd] = useState<string | undefined>(
    useRepoDetailStore.getState().result.basicDetailDto.repoReadme,
  );
  const isMine = useRepoDetailStore((state) => state.result.repoCardDto.isMine);
  const [editorHeight, setEditorHeight] = useState(calculateHeight(md || ""));

  useEffect(() => {
    setEditorHeight(calculateHeight(md || ""));
  }, [md]);

  useEffect(() => {
    setMd(useRepoDetailStore.getState().result.basicDetailDto.repoReadme);
  }, []);

  const downloadMarkdown = () => {
    const element = document.createElement("a");
    const file = new Blob([md || ""], { type: "text/markdown" });
    const fileURL = URL.createObjectURL(file);
    element.href = fileURL;
    element.download = "README.md";
    document.body.appendChild(element); // Append the element to work in Firefox
    element.click();
    document.body.removeChild(element); // Clean up
    URL.revokeObjectURL(fileURL); // Free up the memory from the blob
  };

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
      {isMine && (
        <div className="mt-4">
          <button
            onClick={downloadMarkdown}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
          >
            <svg
              className="fill-current w-4 h-4 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
            </svg>
            <span>리드미 다운로드</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ResultReadme;
