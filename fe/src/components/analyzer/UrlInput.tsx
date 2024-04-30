"use client";

import React, { useState } from "react";
import axios from "axios";
import tw from "tailwind-styled-components";

// 받는 파일
import UserModal from '@/components/analyzer/UserModal';
import { ExtractUserInfo } from '@/components/analyzer/ExtractUserInfo';

// 타입 정리
interface User {
  avatar_url: string;
  contributions: number;
  events_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  gravatar_id: string;
  html_url: string;
  id: number;
  login: string;
  node_id: string;
  organizations_url: string;
  received_events_url: string;
  repos_url: string;
  site_admin: boolean;
  starred_url: string;
  subscriptions_url: string;
  type: string;
  url: string;
}

const UrlInput = () => {
  const [inputValue, setInputValue] = useState('');
  const [userData, setUserData] = useState<User[] | null>(null);
  const [repoName, setRepoName] = useState<string | null>(null);

  // 입력 값 변경 시 핸들러
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  // Enter 키 입력 시 실행될 함수
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      fetchGitHubInfo();
    }
  };

  // GitHub 정보 요청 함수
  const fetchGitHubInfo = async () => {
    const githubInfo = ExtractUserInfo(inputValue);

    if (githubInfo.username && githubInfo.repositoryName) {
      try {
        const response = await axios.get(
          `https://api.github.com/repos/${githubInfo.username}/${githubInfo.repositoryName}/contributors`,
        );
        // console.log(response.data);
        setUserData(response.data);
      } catch (error) {
        console.error("GitHub 정보를 가져오는 데 실패했습니다.", error);
      }
    } else {
      console.log("유효한 GitHub URL을 입력하세요.");
    }
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
      <div>{userData && <UserModal userData={userData} />}</div>
    </Container>

  );
};

const Container = tw.div`
  w-4/5
  flex
  justify-around
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
