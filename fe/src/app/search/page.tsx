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
interface RepoSearchResult {
  url: string,
  memberId: string;
  memberNickName: string;
  memberImg: string;
  repoViewId: number;
  repoViewTitle: string;
  repoViewSubTitle: string;
  repoMemberCnt: number;
  skillList: string[];
  dateRange: {
    startDate: string;
    endDate: string;
  };
  isMine: boolean;
}
interface MemberSearchResult {
  memberId: string;
  memberNickName: string;
  memberImg: string;
  memberIntro: string;
  skillList: string[];
  memberJobCodeId: number;
  isMine: boolean;
  isBookmark: boolean;
}

const SearchPage = () => {
  const [searchQuery, setQuery] = useState<string>('');
  const [searchType, setSearchType] = useState<'repo' | 'member'>('repo');
  const [results, setResults] = useState<RepoSearchResult[] | MemberSearchResult[]>([]);
  const [page, setPage] = useState<number>(0);

  // 검색 실행 함수
  const handleSearch = async (query: string, type: 'repo' | 'member') => {
    setQuery(query);
    setSearchType(type);
    setResults([]);
    const data = await fetchSearchResults(query, type, page);
    await setResults(data); // 검색 결과 상태 업데이트
  };

  return (
    <Main className="max-w-screen-xl mx-auto">
      <SearchInput onSearch={handleSearch} />
      {results.length > 0 ? (
        searchType === 'repo' ? (
          <ResultComponent className="mt-8 grid gap-8 grid-cols-1 justify-center items-start">
            {(results as RepoSearchResult[]).map((result, index) => (
              <RepoCard key={`repo-${result.repoViewId}-${index}`} repoInfo={result} />
              ))}
          </ResultComponent>
        ) : (
          <ResultComponent className="mt-8 grid gap-8 grid-cols-1 justify-center items-start">
            {(results as MemberSearchResult[]).map((result) => (
              <MemberCard key={result.memberId} memberInfo={result} />
            ))}
          </ResultComponent>
        )
      ) : (
        <p>검색 결과가 없습니다.</p>
      )}
      <PageTransition>
        <Button>이전 페이지로 이동</Button>
        <Button>다음 페이지로 이동</Button>
      </PageTransition>
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
  justify-between
`

const Button = tw.button`
  
`

export default SearchPage;
