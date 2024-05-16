'use strict'
// 라이브러리
import React from 'react';
import tw from 'tailwind-styled-components';
import useCommonCodeStore from '@/store/commoncode';
import { useRouter } from "next/navigation";

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
  const handleDetailClick = (uuid: string) => {
    router.push(`/user/${uuid}`)
  };

  const bookmarkDisplay = memberInfo.isBookmark ? (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
    </svg>
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
        <div className='flex flex-col mb-[2rem]'>
          <Info>{memberInfo.memberNickName} | {jobName} | {bookmarkDisplay}</Info>
        </div>
        <ProfileImg
          src={memberInfo.memberImg}
          alt="member image"
        />
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
  justify-between
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
