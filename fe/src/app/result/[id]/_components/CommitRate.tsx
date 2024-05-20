import React from "react";
import useResultStore from "@/store/result";
import "./commit.css";

export default function CommitRate() {
  const repo = useResultStore.getState().result.repoCardDto;
  const result = useResultStore.getState().result.basicDetailDto;

  const contributionPercentage = Math.round(
    (result.repoViewCommitCnt / result.repoViewTotalCommitCnt) * 100,
  );

  return (
    <div className="flex flex-col w-full sm:w-1/2">
      <div className="flex justify-between items-center w-full ">
        <span className="text-sm sm:text-lg">
          {repo.memberNickname}님의 기여도
        </span>
        <span className="text-xl font-bold">{contributionPercentage}%</span>
      </div>
      <div className="bar w-full my-[2%]">
        <div
          className="bar-fill"
          style={{
            width: `${contributionPercentage}%`,
          }}
        ></div>
      </div>
      <div className="flex justify-between">
        <span>My Commits: {result.repoViewCommitCnt}</span>
        <span>Total Commits: {result.repoViewTotalCommitCnt}</span>
      </div>
    </div>
  );
}
