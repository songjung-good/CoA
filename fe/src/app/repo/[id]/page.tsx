"use client";

import RepoInfo from "./_components/RepoInfo";
import useRepoDetailStore from "@/store/repodetail";

export default function RepoPage({ params }: { params: { id: string } }) {
  const userNickName = useRepoDetailStore(
    (state) => state.result.repoCardDto.memberNickname,
  ); // 이후 유저닉네임으로 변경
  return (
    <div className="flex flex-col items-center bg-appGrey1 pt-5 p-10 w-full h-full">
      <div className="sm:w-4/5 lg:w-3/5 lg:min-w-760px">
        <p className="mb-5 text-xl font-bold sm:text-2xl text-center">
          {`${userNickName}님의 레포지토리 분석 결과입니다.`}
        </p>
        <RepoInfo />
        {/* <ResultTap /> */}
      </div>
    </div>
  );
}
