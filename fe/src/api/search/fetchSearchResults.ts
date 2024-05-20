import UseAxios from "../common/useAxios";

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

type ResultType = { repoCardDtoList: any[] } | { memberCardDtoList: any[] };

export async function fetchSearchResults(query: string, type: 'repo' | 'member', page: number) {
  const axios = UseAxios();
  const params = {
    keyword: query,
    page: page,
    size: 10,
  };
  try {
    if (type === 'repo') {
      const response = await axios.get<ResultDTO>('/api/search/repos', { params });
      if (!response.data.result) {
        throw new Error('검색 결과가 없습니다.');
      }
      return response.data; // 전체 ResultDTO 객체 반환
    } else {
      const response = await axios.get<ResultDTO>('/api/search/members', { params });
      if (!response.data.result) {
        throw new Error('검색 결과가 없습니다.');
      }
      return response.data; // 전체 ResultDTO 객체 반환
    }
  } catch (error) {
    console.error('검색 중 오류가 발생했습니다. ', error);
    throw new Error('검색 중 오류가 발생했습니다.');
  }
}