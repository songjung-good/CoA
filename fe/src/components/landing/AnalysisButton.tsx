import Link from "next/link";
import tw from "tailwind-styled-components";
import React, { forwardRef } from "react";

import AnalysisIcon from "@/icons/AnalysisIcon";

interface AnalysisButtonProps {
  content: string;
  url: string;
  buttonRef: React.RefObject<HTMLButtonElement>;
}

const AnalysisButton = ({ content, url, buttonRef }: AnalysisButtonProps) => {
  return (
    <StyledLink href={url}>
      <AnalysisIcon width={40} height={40} />
      <AnalysisBtn ref={buttonRef}>{content}</AnalysisBtn>
    </StyledLink>
  );
};

const AnalysisBtn = tw.button`
  text-xl
  font-bold
  text-white
`;

const StyledLink = tw(Link)`
  flex
  bg-appOrange
  p-2
  rounded-lg
  my-[2%]
  shadow-2xl
  hover:bg-orange-500
  transition-colors
  duration-300
`;

export default AnalysisButton;
