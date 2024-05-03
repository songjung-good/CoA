// Url을 입력받아 GitHub 정보를 가져오는 컴포넌트
"use client";

import React, { useState } from "react";
import tw from "tailwind-styled-components";

// 컴포넌트 불러오기
import UserModal from '@/components/analyzer/UserModal';
import FetchGithubInfo from './FetchGithubInfo';

// 타입 정리
interface UserData {
  avatar_url: string;
  id: number;
  login: string;
  type: string;
  url: string;
  projectId: number;
  repositoryName: string;
}

interface GitHubResponse {
  data: UserData[];
  repositoryName: string;
}

interface GitLabResponse {
  data: UserData[];
  projectId: number;
}

type ApiResponse = GitHubResponse | GitLabResponse;

const UrlInput = () => {
  const [inputValue, setInputValue] = useState('');
  const [userData, setUserData] = useState<ApiResponse | null>(null);

  // 입력 값 변경 시 핸들러
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    console.log('handleChange', inputValue);
  };

  // Enter 키 입력 시 실행될 함수
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      fetchGitHubInfo();
    }
  };

  // FetchGithubInfo 컴포넌트를 불러와서 사용
  const fetchGitHubInfo = async () => {
    console.log('fetchGitHubInfo', inputValue);
    FetchGithubInfo(inputValue, setUserData);
  };

  return (
    <Container>
      <StyledInput
        type="text"
        placeholder="🔎Repository URL을 입력하세요"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <StyledButton onClick={fetchGitHubInfo}>분석하기</StyledButton>
      {userData && 
      (userData as GitHubResponse).repositoryName &&  // GitHubResponse 타입인지 확인
      <UserModal userData={userData as GitHubResponse} /> // GitHubResponse 타입으로 변환
    } 
    </Container>
  );
};

const Container = tw.div`
  max-w-screen-xl
  w-4/5
  flex
  justify-evenly
`;

const StyledInput = tw.input`
  w-4/5
  px-4
  py-2
  border-2
  border-appGrey2
  rounded-full
  transition-colors
  duration-300
  hover:border-blue-400
`;

const StyledButton = tw.button`
  border-2
  border-appGrey2
  rounded-full
  transition-colors
  duration-300
  hover:border-blue-400
`;

export default UrlInput;
