// 라이브러리
import React, { useState } from 'react';
import tw from 'tailwind-styled-components';

// type 지정
interface SearchProps {
  onSearch: (query: string, type: 'repo' | 'member') => void;
}

const SearchInput: React.FC<SearchProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [type, setType] = useState<'repo' | 'member'>('repo'); // 기본값: 레포지토리 검색

  // 입력 값
  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue === 'repo' || newValue === 'member') {
      setType(newValue);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(query, type);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Input 
        type="text" 
        value={query} 
        onChange={handleQueryChange} 
        placeholder={type === 'repo' ? '예시) https://github.com/ssafy-mate/ssafy-mate_front-end' : '예시) songjung-good'}
      />
      <fieldset>
        <legend>검색 유형</legend>
        <Label>
          <Radio type="radio" name="searchType" value="repo" checked={type === 'repo'} onChange={handleTypeChange} />
          레포지토리
          <Radio type="radio" name="searchType" value="member" checked={type === 'member'} onChange={handleTypeChange} />
          사용자
        </Label>
      </fieldset>
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