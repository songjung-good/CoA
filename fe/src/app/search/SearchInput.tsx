// 라이브러리
import React, { useState } from "react";
import tw from "tailwind-styled-components";

// type 지정
interface SearchProps {
  onSearch: (query: string, type: "repo" | "member") => void;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const SearchInput: React.FC<SearchProps> = ({ onSearch, onKeyPress }) => {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<"repo" | "member">("repo");
  const [focus, setFocus] = useState<"repo" | "member">("repo");

  // 입력 값 변경 핸들러
  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  // 검색 타입 변경 핸들러
  const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue === "repo" || newValue === "member") {
      setType(newValue);
    }
  };

  // 폼 제출 핸들러
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지
    onSearch(query, type); // 검색 실행
  };

  // 버튼 클릭 핸들러 - 타입 변경 및 검색 실행
  const handleButtonClick = (value: "repo" | "member") => {
    setType(value); // 검색 타입 설정
    setFocus(value); // 포커스 설정
    onSearch(query, value); // 검색 실행
  };

  // 키 입력 핸들러
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // 폼 제출을 막기 위해 추가
      onSearch(query, type); // 검색 실행
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Fieldset>
        <legend className="m-1">검색 유형</legend>
        <RadioContainer>
          <RadioButton
            type="button" // 버튼 타입 지정
            onClick={() => handleButtonClick("repo")}
            data-focus={focus === "repo"}
          >
            <Radio
              type="radio"
              name="searchType"
              value="repo"
              checked={type === "repo"}
              onChange={handleTypeChange} // 검색 타입 변경 핸들러
              id="searchRepo"
              className="hidden"
            />
            <Label htmlFor="searchRepo" className="cursor-pointer">
              레포지토리
            </Label>
          </RadioButton>
          <RadioButton
            type="button" // 버튼 타입 지정
            onClick={() => handleButtonClick("member")}
            data-focus={focus === "member"}
          >
            <Radio
              type="radio"
              name="searchType"
              value="member"
              checked={type === "member"}
              onChange={handleTypeChange} // 검색 타입 변경 핸들러
              id="searchMember"
              className="hidden"
            />
            <Label htmlFor="searchMember" className="cursor-pointer">
              사용자
            </Label>
          </RadioButton>
        </RadioContainer>
      </Fieldset>
      <InputBar>
        <Input
          type="text"
          value={query}
          onChange={handleQueryChange} // 입력 값 변경 핸들러
          placeholder={
            type === "repo"
              ? "CoA를 통해 분석된 프로젝트 검색할 수 있습니다."
              : "CoA에 등록된 사용자를 검색할 수 있습니다."
          }
          onKeyPress={handleKeyPress} // 키 입력 핸들러
        />
        <Button type="submit">검색</Button>
      </InputBar>
    </Form>
  );
};

const Form = tw.form`
  my-6
  flex
  flex-col
  items-start
  max-width-screen-xl
  justify-around
  border
  rounded-lg
  shadow-lg
  p-4
  hover:bg-appGrey1
`;

const Fieldset = tw.fieldset`
  self-start
  mb-4
  ml-[2%]
`;

const RadioContainer = tw.div`
  flex
  flex-auto
  justify-evenly
  border
  rounded-md
`;

// data-focus 속성으로 포커스 상태를 확인하여 스타일 적용
const RadioButton = tw.button<{ "data-focus": boolean }>`
  border
  px-6
  py-1
  rounded-md
  w-full
  flex
  items-center
  transition
  hover:bg-gray-200
  ${({ "data-focus": focus }) => focus && "border-2 border-appBlue2"}
`;

const Radio = tw.input``;

const Label = tw.label`
  whitespace-nowrap
  mx-2
  my-2
  text-md
  font-medium
`;

const InputBar = tw.div`
  flex
  items-center
  justify-around
  w-full
`;

const Input = tw.input`
  border
  h-3/4
  w-[90%]
  p-3
  text-xl
  font-sm
  rounded-xl
  transition
`;

const Button = tw.button`
  bg-appBlue2
  text-white
  p-2
  mx-2
  text-xl
  font-medium
  rounded-lg
  transition
  hover:bg-appBlue1
`;

export default SearchInput;
