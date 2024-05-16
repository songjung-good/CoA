import Link from "next/link";
import tw from "tailwind-styled-components";

interface IntroduceButtonProps {
  content: string;
  onClick?: () => void; // onClick 속성을 추가합니다. '?'를 사용하여 선택적 프롭으로 만듭니다.
}

export default function IntroduceButton({
  content,
  onClick,
}: IntroduceButtonProps) {
  return (
    <IntroduceBtn onClick={onClick}>{content}</IntroduceBtn> // onClick 이벤트 핸들러를 버튼에 연결합니다.
  );
}

const IntroduceBtn = tw.button`
  text-xl
  font-bold
  bg-appBlue3
  py-4
  px-16
  z-20  
  rounded-2xl
  shadow-black
  shadow-inner
  transition
  hover:bg-appBlue2
`;
