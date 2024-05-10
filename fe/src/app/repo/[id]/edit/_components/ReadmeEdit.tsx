"use client";

// mdEditor-------------------------------------------
import type { NextPage } from "next";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
// mdEditor-------------------------------------------
import useRepoDetailStore from "@/store/repodetail";
import UseAxios from "@/api/common/useAxios";
import { useState, useEffect } from "react";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
});

const calculateHeight = (text: string) => {
  const lines = text.split("\n").length;
  const lineHeight = 25;
  const minEditorHeight = 600;
  const calculatedHeight = lines * lineHeight;

  return Math.max(calculatedHeight, minEditorHeight);
};

const ReadmeEdit: NextPage = () => {
  const [md, setMd] = useState<string | undefined>(
    useRepoDetailStore.getState().result.basicDetailDto.repoReadme,
  );
  const [editorHeight, setEditorHeight] = useState(calculateHeight(md || "")); // 초기 높이 계산
  const axiosInstance = UseAxios();

  // 수정 요청
  // const handleSave = async () => {
  //   const payload = { markdown: md };
  //   axiosInstance
  //     .put(`/api/repos/${repo_id}`, { payload })
  //     .then((res) => {
  //       console.log(res);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  useEffect(() => {
    setEditorHeight(calculateHeight(md || ""));
  }, [md]);
  return (
    <div className=" w-[80%]">
      <div className="flex flex-col justify-center items-center p-4 bg-white shadow-lg rounded-2xl mb-4">
        <MDEditor
          value={md}
          onChange={setMd}
          preview="live"
          height={editorHeight}
          style={{ width: "100%" }}
        />
      </div>
      <div className="flex justify-center">
        <button>리드미 저장</button>
      </div>
    </div>
  );
};

export default ReadmeEdit;
