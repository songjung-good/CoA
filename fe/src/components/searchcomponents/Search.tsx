import React, { useState } from 'react';

interface SearchProps {
  onSearch: (query: string, type: string) => void;
}

const Search: React.FC<SearchProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('repo'); // 기본값: 레포지토리 검색

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setType(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(query, type);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={query} onChange={handleQueryChange} placeholder="검색어를 입력하세요" />
      <div>
        <label>
          <input type="radio" value="repo" checked={type === 'repo'} onChange={handleTypeChange} />
          레포지토리
        </label>
        <label>
          <input type="radio" value="user" checked={type === 'user'} onChange={handleTypeChange} />
          사용자
        </label>
      </div>
      <button type="submit">검색</button>
    </form>
  );
};

export default Search;