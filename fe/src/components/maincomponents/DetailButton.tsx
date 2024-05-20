// 데이터를 불러오는 버튼 컴포넌트

// 라이브러리
import React from "react";
import tw from "tailwind-styled-components";
import { useRouter } from "next/navigation";
import UseAxios from "@/api/common/useAxios";
// 데이터
import useRepoDetailStore from "@/store/repodetail";

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
    } catch (error) {
      console.error(error);
    }
  };

  // 버튼 클릭시 데이터 저장 이후 상세정보 페이지로 이동
  const handleDetailClick = async (repoViewId: string) => {
    await getRepoView(repoViewId);
    router.push(`/repo/${repoViewId}`);
  };

  return (
    hovered && (
      <CardOverlay>
        <Button onClick={() => handleDetailClick(repoViewId)}>{`상세페이지 > `}</Button>
      </CardOverlay>  
    )
  );
};

const CardOverlay = tw.div`
  absolute
  w-[20rem] 
  h-[15rem]
  mb-5 sm:m-5
  border
  border-appGrey2
  rounded-lg 
  bg-white
  bg-opacity-85
  flex
  items-end
  justify-end
  z-1
`;

const Button = tw.div`
  text-black
  border-b-2
  font-bold 
  py-2 
  px-4
  mb-5 
  z-5
  rounded 
  mr-5
  cursor-pointer
  transition-all
  hover:border-b
  hover:border-b-appRed
`;

export default DetailButton;
