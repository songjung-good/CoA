"use client";

import tw from "tailwind-styled-components";

// import AnalysisButton from "@/components/landing/AnalysisButton.tsx";
import AnalysisButton from "../components/landing/AnalysisButton.tsx";

import { useState, useEffect } from "react";
// import IntroduceButton from "@/components/landing/IntroduceButton.tsx";
import IntroduceButton from "../components/landing/IntroduceButton.tsx";

export default function HomePage() {
  const [introMent, setIntroMent] = useState("");

  const introMentSM =
    "개발자 여러분, GitHub나 GitLab 같은 개발 활동을\n한눈에 볼 수 있는 플랫폼을 찾고 계신가요?\n저희 서비스는 여러분의 커밋과 프로젝트 기여도를\n분석하여 시각적으로 보여드립니다. 여러분의 개발 업적을 멋진 포트폴리오로 만들어보세요. 개발 배지도 획득하면서, 자신만의 프로필을 꾸며보는 재미도 느껴보세요!";
  const introMentLG = "";
  const introMentXL = "";

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIntroMent(introMentSM);
      } else if (window.innerWidth < 1280) {
        setIntroMent(introMentLG);
      } else {
        setIntroMent(introMentXL);
      }
    };
    // 처음 로딩할 때 실행
    handleResize();

    // 윈도우 사이즈가 바뀔 때마다 실행
    window.addEventListener("resize", handleResize);

    // 컴포넌트가 언마운트 될 때 이벤트 리스너 제거
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      <LadingComponent>
        <Slogan>코드만 치세요. 분석은 우리가 할께요.</Slogan>
        <Title>CoA</Title>
        <Introduce>{introMent}</Introduce>
        <AnalysisButton content="분석 하기" url="/main" />
        <IntroduceButton content="서비스 알아보기" />
      </LadingComponent>
      <ServiceComponent></ServiceComponent>
    </div>
  );
}

const LadingComponent = tw.main`
flex 
flex-col 
justify-center
items-center
`;

const Title = tw.h1`
text-7xl 
font-bold
text-center
mt-2
mb-10
`;

const Slogan = tw.h2`
text-center
`;

const Introduce = tw.h3`
text-center
text-lg
w-3/4
mb-24
whitespace-pre-wrap
`;

const ServiceComponent = tw.div`

`;
