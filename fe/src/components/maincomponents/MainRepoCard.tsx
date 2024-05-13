// 메인페이지의 프로젝트 카드를 나타내는 컴포넌트

// 라이브러리
import React, { useState } from 'react';
import tw from 'tailwind-styled-components';
// 컴포넌트
import DetailButton from './DetailButton'; // DetailButton 컴포넌트 가져오기
// 인터페이스
interface Skill {
  codeId: number;
  codeName: string;
}

interface RepoLineCnt {
  codeName: string;
  lineCnt: number;
}

interface Comment {
  commentStartIndex: number;
  commentEndIndex: number;
  commentContent: string;
}

interface RepoCardDto {
  memberId: number;
  memberNickname: string;
  memberImg: string;
  repoViewId: number;
  repoViewPath: string;
  repoViewTitle: string;
  repoViewSubtitle: string;
  repoMemberCnt: number;
  skillList: Skill[];
  repoStartDate: string;
  repoEndDate: string;
  isMine: boolean;
}

interface BasicDetailDto {
  repoReadme: string;
  repoViewResult: string;
  commentList: Comment[];
  repoViewTotalCommitCnt: number;
  repoViewCommitCnt: number;
  repoViewMemberCnt: number;
  repoLineCntList: RepoLineCnt[];
}

interface CommitScoreDto {
  readability: number;
  performance: number;
  reusability: number;
  testability: number;
  exception: number;
  total: number;
  scoreComment: string;
}

interface RepoData {
  repoCardDto: RepoCardDto;
  basicDetailDto: BasicDetailDto;
  commitScoreDto: CommitScoreDto;
}

interface RepoCardProps {
  data: RepoData;
}

const MainRepoCard: React.FC<RepoCardProps> = ({ data }) => {
  const [hovered, setHovered] = useState(false);
  const result = data.repoCardDto
  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <DetailButton hovered={hovered} repoViewId={result.repoViewId.toString()} />
      <Card>
        <AvatarWrapper>
          <Avatar src={result.memberImg} alt={result.memberNickname} />
          <div>
            <ContentWrapper>
              <RepoName>{result.repoViewTitle}</RepoName>
            </ContentWrapper>
            <Description>{result.repoViewSubtitle}</Description>
            <Date>
              {result.repoStartDate} ~ {result.repoEndDate}
            </Date>
          </div>
        </AvatarWrapper>
        <div>
          <SkillLabel>프로젝트 스킬</SkillLabel>
          <SkillWrapper>
            {result.skillList.map((skill, index) => (
              <Skill key={index}>{skill.codeName}</Skill>
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

// const Card = tw.div`
//   w-[25rem] 
//   h-[15rem]
//   border
//   border-appGrey2
//   rounded-lg 
//   m-[2rem] 
//   flex
//   flex-col
//   p-4
//   justify-between
//   hover:border-appBlue1
//   lg:w-[32rem] h-[25rem]
//   md:w-[28rem] h-[18rem]
//   sm:w-[25rem] h-[15rem]
// `;

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