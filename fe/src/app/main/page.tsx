// src/app/main/page.tsx
import React from 'react';
// 레포지토리 분석기(URL 입력)
import UrlInput from '@/components/Analyzer/UrlInput';
// 개인 레포 불러오기
import MyRepo from '@/components/RepoCard/MyRepo';

const MainPage = () => {
  return (
    <main>
      <h1>MainPage</h1>
      <UrlInput />
      <MyRepo userID='songjung-good' />
    </main>
  );
};

export default MainPage;
