"use client";

import tw from "tailwind-styled-components";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import useResultStore from "@/store/result.ts";
import ReadmeEdit from "./_components/ReadmeEdit";
import RepoViewComment from "./_components/RepoViewComment";

import "@/app/result/[id]/_components/result.css";

import { useEffect, useState } from "react";

export default function ReadmeEditPage() {
  const userNickName =
    useResultStore.getState().result.repoCardDto.memberNickname;
  const [tabIndex, setTabIndex] = useState(0);
  const [lastIndex, setLastIndex] = useState(0);

  useEffect(() => {
    console.log(`현재 선택된 탭: ${tabIndex}`);
  }, [tabIndex]);

  const handleTab = (index: number) => {
    setTabIndex(index);
    setLastIndex(tabIndex);
  };

  const slideDirection = tabIndex > lastIndex ? "slide-right" : "slide-left";
  const tabComponents = [<ReadmeEdit />, <RepoViewComment />];

  return (
    <div className="bg-appGrey1 h-full">
      <div className="flex flex-col items-center pt-4 w-full h-full">
        {userNickName ? (
          <p className="mb-5 text-xl font-bold sm:text-2xl">
            {`상세 수정 페이지`}
          </p>
        ) : (
          <p className="mb-5 text-xl font-bold sm:text-2xl">로딩 중...</p>
        )}
      </div>
      <div className="flex w-full justify-evenly mb-4">
        <TabButton
          onClick={() => handleTab(0)}
          className={`${tabIndex === 0 ? "border-appBlue1 text-appBlue1" : ""} transition duration-300 ease-in-out`}
        >
          리드미 수정
        </TabButton>
        <TabButton
          onClick={() => handleTab(1)}
          className={`${tabIndex === 1 ? "border-appBlue1 text-appBlue1" : ""} transition duration-300 ease-in-out`}
        >
          코멘트
        </TabButton>
      </div>
      <TransitionGroup component={null}>
        <CSSTransition key={tabIndex} timeout={500} classNames={slideDirection}>
          <div className="flex justify-center w-full min-h-[75vh] ">
            {tabComponents[tabIndex]}
          </div>
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
}

const TabButton = tw.button`
  border-b-2 px-3 py-2 text-sm
  sm:px-2 sm:text-sm
  md:px-2 md:text-base
  lg:px-2 lg:text-lg
`;
