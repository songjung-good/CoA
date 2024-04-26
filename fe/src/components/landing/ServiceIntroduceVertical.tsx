import { StaticImageData } from "next/image";
import Link from "next/link";
import Image from "next/image";
import tw from "tailwind-styled-components";

interface ServiceIntroduceVerticalProps {
  content: string;
  image: string;
  style: React.CSSProperties;
}

export default function ServiceIntroduceVertical({
  content,
  image,
  style,
}: ServiceIntroduceVerticalProps) {
  return (
    <Service style={style}>
      <div className="w-1/2 h-48 relative">
        {" "}
        {/* 이 div는 이미지의 부모 요소가 됩니다. */}
        <Image src={image} layout="fill" objectFit="cover" alt="analysis" />
      </div>
      <p>{content}</p>
    </Service>
  );
}

const Service = tw.div`
  flex flex-col items-center w-full relative mb-20
`;
