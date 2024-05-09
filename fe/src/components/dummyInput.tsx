"use client";

import userStore from "@/store/user";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dummy() {
  const [UserName, setUserName] = useState("");
  const { githubUserName } = userStore();
  // userStore의 다른 속성 삭제하는지 관찰 필요
  const setGithubUserName = (newName: string) => {
    userStore.setState({ githubUserName: newName });
  };
  const router = useRouter();
  const onClick = () => {
    setGithubUserName(UserName);
    router.push(`/user/${UserName}`);
  };

  return (
    <label className="w-screen h-screen bg-black/50 z-20 absolute flex flex-col justify-center items-center">
      <div className="card flex flex-col">
        <p>Github Id를 입력해주세요</p>
        <input
          type="text"
          className="py-1 px-2 bg-appGrey2 rounded-xl"
          value={UserName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <button
          className="py-1 px-2 mt-4 bg-appGreen rounded-xl"
          onClick={onClick}
        >
          Github Id 입력
        </button>
      </div>
    </label>
  );
}
