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
      <AnalysisIcon />
      <AnalysisBtn ref={buttonRef}>{content}</AnalysisBtn>
    </StyledLink>
  );
};

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

export default AnalysisButton;
