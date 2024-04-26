'use client'

// src/app/main/page.tsx
import React from 'react';
import styled from 'styled-components';
// 레포지토리 분석기(URL 입력)
import UrlInput from '@/components/analyzer/UrlInput';
// 개인 레포 불러오기
import MyRepo from '@/components/repocard/MyRepo';
// 임시 레포 카드
import RepoCard from '@/components/repocard/RepoCard';

const MainPage = () => {
  return (
    <Main>
      <Header>
        <Description>
          <TextWrapper>
            <Title>당신의 프로젝트 COA에서 분석해보세요</Title>
            <SubTitle>분석하고 싶은 프로젝트의 URL만 입력하면 해당 레포지토리 분석을 시작합니다.</SubTitle>
          </TextWrapper>
          <Img src='https://www.lgcns.com/wp-content/uploads/2021/11/9981C0435CB8247727.png'></Img>
        </Description>
        <div mt-2rem>
          <UrlInput />
        </div>
      </Header>
      <Div>
        여기는 나의 레포
        <MyRepo userID='songjung-good' />
      </Div>
      <Div>
        여기는 자주찾는 레포
        <RepoCard />
      </Div>
      <Div>
        여기는 통계 컴포넌트
      </Div>
    </Main>
  );
};

const Main = styled.main`
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: center;
`;

const Header = styled.div`
  background-color: #88DDFB;
  text-align: center;
  padding: 3rem 0;
`;

const Description = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  margin-bottom: 15rem;
  margin: 2rem;
`;

const Title = styled.h1`
  font-size: 1.875rem;
  margin-bottom: 1rem;
  font-weight: bold;
  font-size: 3rem;
  text-align: left;
`;

const SubTitle = styled.p`
  margin-bottom: 1rem;
  color: white;
  font-weight: bold;
  font-size: 1.125rem;
  text-align: left;
`;

const Img = styled.img`
  margin-bottom: 1rem;
  margin-left: 1rem;
  width: 50%;
  opacity: 0.6;
`;

const TextWrapper = styled.div`
  width: 50%;
`;

const Div = styled.div`
  margin-top: 1rem;
  width: 80%;
`

export default MainPage;
