"use client";

import RepoInfo from "@/components/result/RepoInfo.tsx";
import ResultTap from "@/components/result/ResultTap.tsx";
import useResultStore from "@/store/result";

import "./_components/result.css";

export default function ResultPage({ params }: { params: { id: string } }) {
  const { isOwn } = useResultStore((state) => state); // 이후 유저닉네임으로 변경
  return (
    <div className="flex flex-col items-center bg-appGrey1 pt-5 p-10 w-full h-full">
      <p className="mb-5 text-xl font-bold sm:text-2xl">
        {`${isOwn}님의 레포지토리 분석 결과입니다.`}
      </p>
      <RepoInfo />
      <ResultTap />
    </div>
  );
}
