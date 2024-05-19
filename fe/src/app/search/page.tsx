"use client";
// 라이브러리
import React, { useState } from "react";
import tw from "tailwind-styled-components";
import { useRouter } from "next/navigation";
// 컴포넌트
import SearchInput from "@/app/search/SearchInput";
import { fetchSearchResults } from "@/api/search/fetchSearchResults";
import RepoCard from "@/components/searchcomponents/RepoCard";
import MyUserCard from "@/components/usercard/MyUserCard";
import MemberCard from "@/components/searchcomponents/MemberCard";

// 타입 정의
interface Skill {
  codeId: number;
  codeName: string;
}

interface RepoCardDto {
  memberUuid: string;
  memberNickname: string;
  memberImg: string;
  repoViewId: number;
  repoViewPath: string;
  repoViewTitle: string;
  repoViewSubtitle: string;
  repoMemberCnt: number;
  skillList: Skill[];
  repoStartDate: string;
  repoEndDate: string;
  isMine: boolean;
}

interface MemberCardDto {
  memberUuid: string;
  memberNickName: string;
  memberImg: string;
  memberIntro: string;
  skillList: Skill[];
  memberJobCodeId: number;
  isMine: boolean;
  isBookmark: boolean;
}

interface ResultDTO {
  isSuccess: boolean;
  message: string;
  code: number;
  result: {
    repoCardDtoList: RepoCardDto[] | undefined;
    memberCardDtoList: MemberCardDto[] | undefined;
    next: boolean;
  };
}

type RepoType = RepoCardDto[] | undefined;
type MemberType = MemberCardDto[] | undefined;

const SearchPage = () => {
  const [searchQuery, setQuery] = useState<string>("");
  const [searchType, setSearchType] = useState<"repo" | "member">("repo");
  const [results, setResults] = useState<ResultDTO>();
  const [searchRepoData, setSearchRepoData] = useState<RepoType>(undefined);
  const [searchMemberData, setSearchMemberData] =
    useState<MemberType>(undefined);
  const [page, setPage] = useState<number>(0);
  const [isNext, setIsNext] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // 검색 실행 함수
  const handleSearch = async (query: string, type: "repo" | "member") => {
    try {
      setQuery(query);
      setSearchType(type);
      setResults(undefined);
      setPage(0);
      setIsNext(false);
      setError(null);
      const response = await fetchSearchResults(query, type, page);
      setResults(response);
      setIsNext(response.result.next);
      setSearchRepoData(response.result.repoCardDtoList);
      setSearchMemberData(response.result.memberCardDtoList);
    } catch (error) {
      console.error(error);
      setError("검색 중 오류가 발생했습니다.");
    }
  };

  // 페이지 변경 함수
  const handlePageChange = async (page: number) => {
    try {
      setPage(page);
      const response = await fetchSearchResults(searchQuery, searchType, page);
      setResults(response);
      setIsNext(response.result.next);
    } catch (error) {
      console.error(error);
      setError("페이지 변경 중 오류가 발생했습니다.");
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSearch(searchQuery, searchType);
    }
  };

  const handleDetailClick = (uuid: string) => {
    router.push(`/user/${uuid}`)
  };

  return (
    <Main className="max-w-screen-xl mx-auto">
      {/* <H2>
        검색페이지
      </H2> */}
      <SearchInput onSearch={handleSearch} onKeyPress={handleKeyPress} />
      {searchRepoData?.length === 0 && <p>검색 결과가 없습니다.</p>}
      {searchMemberData?.length === 0 && <p>검색 결과가 없습니다.</p>}
      {results ? (
        searchType === "repo" ? (
          <ResultComponent className="mt-8 grid gap-8 grid-cols-1 justify-center items-start">
            {(results.result.repoCardDtoList as RepoCardDto[])?.map(
              (result, index) => (
                <RepoCard
                  key={`repo-${result.repoViewId}-${index}`}
                  data={result}
                />
              ),
            )}
          </ResultComponent>
        ) : (
          <ResultComponent className="mt-8 grid gap-8 grid-cols-1 justify-center items-start">
            {(results.result.memberCardDtoList as MemberCardDto[])?.map(
              (result) => (
                // <MemberCard key={result.memberUuid} memberInfo={result} />
                <MemberButton key={result.memberUuid}  onClick={() => handleDetailClick(result.memberUuid)}>
                  <MyUserCard key={result.memberUuid} uuid={result.memberUuid} />
                </MemberButton>
              ),
            )}
          </ResultComponent>
        )
      ) : (
        <p>CoA의 레포지토리 및 사용자를 검색을 통해 알아보세요!</p>
      )}
      {results && (
        <PageTransition>
          {!isNext || (
            <RightButton onClick={() => handlePageChange(page + 1)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"
                />
              </svg>
            </RightButton>
          )}
          {page > 0 && (
            <LeftButton onClick={() => handlePageChange(page - 1)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5"
                />
              </svg>
            </LeftButton>
          )}
        </PageTransition>
      )}
    </Main>
  );
};

const Main = tw.div`
  max-w-screen-xl
  mx-auto
`;

const H2 = tw.h2`
  text-3xl
  font-bold
  mt-8
  mb-4
  text-center
  text-black
`;

const ResultComponent = tw.div`
  mt-8
  grid
  gap-8
  grid-cols-1
  justify-center
  items-start
`;

const PageTransition = tw.div`
  mt-3
  flex
  flex-row-reverse
  justify-right
`;

const Button = tw.button`
  bg-appYellow
  text-black
  px-3
  py-1
  m-2
  text-xl
  font-sm
  rounded-xl
  transition-all
  border-2 border-transparent
  hover:border-appRed
  bottom-0
`;

const MemberButton = tw.div`
  justify-left
  border-2 
  border-transparent
  rounded-xl
  transition-all
  hover:border-appRed
  hover:cusor-pointer
`;

const LeftButton = tw(Button)`
  left-0
`;

const RightButton = tw(Button)`
  right-0
`;

export default SearchPage;
