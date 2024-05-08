// GitlabRepo 컴포넌트
// 사용자의 Gitlab ID를 받아 Repository 목록을 불러와 보여주는 컴포넌트

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import tw from 'tailwind-styled-components';

// GitHub 개인 액세스 토큰
const accessToken = process.env.NEXT_PUBLIC_GITLAB_ACCESS_TOKENS;

interface Repo {
  id: number;
  name: string;
  web_url: string;
  isAnalyzed: boolean;
}

interface MyRepoProps {
  userID: string;
}

const GitlabRepo: React.FC<MyRepoProps> = ({ userID }) => {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await axios.get(
          `https://lab.ssafy.com/api/v4/users/${userID}/contributed_projects`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setRepos(response.data);
        setLoading(false);
      } catch (error) {
        console.error('해당 요청에 문제가 생겼습니다. : ', error);
      }
    };

    fetchRepos();

    return () => {
      // Cleanup
    };
  }, [userID]);

  if (loading) {
    return <Loading>목록을 받아오는 중 입니다.</Loading>;
  }

  return (
    <RepoList>
      {repos.map((repo) => (
        <RepoItem key={repo.id}>
          <a href={repo.web_url} target="_blank" rel="noopener noreferrer">
            {repo.name}
          </a>
          <Buttons>
            <Button>분석하기</Button>
            {repo.isAnalyzed && (
              <Button>상세보기</Button>
            )}
          </Buttons>
        </RepoItem>
      ))}
    </RepoList>
  );
};

const Loading = tw.div`
  text-center
  mt-4
`;

const RepoList = tw.ul`
  flex
  justify-center
  flex-wrap
  list-none
  p-30
`;

const RepoItem = tw.li`
  border
  border-appGrey2
  rounded-md
  m-1
  p-2
  relative
  flex
  justify-center
  items-center
  flex-col
  transition
  duration-300
  hover:shadow-md
`;

const Buttons = tw.div`
  buttons
  absolute
  top-1/2
  left-1/2
  transform
  -translate-x-1/2
  -translate-y-1/2
  opacity-0
  invisible
  transition-all
  duration-300
  flex
  gap-2
`;

const Button = tw.button`
  bg-blue-500
  text-white
  font-bold
  py-1
  px-2
  text-sm
  rounded
`;

export default GitlabRepo;
