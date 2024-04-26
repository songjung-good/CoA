import Link from "next/link";
import tw from "tailwind-styled-components";

interface ServiceIntroduceRightProps {
  content: string;
  image: string;
}

export default function ServiceIntroduceRight({
  content,
  image,
}: ServiceIntroduceRightProps) {
  return (
    <Service>
      <p>{content}</p>
      <img src={image} alt="서비스 이미지" />
    </Service>
  );
}

const Service = tw.div`
  flex
`;
