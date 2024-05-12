import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import useRepoDetailStore from "@/store/repodetail";
import UseAxios from "@/api/common/useAxios";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
});

const ReadmeEdit: NextPage = () => {
  const [md, setMd] = useState<string | undefined>("");
  const [editorHeight, setEditorHeight] = useState(600); // 기본 높이
  const axios = UseAxios();
  const params = useParams();

  useEffect(() => {
    // 초기 Markdown 데이터 로딩
    const readme =
      useRepoDetailStore.getState().result.basicDetailDto.repoReadme;
    setMd(readme);
    setEditorHeight(calculateHeight(readme || ""));
  }, [useRepoDetailStore]);

  const calculateHeight = (text: string) => {
    const lines = text.split("\n").length;
    const lineHeight = 25;
    const minEditorHeight = 600;
    const calculatedHeight = lines * lineHeight;
    return Math.max(calculatedHeight, minEditorHeight);
  };

  const handleSave = () => {
    const data = { readme: md };
    axios
      .put(`/api/repos/readme/${params.id}`, data)
      .then((res) => {
        console.log("리드미 변경 성공", res);
      })
      .catch((err) => {
        console.error("리드미 변경 실패", err);
      });
  };

  return (
    <div className="w-[80%]">
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
        <button onClick={handleSave}>리드미 저장</button>
      </div>
    </div>
  );
};

export default ReadmeEdit;
