"use client";

import tw from "tailwind-styled-components";
import { useState, useEffect, useRef } from "react";

import AnalysisButton from "../components/landing/AnalysisButton.tsx";
import IntroduceButton from "../components/landing/IntroduceButton.tsx";
import IntroduceText from "@/components/landing/IntroduceText.tsx";
import ServiceIntroduceVertical from "@/components/landing/ServiceIntroduceVertical.tsx";
import ServiceIntroduceLeft from "@/components/landing/ServiceIntroduceLeft.tsx";
import ServiceIntroduceRight from "@/components/landing/ServiceIntroduceRight.tsx";
import FloatingButton from "@/components/landing/FloatingButton.tsx";

export default function HomePage() {
  const [windowWidth, setWindowWidth] = useState(0);
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const [toggleButtonText, setToggleButtonText] = useState("+");
  const [isButtonsVisible, setIsButtonsVisible] = useState(false);

  // 위로가기 버튼
  const titleRef = useRef<HTMLDivElement | null>(null);
  const scrollToTitle = () => {
    titleRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 서비스 알아보기 버튼 (누르면 밑으로 자동 스크롤)
  const serviceRef = useRef<HTMLDivElement | null>(null);
  const scrollToService = () => {
    serviceRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 분석하기 플로팅 버튼(해당 버튼 아래로 내려가면 플로팅 버튼 생김)
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    const handleButtonVisibility = () => {
      if (buttonRef.current) {
        const buttonBottom =
          buttonRef.current.getBoundingClientRect().bottom + window.scrollY;
        const currentScrollY = window.scrollY;
        setShowFloatingButton(currentScrollY >= buttonBottom);
      }
    };

    window.addEventListener("scroll", handleButtonVisibility);
    return () => window.removeEventListener("scroll", handleButtonVisibility);
  }, []);

  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const updateWindowWidth = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", updateWindowWidth);
    updateWindowWidth(); // 초기 값 설정

    return () => window.removeEventListener("resize", updateWindowWidth);
  }, []);

  const fadeEffect = (offset: number) => ({
    opacity: Math.min(1, scrollY / offset),
    transform: `translateY(${300 - Math.min(300, (scrollY / offset) * 300)}px)`,
    transition: "opacity 1s ease-out, transform 0.5s ease-out",
  });

  const toggleButtons = () => {
    setIsButtonsVisible(!isButtonsVisible);

    if (toggleButtonText === "+") {
      setToggleButtonText("-");
    } else {
      setToggleButtonText("+");
    }
  };

  return (
    <div>
      <LadingComponent ref={titleRef}>
        <Slogan>코드만 치세요. 분석은 우리가 할께요.</Slogan>
        <Title>CoA</Title>
        <IntroduceText />
        <AnalysisButton buttonRef={buttonRef} content="분석 하기" url="/main" />
        <FloatingButton
          showFloatingButton={showFloatingButton}
          isButtonsVisible={isButtonsVisible}
          toggleButtons={toggleButtons}
          scrollToTitle={scrollToTitle}
          // 스크롤 아래로 내렸을때 플로팅 버튼
        />
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
              style={fadeEffect(400)}
            />
            <ServiceIntroduceVertical
              content="또 다른 서비스 설명"
              image="/image/chun.png"
              style={fadeEffect(800)}
            />
            <ServiceIntroduceVertical
              content="세 번째 서비스 내용"
              image="/image/chun.png"
              style={fadeEffect(1200)}
            />
            <ServiceIntroduceVertical
              content="마지막 서비스 설명"
              image="/image/chun.png"
              style={fadeEffect(1600)}
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

const ServiceComponent = tw.div`
`;
