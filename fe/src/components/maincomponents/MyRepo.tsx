import React, { useState, useEffect } from 'react';
import axios from 'axios';
import tw from 'tailwind-styled-components'; // tailwind-styled-components 라이브러리를 import

// GitHub 개인 액세스 토큰
const accessToken = process.env.NEXT_PUBLIC_GITHUB_ACCESS_TOKENS;

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
        const response = await axios.get(
          `https://api.github.com/users/${userID}/repos`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
          );
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
    return <Loading>Loading...</Loading>; // tw로 수정
  }

  return (
    <RepoList>
      {repos.map((repo) => (
        <RepoItem key={repo.id} onMouseEnter={() => console.log('Mouse Enter')} onMouseLeave={() => console.log('Mouse Leave')}>
          <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
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

export default MyRepo;
