"use client";
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
  created_at: string;
  updated_at: string;
  star_count: number;
  description: string;
  isAnalyzed: boolean;
}

interface MyRepoProps {
  userID: string | null;
  isToken: boolean | null;
}

const GitlabRepo: React.FC<MyRepoProps> = ({ userID, isToken }) => {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [reposPerPage] = useState<number>(5);
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

  const indexOfLastRepo = currentPage * reposPerPage;
  const indexOfFirstRepo = indexOfLastRepo - reposPerPage;
  const currentRepos = repos.slice(indexOfFirstRepo, indexOfLastRepo);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loadingAuth) {
    return <Loading>인증 상태를 확인하는 중입니다.</Loading>;
  }
  if (notLink === 602 || isToken === null) {
    return (
      <Div>
        <Button onClick={() => router.push("/auth/link")}>계정 연동하기</Button>
        <p>연동된 gitlab 계정이 없습니다.</p>
      </Div>
    );
  }
  if (notLink === 303 || notLink === 606) {
    return (
      <Div>
        <Button onClick={() => router.push("/auth/link")}>계정 연동하기</Button>
        <p>엑세스 토큰을 갱신해주세요.</p>
      </Div>
    );
  }
  if (loading) {
    return <Loading>목록을 받아오는 중 입니다.</Loading>;
  }
  return (
    <RepoList>
      {currentRepos.map((repo, key) => (
        <li key={key}>
        <a
          href={repo.web_url}
          key={key}
          target="_blank"
          rel="noopener noreferrer"
          className="flex justify-center border rounded-lg mb-4 py-1 px-2"
        >
          <div className="flex flex-col justify-center w-full">
            <div className="flex flex-row sm:flex-col lg:flex-row justify-between items-center w-full">
              <p className="text-xl text-extrabold">{repo.name}</p>

              <p className="text-sm text-gray-400">
                {repo.created_at.slice(0, 10)}
              </p>
            </div>
            <p className="text-sm truncate">
              {repo.description ? repo.description : "설명을 추가해주세요."}
            </p>
            <div className="flex justify-between text-sm flex-row sm:flex-col lg:flex-row">
              <p>최종 커밋 : {repo.updated_at.slice(0, 10)}</p>
              <p>{`⭐(${repo.star_count})`}</p>
            </div>
            <p></p>
          </div>
        </a>
        </li>
      ))}
      <Pagination>
        {Array.from(
          { length: Math.ceil(repos.length / reposPerPage) },
          (_, i) => (
            <PageButton
              key={i + 1}
              isactive={i + 1 === currentPage ? 1 : 0}
              onClick={() => paginate(i + 1)}
            >
              {i + 1}
            </PageButton>
          ),
        )}
      </Pagination>
    </RepoList>
  );
};

const Loading = tw.div`
  text-center
  mt-4
`;

const RepoList = tw.ul`
  flex-col
  w-full
  justify-between
  items-center
  px-4
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
  my-1
  p-4
  flex
  flex-col
  justify-center
  items-center
`;

const Button = tw.button`
  bg-yellow-200
  hover:bg-yellow-400
  text-black
  font-bold
  py-[0.75rem]
  px-[1.25rem]
  my-[1rem]
  text-md
  rounded
  m-2
`;

const Pagination = tw.div`
  flex
  justify-center
  mt-4
`;

const PageButton = tw.button<{ isactive: number }>`
  ${(p) => (p.isactive ? "bg-blue-500 text-white" : "bg-blue-200 text-black")}
  hover:bg-blue-400
  font-bold
  py-[0.25rem]
  px-[0.75rem]
  mt-[1rem]
  text-md
  rounded
  m-2
`;

export default GitlabRepo;
