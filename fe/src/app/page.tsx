"use client";

import tw from "tailwind-styled-components";
import { useState, useEffect, useRef } from "react";

import AnalysisButton from "../components/landing/AnalysisButton.tsx";
import IntroduceButton from "../components/landing/IntroduceButton.tsx";
import IntroduceText from "@/components/landing/IntroduceText.tsx";
import ServiceIntroduceVertical from "@/components/landing/ServiceIntroduceVertical.tsx";
import ServiceIntroduceLeft from "@/components/landing/ServiceIntroduceLeft.tsx";
import ServiceIntroduceRight from "@/components/landing/ServiceIntroduceRight.tsx";

export default function HomePage() {
  const [introMent, setIntroMent] = useState("");
  const [windowWidth, setWindowWidth] = useState(0);

  const serviceRef = useRef<HTMLDivElement>(null);
  const scrollToService = () => {
    serviceRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const introMentSM =
    "개발자 여러분, GitHub나 GitLab 같은 개발 활동을\n한눈에 볼 수 있는 플랫폼을 찾고 계신가요?\n저희 서비스는 여러분의 커밋과 프로젝트 기여도를\n분석하여 시각적으로 보여드립니다. 여러분의 개발 업적을 멋진 포트폴리오로 만들어보세요. 개발 배지도 획득하면서, 자신만의 프로필을 꾸며보는 재미도 느껴보세요!";
  const introMentLG = "";
  const introMentXL = "";

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
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

  // 스크롤에 따른 효과를 위한 상태
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      // console.log(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 스크롤 위치에 따라 투명도를 조정
  const fadeEffect = (offset: number) => ({
    opacity: Math.min(1, scrollY / offset),
    transform: `translateY(${300 - Math.min(300, (scrollY / offset) * 300)}px)`,
  });

  return (
    <div>
      <LadingComponent>
        <Slogan>코드만 치세요. 분석은 우리가 할께요.</Slogan>
        <Title>CoA</Title>
        <IntroduceText />
        <AnalysisButton content="분석 하기" url="/main" />
        <IntroduceButton content="서비스 알아보기" onClick={scrollToService} />
      </LadingComponent>
      <IntroBar>
        <h1 className="text-3xl font-bold">CoA = Commit Analyzer</h1>
      </IntroBar>
      <ServiceComponent ref={serviceRef}>
        {windowWidth <= 1280 ? (
          <>
            <ServiceIntroduceVertical
              content="여기에 내용을 적어주세요"
              image="/image/chun.png"
              style={fadeEffect(300)}
            />
            <ServiceIntroduceVertical
              content="또 다른 서비스 설명"
              image="/image/chun.png"
              style={fadeEffect(600)}
            />
            <ServiceIntroduceVertical
              content="세 번째 서비스 내용"
              image="/image/chun.png"
              style={fadeEffect(900)}
            />
            <ServiceIntroduceVertical
              content="마지막 서비스 설명"
              image="/image/chun.png"
              style={fadeEffect(1200)}
            />
          </>
        ) : (
          <>
            <ServiceIntroduceLeft
              content="여기에 내용을 적어주세요"
              image="/image/chun.png"
            />
            <ServiceIntroduceRight
              content="또 다른 서비스 설명"
              image="/image/chun.png"
            />
            <ServiceIntroduceLeft
              content="세 번째 서비스 내용"
              image="/image/chun.png"
            />
            <ServiceIntroduceRight
              content="마지막 서비스 설명"
              image="/image/chun.png"
            />
          </>
        )}
      </ServiceComponent>
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

const IntroBar = tw.div`
flex items-center justify-center bg-appGrey2 mt-32 mb-10 py-10
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
