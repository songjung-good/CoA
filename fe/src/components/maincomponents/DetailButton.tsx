// 마우스가 올라가면 상세보기 버튼이 나타나는 기능을 구현합니다.

import React from 'react';
import tw from 'tailwind-styled-components';

interface DetailButtonProps {
  hovered: boolean;
  repoViewId: string;
  onDetailClick: (repoViewId: string) => void;
}

const DetailButton: React.FC<DetailButtonProps> = ({ hovered, repoViewId, onDetailClick }) => {
  return (
    hovered && (
      <CardOverlay>
        <Button
          onClick={() => onDetailClick(repoViewId)}
        >
          상세보기
        </Button>
      </CardOverlay>
    )
  );
};

const CardOverlay = tw.div`
  absolute
  w-[25rem] 
  h-[15rem]
  m-[3rem] 
  border
  border-appYellow
  rounded-lg 
  bg-white
  flex
  items-center
  justify-center
  z-1
`;

const Button = tw.div`
  bg-appYellow 
  text-black 
  font-bold 
  py-2 
  px-4 
  z-5
  rounded 
  mr-2 
  cursor-pointer
`;

export default DetailButton;