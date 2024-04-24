import Link from "next/link";
import tw from "tailwind-styled-components";

interface ServiceIntroduceLeftProps {
  content: string;
  image: string;
}

export default function ServiceIntroduceLeft({
  content,
  image,
}: ServiceIntroduceLeftProps) {
  return (
    <Service>
      <img src={image} alt="서비스 이미지" />
      <p>{content}</p>
    </Service>
  );
}

const Service = tw.div`

`;
