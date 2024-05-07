'use client'

// 라이브러리
import React from 'react';
import tw from 'tailwind-styled-components';
import { useStore } from 'zustand';
import { Link } from 'react-router-dom';

// 컴포넌트
// URL 입력(레포지토리 분석을 위한)
import UrlInput from '@/components/analyzer/UrlInput';
// 개인 레포 불러오기
import GitlabRepo from '@/components/maincomponents/GitlabRepo';
import GithubRepo from '@/components/maincomponents/GithubRepo';
// 레포 카드(수정 필요)
import RepoCard from '@/components/maincomponents/RepoCard';

// 전역변수
// 유저정보
import userStore from '@/store/user';


const MainPage: React.FC = () => {
  const github = useStore(userStore).userName;
  const gitlab = useStore(userStore).gitlabName;

  return (
    <Main>
      <Header>
        <Description>
          <TextWrapper>
            <Title>당신의 프로젝트 <br />COA에서 분석해보세요</Title>
            <SubTitle>분석하고 싶은 프로젝트의 URL만 입력하면<br /> 해당 레포지토리 분석을 시작합니다.</SubTitle>
          </TextWrapper>
          <Img src='https://www.lgcns.com/wp-content/uploads/2021/11/9981C0435CB8247727.png'></Img>
        </Description>
      </Header>
      <Div1>
        <UrlInput />
      </Div1>
      <RepoDiv>
        <RepoLeft>
          <Heading>여기는 github</Heading>
          <GithubRepo userID={github} />
        </RepoLeft>
        <RepoRight>
          <Heading>여기는 gitlab</Heading>
          <GitlabRepo userID={gitlab} />
        </RepoRight>
      </RepoDiv>
      <Div>
        <Heading>여기는 자주찾는 레포</Heading>
        <RepoCard />
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
  mx-auto
  bg-white
  mt-10
  p-20
  border
  shadow-lg
  rounded-2xl
  hover:border-appBlue1
`;

const Description = tw.div`
  flex
  flex-row
  items-center
  justify-between
  max-w-screen-xl
`;

const Title = tw.h1`
  font-bold
  text-left
  mb-4
  xl:text-5xl
  md:text-4xl
  sm:text-3xl
`;

const SubTitle = tw.p`
  font-light
  text-lg
  text-left
`;

const TextWrapper = tw.div`
  mx-auto
`;

const Img = tw.img`
  mx-auto
  ml-10
  opacity-60
  rounded-md
  shadow-md
`;

const RepoDiv = tw.div`
  flex 
  justify-around 
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
  

const Div1 = tw.div`
  max-w-screen-xl
  flex
  justify-center
  w-2/3
  bg-white
  mt-10
  p-4
  border
  shadow-lg
  rounded-2xl
  hover:border-appBlue1
`;

const Heading = tw.h3`
  text
`;

export default MainPage;
