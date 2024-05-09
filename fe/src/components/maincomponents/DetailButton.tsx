// 데이터를 불러오는 버튼 컴포넌트

// 라이브러리
import React from 'react';
import tw from 'tailwind-styled-components';
import { useRouter } from "next/navigation";
import UseAxios from '@/api/common/useAxios';
// 데이터
import useRepoDetailStore from '@/store/repodetail';

interface DetailButtonProps {
  hovered: boolean;
  repoViewId: string;
}

// 상세보기 버튼 컴포넌트
const DetailButton: React.FC<DetailButtonProps> = ({ hovered, repoViewId }) => {
  const router = useRouter();
  const axios = UseAxios();
  const setRepoDetail = useRepoDetailStore((state) => state.updateResultState);
  // 레포지토리 상세정보 보내기
  const getRepoView = async (repoViewId: string) => {
    try {
      const response = await axios.get(`/api/repos/${repoViewId}`);
      setRepoDetail(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // 버튼 클릭시 데이터 저장 이후 상세정보 페이지로 이동
  const handleDetailClick = async (repoViewId: string) => {
    await getRepoView(repoViewId);
    await router.push(`/repo/${repoViewId}`);
  };

  return (
    hovered && (
      <CardOverlay>
        <Button
          onClick={() => handleDetailClick(repoViewId)}
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