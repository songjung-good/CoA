import React from 'react';
import tw from 'tailwind-styled-components';
import StarIcon from '@/icons/StarIcon';

const RepoCard = () => {
  return (
    <Card>
      <TopSection>
        <AvatarWrapper>
          <Avatar />  {/* 사용자 아바타 표시 */}
        </AvatarWrapper>
        <ContentWrapper>
          <RepoName>닉네임</RepoName> {/* 닉네임 표시 */}
          <StarIcon /> {/* 별 아이콘 표시 */}
        </ContentWrapper>
      </TopSection>
      <MiddleSection>
        <Description>자기소개 글</Description> {/* 자기소개 글 표시 */}
      </MiddleSection>
      <BottomSection>
        <Email>example@example.com</Email> {/* 이메일 표시 */}
        <SkillWrapper>
          <SkillLabel>기술 스택: </SkillLabel>
          <Skill>React</Skill>
          <Skill>Vue</Skill>
        </SkillWrapper>
      </BottomSection>
    </Card>
  );
};

const Card = tw.div`
  w-[50rem] 
  h-[20rem] 
  border
  border-appYellow
  rounded-lg 
  m-2.5 
  flex
  flex-col
  p-4
  bg-appGrey1
  justify-between
`;

const TopSection = tw.div`
  flex
  justify-between
`;

const MiddleSection = tw.div`
  flex
  flex-grow
`;

const BottomSection = tw.div`
  flex
  flex-col
`;

const AvatarWrapper = tw.div`
  flex
  items-center
`;

const Avatar = tw.div`
  w-16
  h-16
  bg-teal-500
  rounded-full
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

const Email = tw.p`
  text-gray-600
`;

const SkillWrapper = tw.div`
  flex
  items-center
  mt-2
`;

const SkillLabel = tw.span`
  mr-2
  font-bold
`;

const Skill = tw.span`
  mr-2
  bg-gray-200
  rounded-md
  px-2
  py-1
  text-xs
`;

export default RepoCard;
