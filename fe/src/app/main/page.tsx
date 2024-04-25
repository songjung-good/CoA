'use client'

// src/app/main/page.tsx
import React from 'react';
import styled from 'styled-components';
// 레포지토리 분석기(URL 입력)
import UrlInput from '@/components/analyzer/UrlInput';
// 개인 레포 불러오기
import MyRepo from '@/components/repocard/MyRepo';

const MainPage = () => {
  return (
    <Main>
      <Header>
        <Description>
          <Title>당신의 프로젝트 COA에서 분석해보세요</Title>
          <SubTitle>분석하고 싶은 프로젝트의 URL만 입력하면 해당 레포지토리 분석을 시작합니다.</SubTitle>
          <Img></Img>
        </Description>
        <UrlInput />
      </Header>
      <MyRepo userID='songjung-good' />
    </Main>
  );
};

export default MainPage;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Header = styled.div`
  background-color: #88DDFB;
  text-align: center;
  padding: 3rem 0;
`;

const Description = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 15rem;
`;

const Title = styled.h1`
  font-size: 1.875rem;
  margin-bottom: 1rem;
  font-weight: bold;
  font-size: 3rem;
`;

const SubTitle = styled.p`
  margin-bottom: 1rem;
  색상 어떻게 넣냐 ㄷㄷ
  font-weight: bold;
  font-size: 1.125rem;
`;

const Img = styled.img`
  margin-bottom: 1rem;
`;
