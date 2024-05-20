"use client";
// 라이브러리
import React, { useEffect, useState } from "react";
import UseAxios from "@/api/common/useAxios";
// 컴포넌트
import MainRepoCard from "@/components/maincomponents/MainRepoCard";
// 인터페이스
interface Skill {
  codeId: number;
  codeName: string;
}

interface RepoCardDto {
  memberUuid: string;
  memberNickname: string;
  memberImg: string;
  repoViewId: number;
  repoViewPath: string;
  repoViewTitle: string;
  repoViewSubtitle: string;
  repoMemberCnt: number;
  skillList: Skill[];
  repoStartDate: string;
  repoEndDate: string;
  isMine: boolean;
}

const axios = UseAxios();

const ExhibitRepo: React.FC = () => {
  const [data, setData] = useState<RepoCardDto[]>([]); // 데이터 상태

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/repos/main/popular");
        setData(response.data.result);
      } catch (error) {
        console.error("API 요청 중 에러 발생:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-wrap justify-center mt-5">
      {data.map((item, index) => (
        <MainRepoCard key={index} data={item} />
      ))}
    </div>
  );
};

export default ExhibitRepo;
