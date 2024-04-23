'use client'

import React, { useState } from 'react';
import styled from 'styled-components';

// GitHub 정보 추출 함수
const extractUserInfo = (url) => {
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
  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  // 정보 추출 예시 (추출 로직은 실제 애플리케이션의 다른 부분에서 활용될 수 있음)
  const githubInfo = extractUserInfo(inputValue);
  // 콘솔에 사용자 이름과 레포지토리 명 출력
  console.log(githubInfo); 

  return (
    <div>
      <StyledInput
        type="text"
        placeholder="🔎Repository URL을 입력하세요"
        value={inputValue}
        onChange={handleChange}
      />
      <button>
        <a href={`https://api.github.com/repos/${githubInfo.username}/${githubInfo.repositoryName}/contributors`}>
          분석하기
        </a>
      </button>
    </div>
  );
};
  
const StyledInput = styled.input`
  width: 80%;
  padding: 10px;
  margin: 0 auto;
  display: block;
  border: 2px solid black;
  border-radius: 25px;
  transition: border-color 0.3s ease;

  &:hover {
    border-color: #333;
  }
`;

export default UrlInput;
