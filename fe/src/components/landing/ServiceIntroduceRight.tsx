import { forwardRef } from "react";
import Image from "next/image";
import tw from "tailwind-styled-components";
import { useState, useEffect, useRef } from "react";

interface ServiceIntroduceRightProps {
  content: Record<string, any>;
  image: string;
}

// 특정 단어에 스타일을 적용하는 함수
const highlightText = (text: string, wordsToHighlight: string[]) => {
  const parts = text.split(new RegExp(`(${wordsToHighlight.join("|")})`, "gi"));
  return parts.map((part, index) =>
    wordsToHighlight.includes(part) ? (
      <span key={index} className="text-appBlue1 text-2xl font-medium">
        {part}
      </span>
    ) : (
      part
    ),
  );
};

const ServiceIntroduceRight = forwardRef<
  HTMLDivElement,
  ServiceIntroduceRightProps
>(({ content, image }, ref: any) => {
  const wordsToHighlight = [
    "자동",
    "리드미 초안",
    "커밋을 분석",
    "구현 기능",
    "코딩 스타일",
    "코멘트 기능",
    "다양한 통계",
  ]; // 예시로 강조하고 싶은 단어들
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.4 },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref]);
  return (
    <Service
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateX(0)" : "translateX(50%)",
        transition: "opacity 1s ease-out, transform 0.5s ease-in-out",
        overflow: "hidden",
      }}
    >
      <p className="text-3xl sm:text-6xl mb-[5%] text-appBlue1 font-bold">
        {content.title}
      </p>
      <div className="flex justify-between w-full">
        <div className="w-2/5 h-full flex flex-col justify-around items-center py-5  text-center min-w-[350px] min-h-[472.5px]">
          <p
            className="whitespace-pre-wrap break-words mb-2 text-xl"
            style={{ wordBreak: "keep-all", whiteSpace: "pre-wrap" }}
          >
            {highlightText(content.description, wordsToHighlight)}
          </p>
          <div className="flex flex-wrap justify-center">
            {content.hashtags.map((tag: string, key: string) => (
              <p
                key={key}
                className="border-2 mr-2 mb-2 px-2 py-1 rounded-lg hover:bg-white duration-300 text-gray-400"
              >
                {tag}
              </p>
            ))}
          </div>
        </div>
        <div className="flex w-1/2 h-1/2 relative justify-center items-center min-h-[472.5px]">
          <Image
            src={image}
            fill
            style={{ objectFit: "cover" }}
            alt="analysis"
          />
        </div>
      </div>
    </Service>
  );
});

export default ServiceIntroduceRight;

const Service = tw.div`
  flex flex-col my-10 justify-evenly items-center mx-24 h-screen overflow-hidden
`;
