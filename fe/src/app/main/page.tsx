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
            <Title>당신의 프로젝트 COA에서 분석해보세요</Title>
            <UrlInput />
            <SubTitle>
              분석하고 싶은 프로젝트의 URL만 입력하면
              <br /> 해당 레포지토리 분석을 시작합니다.
            </SubTitle>
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
        <Heading>여기는 자주찾는 레포</Heading>
        <ExhibitRepo />
      </Div>
      <Div>
        <Heading>여기는 통계 컴포넌트</Heading>
      </Div>
    </Main>
  );
};

const Main = tw.main`
  bg-appGrey1
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

const Description = tw.h3`
  flex
  flex-row
  w-full
  min-h-[300px]
  sm:w-2/3
  items-center
  bg-white
  sm:items-center
  sm:justify-between
  max-w-screen-xl
  sm:flex-row
  border
  shadow-lg
  rounded-2xl
  hover:border-appBlue1
`;

const TextWrapper = tw.div`
  w-full
  pl-5 pr-2 py-10
`;

const Title = tw.h2`
  font-bold
  text-left
  mb-4
  lg:text-3xl
  md:text-xl
  sm:text-md
`;

const SubTitle = tw.p`
  font-light
  text-left
  lg:text-lg
  md:text-sm
  sm:text-xs
`;

const Img = tw.img`
  ml-10
  w-auto
  opacity-60
  blur-l-xl
  rounded-r-2xl
  shadow-md
`;

const Div1 = tw.div`
  max-w-screen-xl
  justify-center
  w-full
  bg-white
  mt-10
  px-6
  py-4
  border
  shadow-lg
  rounded-2xl
  hover:border-appBlue1
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
  mx-auto
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
