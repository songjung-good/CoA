// mainpage > UrlInput > FetchGithubInfo(ExtractUserInfo) > UserModal

"use client";

// 라이브러리
import React from "react";
import Image from "next/image";
import tw from "tailwind-styled-components";
import { useStore } from "zustand";

// 컴포넌트
// URL 입력(레포지토리 분석을 위한)
import UrlInput from "@/app/main/analyzer/UrlInput";
// 나의 레포
import GitlabRepo from "@/app/main/GitlabRepo";
import GithubRepo from "@/app/main/GithubRepo";
// 레포 카드
import ExhibitRepo from "@/app/main/ExhibitRepo";
// 유저 정보
import UserProfile from "@/components/maincomponents/UserProfile";

// 전역변수
import userStore from "@/store/user";

const MainPage: React.FC = () => {
  const githubUserName = useStore(userStore).githubUserName;
  const isGithubToken = useStore(userStore).isGithubToken;
  const gitlabUserName = useStore(userStore).gitlabUserName;
  const isGitlabToken = useStore(userStore).isGitlabToken;

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
        <RepoLeft>
          <Heading>
            <Image
              src="/image/oauth/github-mark.svg"
              alt="github logo"
              width={30}
              height={30}
              className="mr-2"
            />
            GitHub
          </Heading>
          <GithubRepo userID={githubUserName} isToken={isGithubToken} />
        </RepoLeft>
        <RepoRight>
          <Heading>
            <Image
              src="/image/oauth/gitlab-mark.svg"
              alt="github"
              width={30}
              height={30}
              className="mr-2"
            />
            GitLab
          </Heading>
          <GitlabRepo userID={gitlabUserName} isToken={isGitlabToken} />
        </RepoRight>
      </RepoDiv>
      <Div>
        <Heading>유명한 프로젝트 분석 결과</Heading>
        <ExhibitRepo />
      </Div>
      {/* <Div>
        <Heading>여기는 통계 컴포넌트</Heading>
      </Div> */}
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
  rounded-lg
  sm:w-2/3
  items-center
  sm:items-center
  sm:justify-between
  max-w-screen-xl
  sm:flex-row
  bg-cover bg-analyze

`;

const TextWrapper = tw.div`
  relative
  w-full
  pl-5 pr-2 py-10
  items-center
  flex flex-col
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
  lg:text-lg
  md:text-sm
  sm:text-xs
`;

const RepoDiv = tw.div`
  flex 
  justify-between 
  w-full
  max-w-screen-xl
`;

const RepoLeft = tw.div`
  bg-white
  mt-10
  mr-4
  p-4
  border
  shadow-lg
  rounded-2xl
  hover:border-appBlue1
`;

const RepoRight = tw.div`
  bg-white
  mt-10
  ml-4
  p-4
  border
  shadow-lg
  rounded-2xl
  hover:border-appBlue1
`;

const Div = tw.div`
  max-w-screen-xl
  bg-white
  mt-10
  p-4
  border
  shadow-lg
  rounded-2xl
  hover:border-appBlue1
`;

const Heading = tw.h2`
  font-bold
  text-xl sm:text-2xl md:text-4xl
  flex
  items-center
  mb-2
`;

export default MainPage;
