"use client";

import RepoEdit from "../_components/RepoEdit.tsx";
import RepoInfo from "@/components/result/RepoInfo.tsx";
import useResultStore from "@/store/result.ts";
import { useEffect } from "react";

export default function ReadmeEditPage() {
  const userNickName =
    useResultStore.getState().result.repoCardDto.memberNickname;

  useEffect(() => {
    console.log(userNickName);
  }, []);

  return (
    <div>
      <div className="flex flex-col items-center bg-appGrey1 pt-5 p-10 w-full h-full">
        {userNickName ? (
          <p className="mb-5 text-xl font-bold sm:text-2xl">
            {`${userNickName}님의 레포지토리 분석 결과입니다.`}
          </p>
        ) : (
          <p className="mb-5 text-xl font-bold sm:text-2xl">로딩 중...</p>
        )}
        <RepoInfo />
      </div>
    </div>
  );
}
