import React, { useState } from 'react';
import tw from 'tailwind-styled-components';

// type 지정
interface SearchProps {
  onSearch: (query: string, type: 'repo' | 'user') => void;
}

const SearchInput: React.FC<SearchProps> = ({ onSearch }) => {
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
    onSearch(query, type as 'repo' | 'user');
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Input type="text" value={query} onChange={handleQueryChange} placeholder="검색어를 입력하세요" />
      <Label>
        <Radio type="radio" value="repo" checked={type === 'repo'} onChange={handleTypeChange} />
        레포지토리
        <Radio type="radio" value="user" checked={type === 'user'} onChange={handleTypeChange} />
        사용자
      </Label>
      <Button type="submit">검색</Button>
    </Form>
  );
};

const Form = tw.form`
  mt-6
  flex
  flex-row
  justify-center
  items-center
  max-width-screen-xl
  justify-around
  `;

const Input = tw.input`
  border
  h-3/4
  w-3/4
  p-3
  text-xl
  font-bold
  rounded-xl
  `;

const Label = tw.label`
  block 
  my-3
  mx-2
  text-xl
  font-medium
  `;

const Radio = tw.input`
  mx-4
  `;

const Button = tw.button`
  bg-appBlue1
  text-white
  px-3
  py-1
  mx-2
  text-xl
  font-medium
  rounded-full
  `;

export default SearchInput;