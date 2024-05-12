import React from 'react';
// 컴포넌트
import RepoCard from './RepoCard';
import MemberCard from './MemberCard';

// 타입 정의
interface RepoSearchResult {
  url: string,
  memberId: string;
  memberNickName: string;
  memberImg: string;
  repoViewId: number;
  repoViewTitle: string;
  repoViewSubTitle: string;
  repoMemberCnt: number;
  skillList: string[];
  dateRange: {
    startDate: string;
    endDate: string;
  };
  isMine: boolean;
}

interface MemberSearchResult {
  memberId: string;
  memberNickName: string;
  memberImg: string;
  memberIntro: string;
  skillList: string[];
  memberJobCodeId: number;
  isMine: boolean;
  isBookmark: boolean;
}

interface SearchResultProps {
  results: RepoSearchResult[] | MemberSearchResult[];
  type: 'repo' | 'member';
}

const SearchResult: React.FC<SearchResultProps> = ({ results, type }) => {
  if (type === 'repo') {
    const repoResults = results as RepoSearchResult[];
    return (
      <div>
        {repoResults.map((result) => (
          <RepoCard key={result.repoViewId} repoInfo={result} />
        ))}
      </div>
    );
  } else if (type === 'member') {
    const memberResults = results as MemberSearchResult[];
    return (
      <div>
        {memberResults.map((result) => (
          <MemberCard key={result.memberId} memberInfo={result} />
        ))}
      </div>
    );
  }
  return "잘못된 검색어 입니다."; 
};

export default SearchResult;