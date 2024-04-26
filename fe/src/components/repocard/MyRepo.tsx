'use client'

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import tw from 'tailwind-styled-components';
import axios from 'axios';

interface Repo {
  id: number;
  name: string;
  html_url: string;
  isAnalyzed: boolean; // 분석 여부를 나타내는 필드 추가
}

interface MyRepoProps {
  userID: string;
}

const MyRepo: React.FC<MyRepoProps> = ({ userID }) => {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await axios.get(`https://api.github.com/users/${userID}/repos`);
        setRepos(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching repos:', error);
      }
    };

    fetchRepos();

    return () => {
      // Cleanup
    };
  }, [userID]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <RepoList>
      {repos.map((repo) => (
        <RepoItem key={repo.id}>
          <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
            {repo.name}
          </a>
          <ButtonWrapper>
            <AnalyzeButton>분석하기</AnalyzeButton>
            {repo.isAnalyzed && <DetailButton>상세보기</DetailButton>} 
          </ButtonWrapper>
        </RepoItem>
      ))}
    </RepoList>
  );
};

const RepoList = styled.ul`
  justify-content: center;
  display: flex;
  flex-wrap: wrap;
  list-style-type: none;
  padding: 30px;
`;

const RepoItem = styled.li`
  border: 1px solid #ccc;
  margin-top: 10px;
  margin-right: 10px;
  padding: 10px;
  position: relative;

  &:hover {
    .buttons {
      opacity: 1;
      visibility: visible;
    }
  }
`;

const ButtonWrapper = tw.div`
  buttons
  absolute
  top-1/2
  left-1/2
  transform -translate-x-1/2 -translate-y-1/2
  opacity 0
  visibility hidden
  transition-all
  duration-300
  flex
  gap-2
`;

const AnalyzeButton = tw.button`
  bg-blue-500
  text-white
  font-bold
  py-2
  px-4
  rounded
`;

const DetailButton = tw.button`
  bg-green-500
  text-white
  font-bold
  py-2
  px-4
  rounded
`;

export default MyRepo;
