'use client'

import React, { useState } from 'react';
import SearchInput from '@/components/searchcomponents/SearchInput';
import SearchResult from '@/components/searchcomponents/SearchResult'; 

// 임시 데이터 import 및 type 지정
import RepoCardDTO from '@/components/searchcomponents/RepoCardDTO';
import MembercardDTO from '@/components/searchcomponents/MemberInfo';

// 타입 정의
interface RepoDataType {
  url: string;
  memberId: number;
  memberNickName: string;
  memberImg: string;
  repoViewId: number;
  repoViewTitle: string;
  repoViewSubTitle: string;
  skillList: string[];
  dateRange: { startDate: string; endDate: string };
  isMine: boolean;
};

interface MemberDataType {
  memberId: number;
  memberNickName: string;
  memberImg: string;
  memberIntro: string;
  skillList: string[];
}

const SearchPage = () => {
  const [results, setResults] = useState<RepoDataType[] | MemberDataType[]>([]); 
  const [searchType, setSearchType] = useState<'repo' | 'user'>('repo');

  // 검색 처리 함수
  const handleSearch = (query: string, type: 'repo' | 'user') => {
    setSearchType(type); 
  
    if (type === 'repo') {
      // URL로 레포지토리 데이터 검색
      const foundData = RepoCardDTO.filter(repo => repo.url === query);
      setResults(foundData); 
    } else {
      // 사용자 이름으로 사용자 데이터 검색 
      const foundUsers = MembercardDTO.filter(user => 
        user.memberNickName.toLowerCase().includes(query.toLowerCase())
      );
      setResults(foundUsers);
    }
  };

  return (
    <div>
      <SearchInput onSearch={handleSearch} />
      <div>
        {results.length > 0 && (
          <SearchResult results={results} type={searchType} /> 
        )}
        {/* 검색 결과가 없을 경우 메시지 표시 */}
        {results.length === 0 && <p>검색 결과가 없습니다.</p>}
      </div>
    </div>
  );
};

export default SearchPage;