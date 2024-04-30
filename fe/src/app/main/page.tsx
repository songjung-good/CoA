'use client'

// src/app/main/page.tsx
import React from 'react';
// 레포지토리 분석기(URL 입력)
import UrlInput from '@/components/analyzer/UrlInput';
// 개인 레포 불러오기
import MyRepo from '@/components/repocard/MyRepo';
// 임시 레포 카드
import RepoCard from '@/components/repocard/RepoCard';
import tw from 'tailwind-styled-components';

const MainPage = () => {
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
      <Div>
        <Heading>여기는 나의 레포</Heading>
        <MyRepo userID='songjung-good' />
      </Div>
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
  w-4/5
  bg-white
  mt-10
  p-4
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
  mx-8
`;

const Title = tw.h1`
  font-bold
  text-3xl
  lg:text-5xl
  text-left
  mb-4
`;

const SubTitle = tw.p`
  font-light
  text-lg
  text-left
  mb-4
`;

const TextWrapper = tw.div`
  w-1/2
`;

const Img = tw.img`
  w-1/2
  mb-4
  ml-4
  opacity-60
  rounded-md
  shadow-md
`;

const Div = tw.div`
  w-4/5
  bg-white
  mt-10
  p-4
  border
  shadow-lg
  rounded-2xl
  hover:border-appBlue1
`;
  

const Div1 = tw.div`
  w-4/5
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
