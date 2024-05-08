// 메인페이지의 프로젝트 카드를 나타내는 컴포넌트

// 라이브러리
import React, { useState } from 'react';
import tw from 'tailwind-styled-components';

// 컴포넌트
import DetailButton from './DetailButton'; // DetailButton 컴포넌트 가져오기

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
  onDetailClick: (repoViewId: string) => void;
}

const MainRepoCard: React.FC<RepoCardProps> = ({ data, onDetailClick }) => {
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
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <DetailButton hovered={hovered} repoViewId={data.repoViewId.toString()} onDetailClick={onDetailClick} />
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
        <div>
          <SkillLabel>프로젝트 스킬</SkillLabel>
          <SkillWrapper>
            {skillList.map((skill, index) => (
              <Skill key={index}>{skill}</Skill>
            ))}
          </SkillWrapper>
        </div>
      </Card>
    </div>
  );
};

const Card = tw.div`
  w-[25rem] 
  h-[15rem]
  border
  border-appGrey2
  rounded-lg 
  m-[3rem] 
  flex
  flex-col
  p-4
  justify-between
  hover:border-appBlue1
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

export default MainRepoCard;
