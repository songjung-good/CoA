import { forwardRef } from "react";
import Image from "next/image";
import tw from "tailwind-styled-components";

interface ServiceIntroduceVerticalProps {
  content: {
    title: string;
    description: string;
    hashtags: string[];
  };
  image: string;
  style: React.CSSProperties;
}

// 특정 단어에 스타일을 적용하는 함수
const highlightText = (text: string, wordsToHighlight: string[]) => {
  const parts = text.split(new RegExp(`(${wordsToHighlight.join("|")})`, "gi"));
  return parts.map((part, index) =>
    wordsToHighlight.includes(part) ? (
      <span key={index} className="text-appBlue1 text-xl font-medium">
        {part}
      </span>
    ) : (
      part
    ),
  );
};

const ServiceIntroduceVertical = forwardRef<
  HTMLDivElement,
  ServiceIntroduceVerticalProps
>(({ content, image, style }, ref) => {
  const wordsToHighlight = [
    "자동",
    "리드미 초안",
    "커밋을 분석",
    "구현 기능",
    "코딩 스타일",
    "코멘트 기능",
    "다양한 통계",
  ]; // 예시로 강조하고 싶은 단어들

  return (
    <Service ref={ref} style={style}>
      <div className="w-full max-w-2xl flex flex-col justify-center items-center rounded-2xl shadow-lg bg-white py-5 px-4">
        <div className="w-full h-72 relative flex justify-center items-center">
          <Image
            src={image}
            fill
            style={{ objectFit: "cover" }}
            alt="analysis"
          />
        </div>
        <div className="w-full flex flex-col justify-evenly items-center py-5 px-4 text-center">
          <p className="text-3xl mb-2 text-appBlue1 font-bold">
            {content.title}
          </p>
          <p
            className="whitespace-pre-wrap break-words mb-2 text-sm"
            style={{ wordBreak: "keep-all", whiteSpace: "pre-wrap" }}
          >
            {highlightText(content.description, wordsToHighlight)}
          </p>
          <div className="flex flex-wrap justify-center">
            {content.hashtags.map((tag, key) => (
              <p
                key={key}
                className="border-2 mr-2 mb-2 px-2 py-1 rounded-lg text-sm hover:bg-appGrey1 text-gray-400"
              >
                {tag}
              </p>
            ))}
          </div>
        </div>
      </div>
    </Service>
  );
});

const Service = tw.div`
  flex flex-col items-center justify-center w-full h-screen px-4
`;

export default ServiceIntroduceVertical;
