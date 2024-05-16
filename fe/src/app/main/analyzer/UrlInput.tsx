// Url을 입력받아 GitHub 정보를 가져오는 컴포넌트
"use client";

// 라이브러리
import React, { useState } from "react";
import tw from "tailwind-styled-components";
// 컴포넌트 불러오기
import UserModal from "@/app/main/analyzer/UserModal";
import FetchGitInfo from "@/app/main/analyzer/FetchGitInfo";

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
}

interface GitLabResponse {
  data: UserData[];
  projectId: number;
}

type ApiResponse = GitHubResponse | GitLabResponse;

const UrlInput = () => {
  const [inputValue, setInputValue] = useState("");
  const [userData, setUserData] = useState<ApiResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 입력 값 변경 시 핸들러
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  // Enter 키 입력 시 실행될 함수
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      fetchGitInfo();
    }
  };

  // FetchGithubInfo 컴포넌트를 불러와서 사용
  const fetchGitInfo = async () => {
    if (inputValue === "") {
      console.log(`GitlabUser가 null 입니다.`);
    } else {
      FetchGitInfo(inputValue, setUserData);
      setIsModalOpen(true);
    }
  };

  // 모달 닫기 함수
  const closeModal = () => {
    setIsModalOpen(false); // 모달 상태를 false로 설정
    setInputValue(""); // 입력값 초기화
    setUserData(null); // 사용자 데이터 초기화
  };

  return (
    <div className="flex justify-center">
      <Container>
        <StyledInput
          type="text"
          placeholder="🔎Repository URL을 입력하세요"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <StyledButton onClick={fetchGitInfo}>분석하기</StyledButton>
        {isModalOpen &&
          userData &&
          ("projectId" in userData ? (
            <UserModal
              userData={userData as GitHubResponse}
              onClose={closeModal}
              url={inputValue}
            />
          ) : (
            <UserModal
              userData={userData as GitLabResponse}
              onClose={closeModal}
              url={inputValue}
            />
          ))}
      </Container>
    </div>
  );
};

const Container = tw.div`
  max-w-screen-xl
  w-4/5
  flex
  justify-evenly
  p-4
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
  border-appPink
  rounded-full
  px-2
  transition-colors
  duration-300
  hover:border-blue-400
`;

export default UrlInput;
