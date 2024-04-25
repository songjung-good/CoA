"use client";

import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";

// 받는 파일
import UserModal from "@/components/Analyzer/UserModal";

// 타입 정리
interface UserModalProps {
  userData: {
    login: string;
    avatar_url: string;
  }[];
}

// 입력받은 정보 정리
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
  const [inputValue, setInputValue] = useState("");
  const [userData, setUserData] = useState<UserModalProps | null>(null);

  // 입력 값 변경 시 핸들러
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  // Enter 키 입력 시 실행될 함수
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      fetchGitHubInfo(); // Enter 키를 누르면 분석을 시작합니다.
    }
  };

  // GitHub 정보 요청 함수
  const fetchGitHubInfo = async () => {
    const githubInfo = extractUserInfo(inputValue);

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
  border: 2px solid black;
  border-radius: 25px;
  transition: border-color 0.3s ease;
  &:hover {
    border-color: #cccccc;
  }
`;

// 입력 버튼 css
const Styledbutton = styled.button`
  width: 10%;
  border: 2px solid black;
  border-radius: 25px;
  transition: border-color 0.3s ease;
  &:hover {
    border-color: #cccccc;
  }
`;

export default UrlInput;
