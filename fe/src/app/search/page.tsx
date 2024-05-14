'use client'
// 라이브러리
import React, { useState } from 'react';
import tw from 'tailwind-styled-components';
// 컴포넌트
import SearchInput from '@/app/search/SearchInput';
import { fetchSearchResults } from '@/api/search/fetchSearchResults';
import RepoCard from '@/components/searchcomponents/RepoCard';
import MemberCard from '@/components/searchcomponents/MemberCard';

// 타입 정의
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

interface MemberCardDto {
  memberUuid: string;
  memberNickName: string;
  memberImg: string;
  memberIntro: string;
  skillList: Skill[];
  memberJobCodeId: number;
  isMine: boolean;
  isBookmark: boolean;
}

interface ResultDTO {
  isSuccess: boolean;
  message: string;
  code: number;
  result: {
    repoCardDtoList: RepoCardDto[] | undefined;
    memberCardDtoList: MemberCardDto[] | undefined;
    next: boolean;
  };
}

const SearchPage = () => {
  const [searchQuery, setQuery] = useState<string>('');
  const [searchType, setSearchType] = useState<'repo' | 'member'>('repo');
  const [results, setResults] = useState<ResultDTO>();
  const [page, setPage] = useState<number>(0);
  const [isNext, setIsNext] = useState<boolean>(false);

  // 검색 실행 함수
  const handleSearch = async (query: string, type: 'repo' | 'member') => {
    try {
      setQuery(query);
      setSearchType(type);
      setResults(undefined);
      setPage(0);
      const response = await fetchSearchResults(query, type, page);
      setResults(response);
    } catch (error) {
      console.error(error);
    }
  };
  
  // 페이지 변경 함수
  const handlePageChange = async (page: number) => { 
    try {
      setPage(page);
      const response = await fetchSearchResults(searchQuery, searchType, page);
      setResults(response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Main className="max-w-screen-xl mx-auto">
      <SearchInput onSearch={handleSearch} />
        {results ? (
        searchType === 'repo' ? (
          <ResultComponent className="mt-8 grid gap-8 grid-cols-1 justify-center items-start">
            {(results.result.repoCardDtoList as RepoCardDto[]).map((result, index) => (
              <RepoCard key={`repo-${result.repoViewId}-${index}`} data={result} />
              ))}
          </ResultComponent>
        ) : (
          <ResultComponent className="mt-8 grid gap-8 grid-cols-1 justify-center items-start">
            {(results.result.memberCardDtoList as MemberCardDto[]).map((result) => (
              <MemberCard key={result.memberUuid} memberInfo={result} />
            ))}
          </ResultComponent>
        )
      ) : (
        <p>검색 결과가 없습니다.</p>
      )}
      {results && (
        <PageTransition>
          <Button onClick={() => handlePageChange(page + 1)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />
            </svg>
          </Button>
          {page > 0 && 
            <Button onClick={() => handlePageChange(page - 1)}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5" />
              </svg>
            </Button>
          }
        </PageTransition>
      )}
    </Main>
  );
};

const Main = tw.div`
  max-w-screen-xl
  mx-auto
`;

const ResultComponent = tw.div`
  mt-8
  grid
  gap-8
  grid-cols-1
  justify-center
  items-start
`;

const PageTransition = tw.div`
  mt-3
  flex
  flex-row-reverse
  justify-between
`;

const Button = tw.button`
  bg-appYellow
  text-black
  px-3
  py-1
  m-2
  text-xl
  font-sm
  rounded-xl
  transition-all
  border-2 border-transparent
  hover:border-appRed
`;

export default SearchPage;
