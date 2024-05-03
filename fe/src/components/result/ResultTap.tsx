"use client";

import { useState, useEffect } from "react";
import tw from "tailwind-styled-components";

// 컴포넌트 import
import ResultCommit from "@/app/result/[id]/_components/ResultCommit.tsx";
import ResultContribution from "@/app/result/[id]/_components/ResultContribution.tsx";
import ResultReadme from "@/app/result/[id]/_components/ResultReadme.tsx";
import ResultScore from "@/app/result/[id]/_components/ResultScore.tsx";

export default function ResultTab() {
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    console.log(`현재 선택된 탭: ${tabIndex}`);
  }, [tabIndex]);

  const handleTab = (index: number) => {
    setTabIndex(index);
  };

  const tabComponents = [
    <ResultReadme />,
    <ResultContribution />,
    <ResultCommit />,
    <ResultScore />,
  ];

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
          <TabButton
            onClick={() => handleTab(1)}
            className={`${tabIndex === 1 ? "border-appBlue1 text-appBlue1" : ""} transition duration-300 ease-in-out`}
          >
            기여도
          </TabButton>
          <TabButton
            onClick={() => handleTab(2)}
            className={`${tabIndex === 2 ? "border-appBlue1 text-appBlue1" : ""} transition duration-300 ease-in-out`}
          >
            커밋분석
          </TabButton>
          <TabButtonRight
            onClick={() => handleTab(3)}
            className={`${tabIndex === 3 ? "border-appBlue1 text-appBlue1" : ""} transition duration-300 ease-in-out`}
          >
            레포점수
          </TabButtonRight>
        </div>
      </div>
      <div className="flex justify-center w-full min-h-96">
        {tabComponents[tabIndex]}
      </div>
      <div className="flex justify-center mt-10">
        <button>저장 후 수정</button>
        <button>홈으로</button>
      </div>
    </div>
  );
}

const TabButton = tw.button`
border-2 border-black px-5 py-2
`;

const TabButtonLeft = tw(TabButton)`
rounded-tl-xl rounded-bl-xl
`;

const TabButtonRight = tw(TabButton)`
rounded-tr-xl rounded-br-xl
`;
