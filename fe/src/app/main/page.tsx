"use client";

// 라이브러리
import React from "react";
import tw from "tailwind-styled-components";

// 컴포넌트
// URL 입력(레포지토리 분석을 위한)
import UrlInput from "@/app/main/analyzer/UrlInput";
// 나의 레포
import GitRepoList from "./GitRepoList";
// 레포 카드
import ExhibitRepo from "@/app/main/ExhibitRepo";
// 유저 정보
import UserProfile from "@/components/maincomponents/UserProfile";
import MainChart from "./MainChart";

const MainPage: React.FC = () => {
  return (
    <Main>
      <Header>
        <Description>
          <TextWrapper>
            <Title>당신의 프로젝트 "CoA"에서 분석해보세요</Title>
            <SubTitle>
              분석하고 싶은 프로젝트의 URL만 입력하면
              <br /> 해당 레포지토리 분석을 시작합니다.
            </SubTitle>
            <UrlInput />
          </TextWrapper>
        </Description>
        <UserProfile />
      </Header>
      <RepoDiv>
        <Div>
          <Heading>유명 프로젝트 분석 결과</Heading>
          <ExhibitRepo />
        </Div>
        <GitRepoList />
      </RepoDiv>

      <MainChart />
    </Main>
  );
};

const Main = tw.main`
  sm:mx-20
  mx-5
  flex
  flex-col
  items-center
  h-full
  bg-cover
`;

const Header = tw.div`
  max-w-screen-xl
  w-full
  mx-auto
  mt-10
  flex flex-col
  sm:flex-row
  items-center
`;

const Description = tw.div`
  relative
  flex
  flex-row
  w-full
  min-h-[300px]
  shadow-md
  rounded-lg
  sm:w-2/3
  items-center
  sm:items-center
  sm:justify-between
  max-w-screen-xl
  sm:flex-row
  border
  border-appGrey2
  bg-cover
  bg-tailwindbg
`;

const TextWrapper = tw.div`
  relative
  w-full
  pl-5 pr-2 py-10
  items-center
  flex
  flex-col
`;

const Title = tw.h2`
  font-bold
  mb-4
  lg:text-4xl
  md:text-2xl
  sm:text-xl
  flex
`;

const SubTitle = tw.p`
  font-md
  text-center
  mb-5
  lg:text-lg
  md:text-sm
  sm:text-xs
`;

const RepoDiv = tw.div`
  flex 
  flex-col sm:flex-row
  justify-between 
  w-full
  max-w-screen-xl
`;

const Div = tw.div`
  w-full
  sm:w-2/3
  bg-white
  mt-10
  p-4
  border
  shadow-lg
  rounded-2xl
  transition
  duration-300
`;

const Heading = tw.h3`
  font-medium
  text-lg sm:text-xl md:text-3xl
  flex
  items-center
  mb-2
`;

export default MainPage;
