'use client'
// 사용자의 Gitlab ID를 받아 Repository 목록을 불러와 보여주는 컴포넌트
// 라이브러리
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import tw from "tailwind-styled-components";
import UseAxios from "@/api/common/useAxios";

interface Repo {
  id: number;
  name: string;
  web_url: string;
  isAnalyzed: boolean;
}

interface MyRepoProps {
  userID: string | null;
  isToken: boolean | null;
}

const GitlabRepo: React.FC<MyRepoProps> = ({ userID, isToken }) => {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingAuth, setLoadingAuth] = useState<boolean>(true);
  const [notLink, setNotLink] = useState<number>(0);
  const axiosInstance = UseAxios();
  const router = useRouter();


  useEffect(() => {
    const fetchRepos = async () => {
      if (userID !== null) {
        try {
          const response = await axiosInstance.get(
            `api/external/gitlab/repos/${userID}`,
          );
          if (response.data.code !== 200) {
            setNotLink(response.data.code);
          }
          if (response.data.code === 200) {
            setRepos(JSON.parse(response.data.result));
          }
          setLoading(false);
        } catch (error) {
          console.error("해당 요청에 문제가 생겼습니다. : ", error);
        }
      } else {
        // console.log(`gitlab userID가 없습니다.`);
      }
      setLoadingAuth(false);
    };
    fetchRepos();

    return () => {
      // Cleanup
    };
  }, [userID]);

  if (loadingAuth) {
    return <Loading>인증 상태를 확인하는 중입니다.</Loading>;
  }
  if (notLink === 602 || isToken === null) {
    return (
      <Div>
        <Button onClick={() => router.push('/auth/link')}>계정 연동하기</Button>
        <p>연동된 gitlab 계정이 없습니다.</p>
      </Div>
    );
  }
  if (notLink === 303 || notLink === 606) {
    return (
      <Div>
        <Button onClick={() => router.push('/auth/link')}>계정 연동하기</Button>
        <p>엑세스 토큰을 갱신해주세요.</p>
      </Div>
    );
  }
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

const Div = tw.div`
  mx-auto
  my-1
  p-4
  px-[12rem]
  flex
  flex-col
  justify-center
  items-center
`;

const Button = tw.button`
  bg-appYellow
  text-black
  font-bold
  py-[0.75rem]
  px-[1.25rem]
  my-[1rem]
  text-md
  rounded
`;

export default GitlabRepo;
