'use client'
// 라이브러리
import React, { useState } from 'react';
import tw from 'tailwind-styled-components';
// 컴포넌트
import SearchInput from '@/app/search/SearchInput';
import SearchResult from '@/components/searchcomponents/SearchResult';
import { fetchSearchResults } from '@/api/search/fetchSearchResults';

// 타입 정의
interface RepoSearchResult {
  memberUuid: string;
  memberNickname: string;
  memberImg: string;
  repoViewId: number;
  repoViewPath: string;
  repoViewTitle: string;
  repoViewSubtitle: string;
  repoMemberCnt: number;
  skillList: Array<{
    codeId: number;
    codeName: string;
  }>;
  repoStartDate: string;
  repoEndDate: string;
  isMine: boolean;
}

interface MemberSearchResult {
  memberUuid: string;
  memberNickName: string;
  memberImg: string;
  memberIntro: string;
  skillList: Array<{
    codeId: number;
    codeName: string;
  }>;
  memberJobCodeId: number;
  isMine: boolean;
  isBookmark: boolean;
}

const SearchPage = () => {
  const [results, setResults] = useState<RepoSearchResult[] | MemberSearchResult[]>([]);
  const [searchQuery, setQuery] = useState<string>(''); // 검색어 상태
  const [searchType, setSearchType] = useState<'repo' | 'member'>('repo');
  const [page, setPage] = useState<number>(0);
  // 검색 실행 함수
  const handleSearch = async (query: string, type: 'repo' | 'member') => {
    setQuery(query);
    setSearchType(type);
    console.log(searchQuery, searchType, page);
    const data = await fetchSearchResults(searchQuery, searchType, page);
    setResults(data); // 검색 결과 상태 업데이트
    console.log(data);
  };

  return (
    <Main>
      <SearchInput onSearch={handleSearch} />
      <ResultComponent>
        {results.length > 0 ? (
          <SearchResult results={results} type={searchType} />
        ) : (
          <p>검색 결과가 없습니다.</p>
        )}
      </ResultComponent>
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

export default SearchPage;
