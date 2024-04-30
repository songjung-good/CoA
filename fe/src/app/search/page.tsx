'use client'

import React, { useState } from 'react';
import Search from '@/components/searchcomponents/Search';
import RepoCard from '@/components/searchcomponents/RepoCard';

const SearchPage = () => {
  const [results, setResults] = useState([]);

  const handleSearch = (query: string, type: string) => {
    // API 호출 등을 통해 검색 결과를 가져옴
    // ...
    // setResults( /* 검색 결과 */ ); 
  };

  return (
    <div>
      <Search onSearch={handleSearch} />
      <div>
        {results.map((result) => (
          <RepoCard key={result.id} type={result.type} data={result.data} />
        ))}
      </div>
    </div>
  );
};

export default SearchPage;