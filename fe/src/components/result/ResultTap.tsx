"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import tw from "tailwind-styled-components";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import CommonButton from "./CommonButton";
// store
import useResultStore from "@/store/result";
import useAnalyzingStore from "@/store/analyze";
import useRepoDetailStore from "@/store/repodetail";
import UseAxios from "@/api/common/useAxios";

import "@/app/result/[id]/_components/result.css";

// 컴포넌트 import
import ResultCommit from "@/app/result/[id]/_components/ResultCommit";
// import ResultContribution from "@/app/result/[id]/_components/ResultContribution.tsx"; 폐기했습니다
import ResultReadme from "@/app/result/[id]/_components/ResultReadme";
import ResultScore from "@/app/result/[id]/_components/ResultScore";

interface ResultTabProps {
  openModal: () => void;
}

const ResultTap: React.FC<ResultTabProps> = ({ openModal }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [lastIndex, setLastIndex] = useState(0);
  const isMine = useResultStore((state) => state.result.repoCardDto.isMine);
  const axios = UseAxios();

  useEffect(() => {
    // console.log(`현재 선택된 탭: ${tabIndex}`);
  }, [tabIndex]);

  const handleTab = (index: number) => {
    setTabIndex(index);
    setLastIndex(tabIndex);
  };

  const router = useRouter();
  const params = useParams();

  const handleEditButton = () => {
    const { id } = params;

    router.push(`/result/${id}/edit`);
    // console.log(useResultStore.getState().result.repoCardDto.memberNickname);
  };

  const slideDirection = tabIndex > lastIndex ? "slide-right" : "slide-left";

  const tabComponents = [<ResultReadme />, <ResultCommit />, <ResultScore />];

  return (
    <div className="w-full h-full">
      <div className="h-fit flex">
        <div className="my-10 justify-center items-center mx-auto">
          <TabButtonLeft
            onClick={() => handleTab(0)}
            className={`${tabIndex === 0 ? "border-appBlue1 text-appBlue1" : ""} transition duration-300 ease-in-out`}
          >
            README
          </TabButtonLeft>
          {isMine ? (
            <TabButton
              onClick={() => handleTab(1)}
              className={`${tabIndex === 1 ? "border-appBlue1 text-appBlue1" : ""} transition duration-300 ease-in-out`}
            >
              커밋분석
            </TabButton>
          ) : (
            <TabButtonRight
              onClick={() => handleTab(1)}
              className={`${tabIndex === 1 ? "border-appBlue1 text-appBlue1" : ""} transition duration-300 ease-in-out`}
            >
              커밋분석
            </TabButtonRight>
          )}
          {isMine ? (
            <TabButtonRight
              onClick={() => handleTab(2)}
              className={`${tabIndex === 2 ? "border-appBlue1 text-appBlue1" : ""} transition duration-300 ease-in-out`}
            >
              레포점수
            </TabButtonRight>
          ) : null}
        </div>
      </div>
      <TransitionGroup component={null}>
        <CSSTransition key={tabIndex} timeout={500} classNames={slideDirection}>
          <div className="flex justify-center w-full min-h-96">
            {tabComponents[tabIndex]}
          </div>
        </CSSTransition>
      </TransitionGroup>
      <div className="flex justify-evenly mt-10">
        {isMine && <CommonButton text="수정 후 저장" onClick={openModal} />}
        {/* {isMine && <button onClick={handleEditButton}>수정하기</button>} */}
        <Link href="/main">
          <CommonButton text="홈으로" onClick={() => {}} />
        </Link>
      </div>
    </div>
  );
};

const TabButton = tw.button`
  border-2 border-black px-3 py-2 text-sm
  sm:px-4 sm:text-sm
  md:px-4 md:text-base
  lg:px-4 lg:text-lg
`;

const TabButtonLeft = tw(TabButton)`
rounded-tl-xl rounded-bl-xl
`;

const TabButtonRight = tw(TabButton)`
rounded-tr-xl rounded-br-xl
`;

export default ResultTap;
