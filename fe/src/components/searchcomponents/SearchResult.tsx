import React from 'react';
// 컴포넌트
import RepoCard from './RepoCard';

interface SearchResultProps {
  results: any[];
  type: string;
}

const SearchResult: React.FC<SearchResultProps> = ({ results, type }) => {
  // type에 따라 다른 카드 컴포넌트 렌더링
  if (type === 'repo') {
    return (
      <div>
        {results.map((result) => (
          <RepoCard key={result.name} data={result} />
        ))}
      </div>
    );
  } else if (type === 'user') {
    return (
      <div>
        {/* 사용자 카드 컴포넌트 렌더링 (아직 구현되지 않음) */}
      </div>
    );
  }

  return null; 
};

export default SearchResult;