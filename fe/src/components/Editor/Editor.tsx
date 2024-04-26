import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import * as commands from "@uiw/react-md-editor/commands"
import dynamic from "next/dynamic";
import { useState } from "react";

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor"),
  { ssr: false }
);

function Editor() {
  const [value, setValue] = useState("**Hello world!!!**");

  // 변경된 값을 인자로 받아 setValue를 호출하는 함수를 정의합니다.
  const handleChange = (newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      {/* onChange 이벤트에 handleChange 함수를 전달합니다. */}
      <MDEditor value={value} onChange={handleChange} />
    </div>
  );
}


export default Editor;
