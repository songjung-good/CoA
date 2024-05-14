import React from 'react';
import tw from 'tailwind-styled-components';
import useCommonCodeStore from '@/store/commoncode';

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
  
  const bookmarkDisplay = memberInfo.isBookmark ? (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mt-[0.2rem]">
      <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mt-[0.2rem]">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
    </svg>
  );
  const mineDisplay = memberInfo.isMine ? ( 
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
    </svg>
  )

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
  text-xl
  flex
`;

const Body = tw.div`
  mb-5
`;

const Skill = tw.div`
  mt-2
`;


export default MemberCard;
