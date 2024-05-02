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

  return (
    <div>
      <div className="mt-10 flex">
        <TapButtonLeft
          onClick={() => handleTab(0)}
          className={tabIndex === 0 ? "border-appBlue1 text-appBlue1" : ""}
        >
          README
        </TapButtonLeft>
        <TapButton
          onClick={() => handleTab(1)}
          className={tabIndex === 1 ? "border-appBlue1 text-appBlue1" : ""}
        >
          기여도
        </TapButton>
        <TapButton
          onClick={() => handleTab(2)}
          className={tabIndex === 2 ? "border-appBlue1 text-appBlue1" : ""}
        >
          커밋분석
        </TapButton>
        <TapButtonRight
          onClick={() => handleTab(3)}
          className={tabIndex === 3 ? "border-appBlue1 text-appBlue1" : ""}
        >
          레포점수
        </TapButtonRight>
      </div>
      <div>{tabIndex === 0 && <ResultReadme />}</div>
      <div>{tabIndex === 1 && <ResultContribution />}</div>
      <div>{tabIndex === 2 && <ResultCommit />}</div>
      <div>{tabIndex === 3 && <ResultScore />}</div>
    </div>
  );
}

const TapButton = tw.button`
border-2 border-black px-5 py-2
`;

const TapButtonLeft = tw(TapButton)`
rounded-tl-xl rounded-bl-xl
`;

const TapButtonRight = tw(TapButton)`
rounded-tr-xl rounded-br-xl
`;
