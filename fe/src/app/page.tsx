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
import LandingCarousel from "@/components/landing/LandingCarousel.tsx";

// Intersection Observer 커스텀 훅
import { useObserver } from "@/components/landing/ObserverOption.tsx";

export default function HomePage() {
  const [windowWidth, setWindowWidth] = useState(0);
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const [isButtonsVisible, setIsButtonsVisible] = useState(false);

  // fadein 설정 ------------------------------------------------
  const introRef1 = useRef(null);
  const introRef2 = useRef(null);
  const introRef3 = useRef(null);
  const introRef4 = useRef(null);
  // ref 1~4 작은화면 (1024px 이하) ref5~8 큰화면(1024px 이상)
  const introRef5 = useRef(null);
  const introRef6 = useRef(null);
  const introRef7 = useRef(null);
  const introRef8 = useRef(null);

  // 가시성 상태 기록을 위한 상태 변수
  const [active1, setActive1] = useState(false);
  const [active2, setActive2] = useState(false);
  const [active3, setActive3] = useState(false);
  const [active4, setActive4] = useState(false);

  const { isVisible: isVisible1 } = useObserver({
    target: introRef1,
    option: { threshold: 0.5 },
  });
  const { isVisible: isVisible2 } = useObserver({
    target: introRef2,
    option: { threshold: 0.5 },
  });
  const { isVisible: isVisible3 } = useObserver({
    target: introRef3,
    option: { threshold: 0.5 },
  });
  const { isVisible: isVisible4 } = useObserver({
    target: introRef4,
    option: { threshold: 0.5 },
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
  // fadein 설정 ------------------------------------

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
    updateWindowWidth(); // 초기 값 설정

    return () => window.removeEventListener("resize", updateWindowWidth);
  }, []);

  return (
    <div ref={titleRef} className="bg-appGrey1">
      <div className="relative">
        <LandingCarousel />
      </div>
      <LadingComponent>
        <Slogan>코드만 치세요. 분석은 우리가 할께요.</Slogan>
        <Title>CoA</Title>
        <IntroduceText />
        <AnalysisButton buttonRef={buttonRef} content="시작하기" url="/main" />
        <IntroduceButton content="서비스 알아보기" onClick={scrollToService} />
        <IntroBar>
          <h3 className="text-3xl font-bold">CoA = Commit Analyzer</h3>
        </IntroBar>
      </LadingComponent>
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
              content="여기에 내용을 적어주세요"
              image="/image/chun.png"
              style={fadeEffect(active1)}
            />
            <ServiceIntroduceVertical
              ref={introRef2}
              content="또 다른 서비스 설명"
              image="/image/chun.png"
              style={fadeEffect(active2)}
            />
            <ServiceIntroduceVertical
              ref={introRef3}
              content="세 번째 서비스 내용"
              image="/image/chun.png"
              style={fadeEffect(active3)}
            />
            <ServiceIntroduceVertical
              ref={introRef4}
              content="마지막 서비스 설명"
              image="/image/chun.png"
              style={fadeEffect(active4)}
            />
          </>
        ) : (
          <>
            <ServiceIntroduceLeft
              ref={introRef5}
              content="여기에 내용을 적어주세요"
              image="/image/chun.png"
            />
            <ServiceIntroduceRight
              ref={introRef6}
              content="또 다른 서비스 설명"
              image="/image/chun.png"
            />
            <ServiceIntroduceLeft
              ref={introRef7}
              content="세 번째 서비스 내용"
              image="/image/chun.png"
            />
            <ServiceIntroduceRight
              ref={introRef8}
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
absolute top-32 flex flex-col items-center 
z-10 w-full 

`;

const Title = tw.h1`
text-7xl 
font-bold
text-center
my-8
`;

const Slogan = tw.h2`
text-center font-extrabold
`;

const IntroBar = tw.div`
bg-white py-10 rounded-t-3xl w-full text-center shadow-sm
mt-5
`;

const ServiceComponent = tw.div`
overflow-y-hidden
`;
