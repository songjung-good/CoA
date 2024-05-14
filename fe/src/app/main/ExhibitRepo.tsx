"use client";
// 라이브러리
import React, { useEffect, useState } from 'react';
import UseAxios from '@/api/common/useAxios';
// 컴포넌트
import MainRepoCard from '@/components/maincomponents/MainRepoCard'
// 인터페이스
interface Skill {
  codeId: number;
  codeName: string;
}

interface RepoLineCnt {
  codeName: string;
  lineCnt: number;
}

interface Comment {
  commentStartIndex: number;
  commentEndIndex: number;
  commentContent: string;
}

interface RepoCardDto {
  memberId: number;
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

interface BasicDetailDto {
  repoReadme: string;
  repoViewResult: string;
  commentList: Comment[];
  repoViewTotalCommitCnt: number;
  repoViewCommitCnt: number;
  repoViewMemberCnt: number;
  repoLineCntList: RepoLineCnt[];
}

interface CommitScoreDto {
  readability: number;
  performance: number;
  reusability: number;
  testability: number;
  exception: number;
  total: number;
  scoreComment: string;
}

interface RepoData {
  repoCardDto: RepoCardDto;
  basicDetailDto: BasicDetailDto;
  commitScoreDto: CommitScoreDto;
}

const axios = UseAxios();

const ExhibitRepo: React.FC = () => {
  const [data, setData] = useState<RepoData[]>([]); // 데이터 상태

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/repos/main/popular');
        setData(response.data.result);
          } catch (error) {
        console.error("API 요청 중 에러 발생:", error);
      }
    };
  
    fetchData();
  }, []);

  return (
    <div className='flex flex-wrap justify-center align-center mt-5'>
      {data.map((item, index) => (
        <MainRepoCard key={index} data={item} />
      ))}
    </div>
  );
};

export default ExhibitRepo;