import Link from "next/link";
import tw from "tailwind-styled-components";

import AnalysisIcon from "@/icons/AnalysisIcon";

interface AnalysisButtonProps {
  content: string;
  url: string;
}

export default function AnalysisButton({ content, url }: AnalysisButtonProps) {
  return (
    <StyledLink href={url}>
      <AnalysisIcon />
      <AnalysisBtn>{content}</AnalysisBtn>
    </StyledLink>
  );
}

const AnalysisBtn = tw.button`
  text-xl
  font-bold
`;

const StyledLink = tw(Link)`
  flex
  bg-appOrange
  p-2
  rounded-lg
  mb-24
`;
