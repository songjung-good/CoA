"use client";

import React, { useState, useEffect, useRef } from "react";
import tw from "tailwind-styled-components";
import AnalysisButton from "../components/landing/AnalysisButton";
import IntroduceButton from "../components/landing/IntroduceButton";
import IntroduceText from "@/components/landing/IntroduceText";
import ServiceIntroduceVertical from "@/components/landing/ServiceIntroduceVertical";
import ServiceIntroduceLeft from "@/components/landing/ServiceIntroduceLeft";
import ServiceIntroduceRight from "@/components/landing/ServiceIntroduceRight";
import FloatingButton from "@/components/landing/FloatingButton";
import LandingCarousel from "@/components/landing/LandingCarousel";

// introText data
import IntroText from "@/components/landing/introText.json";

// Intersection Observer 커스텀 훅
import { useObserver } from "@/components/landing/ObserverOption";

export default function HomePage() {
  const [windowWidth, setWindowWidth] = useState(0);
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const [isButtonsVisible, setIsButtonsVisible] = useState(false);

  const introRef1 = useRef<HTMLDivElement | null>(null);
  const introRef2 = useRef<HTMLDivElement | null>(null);
  const introRef3 = useRef<HTMLDivElement | null>(null);
  const introRef4 = useRef<HTMLDivElement | null>(null);

  const introRef5 = useRef<HTMLDivElement | null>(null);
  const introRef6 = useRef<HTMLDivElement | null>(null);
  const introRef7 = useRef<HTMLDivElement | null>(null);
  const introRef8 = useRef<HTMLDivElement | null>(null);

  const [active1, setActive1] = useState(false);
  const [active2, setActive2] = useState(false);
  const [active3, setActive3] = useState(false);
  const [active4, setActive4] = useState(false);

  const { isVisible: isVisible1 } = useObserver({
    target: introRef1,
    option: { threshold: 0.3 },
  });
  const { isVisible: isVisible2 } = useObserver({
    target: introRef2,
    option: { threshold: 0.3 },
  });
  const { isVisible: isVisible3 } = useObserver({
    target: introRef3,
    option: { threshold: 0.3 },
  });
  const { isVisible: isVisible4 } = useObserver({
    target: introRef4,
    option: { threshold: 0.3 },
  });

  useEffect(() => {
    if (isVisible1) setActive1(true);
    if (isVisible2) setActive2(true);
    if (isVisible3) setActive3(true);
    if (isVisible4) setActive4(true);
  }, [isVisible1, isVisible2, isVisible3, isVisible4]);

  const fadeEffect = (active: boolean) => ({
    opacity: active ? 1 : 0,
    transform: `translateY(${active ? 0 : 300}px)`,
    transition: "opacity 1s ease-out, transform 0.5s ease-out",
  });

  const titleRef = useRef<HTMLDivElement | null>(null);
  const scrollToTitle = () => {
    titleRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const serviceRef = useRef<HTMLDivElement | null>(null);
  const scrollToService = () => {
    serviceRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    const handleButtonVisibility = () => {
      if (buttonRef.current) {
        const buttonBottom =
          buttonRef.current.getBoundingClientRect().bottom + window.scrollY;
        const currentScrollY = window.scrollY;
        setShowFloatingButton(currentScrollY >= 80);
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
    updateWindowWidth();

    return () => window.removeEventListener("resize", updateWindowWidth);
  }, []);

  return (
    <div ref={titleRef} className="bg-appGrey1">
      <div className="relative">
        <LandingCarousel />
        <LadingComponent
          style={{
            height: "calc(90vh)",
          }}
        >
          <Slogan>코드만 치세요. 분석은 우리가 할게요.</Slogan>
          <Title>CoA</Title>
          <IntroduceText />
          <AnalysisButton
            buttonRef={buttonRef}
            content="시작하기"
            url="/auth/login"
          />
          <IntroduceButton
            content="서비스 알아보기"
            onClick={scrollToService}
          />
          <IntroBar>
            <h3 className="text-xl sm:text-3xl font-bold">
              CoA = Commit Analyzer
            </h3>
          </IntroBar>
        </LadingComponent>
      </div>
      <FloatingButton
        showFloatingButton={showFloatingButton}
        isButtonsVisible={isButtonsVisible}
        scrollToTitle={scrollToTitle}
      />
      <ServiceComponent ref={serviceRef}>
        {windowWidth <= 1024 ? (
          <>
            <ServiceIntroduceVertical
              ref={introRef1}
              content={IntroText.features[0]}
              image="/image/introduce/login.gif"
              style={fadeEffect(active1)}
            />
            <ServiceIntroduceVertical
              ref={introRef2}
              content={IntroText.features[1]}
              image="/image/introduce/analyze.gif"
              style={fadeEffect(active2)}
            />
            <ServiceIntroduceVertical
              ref={introRef3}
              content={IntroText.features[2]}
              image="/image/introduce/mainpage.gif"
              style={fadeEffect(active3)}
            />
            <ServiceIntroduceVertical
              ref={introRef4}
              content={IntroText.features[3]}
              image="/image/introduce/mypage.gif"
              style={fadeEffect(active4)}
            />
          </>
        ) : (
          <>
            <ServiceIntroduceLeft
              ref={introRef5}
              content={IntroText.features[0]}
              image="/image/introduce/login.gif"
            />
            <ServiceIntroduceRight
              ref={introRef6}
              content={IntroText.features[1]}
              image="/image/introduce/analyze.gif"
            />
            <ServiceIntroduceLeft
              ref={introRef7}
              content={IntroText.features[2]}
              image="/image/introduce/mainpage.gif"
            />
            <ServiceIntroduceRight
              ref={introRef8}
              content={IntroText.features[3]}
              image="/image/introduce/mypage.gif"
            />
          </>
        )}
      </ServiceComponent>
    </div>
  );
}

const LadingComponent = tw.main`
absolute top-1 flex flex-col items-center justify-between
z-10 w-full
`;

const Title = tw.h1`
text-7xl 
font-bold
text-center
my-8
`;

const Slogan = tw.h2`
text-center font-extrabold mt-16
`;

const IntroBar = tw.div`
bg-appGrey1 py-5 rounded-t-3xl w-full text-center shadow-sm 
`;

const ServiceComponent = tw.div`
overflow-y-hidden
overflow-x-hidden
relative
`;

// 기존 스타일 컴포넌트에 position: relative를 추가하여 자식 요소의 위치 이동을 방지합니다.
