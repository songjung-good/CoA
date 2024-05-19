'use strict'
// 라이브러리
import React, { useState } from 'react';
import tw from 'tailwind-styled-components';
import useCommonCodeStore from '@/store/commoncode';
import { useRouter } from "next/navigation";
import UseAxios from "@/api/common/useAxios";
import StartIcon from "@/icons/StarIcon";
import StartIconFilled from "@/icons/StarIconFilled";

// 타입 정의
interface Skill {
  codeId: number;
  codeName: string;
}

interface MemberCardDto {
  memberUuid: string;
  memberNickName: string;
  memberImg: string;
  memberIntro: string;
  skillList: Skill[];
  memberJobCodeId: number;
  isMine: boolean;
  isBookmark: boolean;
}

interface MemberCardProps {
  memberInfo: MemberCardDto;
}

const MemberCard: React.FC<MemberCardProps> = ({ memberInfo }) => {
  const skill = memberInfo.skillList;
  const jobcode = useCommonCodeStore.getState().response.result.commonCodeList[2].codes;
  const jobName = jobcode ? jobcode[memberInfo.memberJobCodeId] : null;
  const uuid = memberInfo.memberUuid; 
  const router = useRouter();
  const [starState, setStartState] = useState(memberInfo.isBookmark);

  const handleDetailClick = (uuid: string) => {
    router.push(`/user/${uuid}`)
  };

  const postFollowData = async () => {
    try {
      const postResponse = await UseAxios().post(
        `/api/member/bookmarks/${uuid}`,
      );
      // console.log(postResponse.data.result["currentStatus"]);
      return postResponse.data.result["currentStatus"];
    } catch (error) {
      console.error("'팔로우 post'요청 에러", error);
      return starState;
    }
  };

  const changeStar = async () => {
    const response = await postFollowData();
    setStartState(response);
  };

  const bookmarkDisplay = starState ? (
    <button aria-label="팔로우 하기" onClick={changeStar} className="w-6 h-6">
      <StartIconFilled />
    </button>
  ) : (
    <button aria-label="팔로우 하기" onClick={changeStar} className="w-6 h-6">
      <StartIcon />
    </button>
  );
  // 내 카드인지 아닌지 구분하는 svg
  // const mineDisplay = memberInfo.isMine ? ( 
  //   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  //     <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
  //   </svg>
  // ) : (
  //   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  //     <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
  //   </svg>
  // )

  return (
    <MemberInfoDiv>
      <Header>
        <ProfileImg
          src={memberInfo.memberImg}
          alt="member image"
        /> 
        <div className='flex flex-col justify-center'>
          <Info>
          {memberInfo.memberNickName} | {bookmarkDisplay}
          </Info>
          <Info>  {jobName} </Info>
        </div>
      </Header>
      <Body>
        <p className="text-xl mb-2">{memberInfo.memberIntro}</p>
      </Body>
      <Skill>
        <div className="flex flex-wrap">
          {skill.map((skill: Skill, index: number) => (
            <span key={index} className="m-1 bg-gray-200 rounded-full px-4 py-1 text-sm">
              {skill.codeName}
            </span>
          ))}
        </div>
        <Button 
          onClick={() => handleDetailClick(uuid)}
          className="flex items-center"
        >
          유저 프로필로 가기 &nbsp;
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </Button>
      </Skill>
    </MemberInfoDiv>
  );
};

const MemberInfoDiv = tw.div`
  relative
  w-full
  min-h-20
  lg:flex-row
  flex-wrap
  justify-between
  shadow-lg
  bg-white
  rounded-2xl
  p-5
  space-y-2
  transition-all
  border-2 border-transparent
  hover:border-appBlue3
`;

const Header = tw.div`
  flex  
  items-center
  mb-5
`;

const ProfileImg = tw.img`
  rounded-full
  mr-2
  h-[5rem]
  w-[5rem]
`;

const Info = tw.p`
  ml-2
  font-bold
  text-2xl
  flex
  items-center
`;

const Body = tw.div`
  mb-5
`;

const Skill = tw.div`
  flex
  justify-between
  mt-2
`;

const Button = tw.button`
  bg-appYellow
  text-black
  p-2
  mx-2
  transition-all
  hover:bg-appBlue1
  hover:text-white
`;

export default MemberCard;
