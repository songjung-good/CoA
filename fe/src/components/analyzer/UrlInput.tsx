"use client";

import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";

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
    <div>
      <Container>
        <StyledInput
          type="text"
          placeholder="🔎Repository URL을 입력하세요"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <Styledbutton onClick={fetchGitHubInfo}>분석하기</Styledbutton>
      </Container>
      <div>{/* {userData && <UserModal userData={userData} />} */}</div>
    </div>
  );
};

//
const Container = styled.div`
  width: 80%;
  display: flex;
  justify-content: space-around;
  margin: 0 auto;
`;

// 입력창 css
const StyledInput = styled.input`
  width: 80%;
  padding: 10px;
  display: block;
  border: 2px solid appYellow;
  border-radius: 25px;
  transition: border-color 0.3s ease;
  &:hover {
    border-color: appGrey2;
  }
`;

// 입력 버튼 css
const Styledbutton = styled.button`
  width: 10%;
  border: 2px solid black;
  border-radius: 25px;
  transition: border-color 0.3s ease;
  &:hover {
    border-color: appGrey2;
    transform: scale(1.05);
  }
`;

export default UrlInput;
