import Link from "next/link";
import tw from "tailwind-styled-components";

interface IntroduceButtonProps {
  content: string;
}

export default function IntroduceButton({ content }: IntroduceButtonProps) {
  return <IntroduceBtn>{content}</IntroduceBtn>;
}

const IntroduceBtn = tw.button`
  text-xl
  font-bold
  bg-appGrey2
  py-4
  px-16
  rounded-2xl
`;
