import { useState, useEffect } from "react";
import useResultStore from "@/store/result";

// mdEditor-------------------------------------------
import type { NextPage } from "next";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
// mdEditor-------------------------------------------

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
});
const ResultReadme: NextPage = () => {
  const [md, setMd] = useState<string | undefined>("# Hello World");
  const { isOwn, setIsOther, setIsOwn } = useResultStore((state) => state);

  return (
    <div className="flex flex-col justify-center items-center w-3/4 p-4 bg-white shadow-lg rounded-2xl">
      <MDEditor value={md} onChange={setMd} />
      <div className=" ">
        <button onClick={setIsOwn}>본인</button>
        <button onClick={setIsOther}>타인</button>
      </div>
    </div>
  );
};

export default ResultReadme;
