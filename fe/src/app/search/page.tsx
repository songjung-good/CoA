// src/pages/SearchPage.jsx
'use client'

import React, { useState } from 'react';
import Search from '@/components/searchcomponents/Search';
import RepoCard from '@/components/searchcomponents/RepoCard';

// 임시 데이터
const RepoCardDTO = [
  {
    "memberId": 1,
    "memberNickName": "songjung-good",
    "memberImg": "https://example.com/image.jpg",
    "repoViewId": 1,
    "repoViewTitle": "My First Repository",
    "repoViewSubTitle": "This is a subtitle",
    "skillList": ["JavaScript", "React"],
    "dateRange": {
      "startDate": "2022-01-01",
      "endDate": "2022-12-31"
    },
    "isMine": true
  },
  {
    "memberId": 2,
    "memberNickName": "another-user",
    "memberImg": "https://example.com/image2.jpg",
    "repoViewId": 2,
    "repoViewTitle": "Another Repository",
    "repoViewSubTitle": "Another subtitle",
    "skillList": ["Python", "Django"],
    "dateRange": {
      "startDate": "2022-01-01",
      "endDate": "2022-12-31"
    },
    "isMine": false
  }
];

const SearchPage = () => {
  const [results, setResults] = useState([]);

  // URL을 통한 검색 로직 구현
  const handleSearch = (query: string, type: string) => {
    // URL search logic - URL 입력이 'Repo' 타입일 때만 처리
    if (type === 'repo') {
      // 단순 예시: 실제 구현에서는 URL을 바탕으로 적절한 검색 로직 필요
      setResults(RepoCardDTO.filter(repo => repo.repoViewTitle.toLowerCase().includes(query.toLowerCase())));
    }
    // 사용자 검색 로직 or 다른 로직은 이곳에 구현
  };

  return (
    <div>
      <Search onSearch={handleSearch} />
      <div>
        {results.map((result) => (
          <RepoCard key={result.repoViewId} type="repo" data={result} />
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
