import React, { useState } from 'react';
import tw from 'tailwind-styled-components';

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
    <Form onSubmit={handleSubmit}>
      <Input type="text" value={query} onChange={handleQueryChange} placeholder="검색어를 입력하세요" />
      <div>
        <Label>
          <Radio type="radio" value="repo" checked={type === 'repo'} onChange={handleTypeChange} />
          레포지토리
        </Label>
        <Label>
          <Radio type="radio" value="user" checked={type === 'user'} onChange={handleTypeChange} />
          사용자
        </Label>
      </div>
      <Button type="submit">검색</Button>
    </Form>
  );
};

const Form = tw.form`mt-6`;
const Input = tw.input`border p-2 rounded`;
const Label = tw.label`block mt-3`;
const Radio = tw.input`mr-2`;
const Button = tw.button`mt-4 bg-blue-500 text-white p-2 rounded`;

export default Search;