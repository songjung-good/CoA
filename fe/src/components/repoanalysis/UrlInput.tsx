'use client'

import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

// GitHub 정보 추출 함수
const extractUserInfo = (url: string) => {
  const regex = /https:\/\/github\.com\/([^\/]+)\/([^\/]+)/;
  const match = url.match(regex);

  if (match) {
    return { username: match[1], repositoryName: match[2] };
  } else {
    return { username: null, repositoryName: null };
  }
};

const UrlInput = () => {
  const [inputValue, setInputValue] = useState('');

  // 입력 값 변경 시 핸들러
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  // Enter 키 입력 시 실행될 함수
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      fetchGitHubInfo(); // Enter 키를 누르면 분석을 시작합니다.
    }
  };

  // GitHub 정보 요청 함수
  const fetchGitHubInfo = async () => {
    const githubInfo = extractUserInfo(inputValue);

    if (githubInfo.username && githubInfo.repositoryName) {
      try {
        const response = await axios.get(`https://api.github.com/repos/${githubInfo.username}/${githubInfo.repositoryName}/contributors`);
        console.log(response.data); // 응답 데이터를 콘솔에 출력. 실제 애플리케이션에서는 이 데이터를 적절하게 활용합니다.
      } catch (error) {
        console.error("GitHub 정보를 가져오는 데 실패했습니다.", error);
      }
    } else {
      console.log("유효한 GitHub URL을 입력하세요.");
    }
  };

  return (
    <Styleddiv>
      <StyledInput
        type="text"
        placeholder="🔎Repository URL을 입력하세요"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <Styledbutton onClick={fetchGitHubInfo}>분석하기</Styledbutton>
    </Styleddiv>
  );
};

// 
const Styleddiv = styled.div`
  display: flex; 
  alignItems: center;
`;

// 입력창 css
const StyledInput = styled.input`
  width: 80%;
  padding: 10px;
  margin: 0 auto;
  display: block;
  border: 2px solid black;
  border-radius: 25px;
  transition: border-color 0.3s ease;
  &:hover {
    border-color: #cccccc;
  }
`;

// 입력 버튼 css
const Styledbutton = styled.button`
  border: 2px solid black;
  border-radius: 25px;
  &:hover {
    border-color: #cccccc;
  }
`;

export default UrlInput;
