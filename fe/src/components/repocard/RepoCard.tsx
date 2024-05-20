import React, { useState } from 'react';
import tw from 'tailwind-styled-components';
// 임시데이터
import repocardDTO from '@/components/repocard/repocardDTO';

interface RepoCardProps {
  data: {
    memberId: number;
    memberNickName: string;
    memberImg: string;
    repoViewId: number;
    repoViewTitle: string;
    repoViewSubTitle: string;
    skillList: string[];
    dateRange: { startDate: string; endDate: string };
    isMine: boolean;
  };
}

const RepoCard: React.FC<RepoCardProps> = ({ data }) => {
  const [hovered, setHovered] = useState(false);

  const {
    memberNickName,
    memberImg,
    repoViewTitle,
    repoViewSubTitle,
    skillList,
    dateRange,
    isMine,
  } = data;

  return (
    <div
      className="relative" // 상대 위치 설정
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hovered && 
      <CardOverlay>
        <ButtonWrapper>
          <button className="bg-appGrey1 text-black font-bold py-2 px-4 rounded mr-2">
            결과분석
          </button>
          <button className="bg-appYellow text-white font-bold py-2 px-4 rounded">
            재분석
          </button>
        </ButtonWrapper>
      </CardOverlay>
      }
      <Card>
        <AvatarWrapper>
          <Avatar src={data.memberImg} alt={memberNickName} />
          <div>
            <ContentWrapper>
              <RepoName>{memberNickName}</RepoName>
            </ContentWrapper>
            <Description>{repoViewSubTitle}</Description>
            <Date>
              {dateRange.startDate} ~ {dateRange.endDate}
            </Date>
          </div>
        </AvatarWrapper>
        {/* skill 소제목 */}
        <div>
          <SkillLabel>프로젝트 스킬</SkillLabel>
          <SkillWrapper>
            {/* skill 데이터 반복 */}
            {skillList.map((skill, index) => (
              <Skill key={index}>{skill}</Skill>
            ))}
          </SkillWrapper>
        </div>
      </Card>
    </div>
  );
};

const data = repocardDTO.temporaryData;

const RepoCardList: React.FC = () => {
  return (
    <div>
    <div className='flex flex-wrap justify-start align-center mt-5'>
      {data.map((item, index) => (
        <RepoCard key={index} data={item} />
      ))}
    </div>
    </div>
  );
};

const CardOverlay = tw.div`
  absolute
  w-[25rem] 
  h-[20rem] 
  border
  border-appYellow
  rounded-lg 
  bg-white
  m-2.5 
  flex
  items-center
  justify-center
  z-10
  pointer-events-none
`;

const Card = tw.div`
  w-[25rem] 
  h-[20rem] 
  border
  border-appYellow
  rounded-lg 
  m-2.5 
  flex
  flex-col
  p-4
  bg-appBlue4
  justify-between
`;

const AvatarWrapper = tw.div`
  flex
  items-center
`;

const Avatar = tw.img`
  w-16
  h-16
  mr-2.5
  rounded-full
  border
  border-appRed
`;

const ContentWrapper = tw.div`
  flex
  justify-between
  items-center
  mb-2
`;

const RepoName = tw.h2`
  text-lg
  font-bold
`;

const Description = tw.p`
  text-gray-600
  mb-2
`;

const Date = tw.p`
  text-gray-600
`;

const SkillWrapper = tw.div`
  flex
  flex-wrap
  items-center
  mt-2
`;

const SkillLabel = tw.span`
  mr-2
  font-bold
`;

const Skill = tw.span`
  m-1
  bg-white
  border
  border-gray-300
  rounded-md
  px-2
  py-1
  text-xs
  inline-flex
  items-center 
`;

const ButtonWrapper = tw.div`
  flex
  align-center
  justify-center
`;

export default RepoCardList;
