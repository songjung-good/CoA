import UseAxios from "../common/useAxios";

interface RepoSearchResult {
  memberUuid: string;
  memberNickname: string;
  memberImg: string;
  repoViewId: number;
  repoViewPath: string;
  repoViewTitle: string;
  repoViewSubtitle: string;
  repoMemberCnt: number;
  skillList: Array<{
    codeId: number;
    codeName: string;
  }>;
  repoStartDate: string;
  repoEndDate: string;
  isMine: boolean;
}

interface MemberSearchResult {
  memberUuid: string;
  memberNickName: string;
  memberImg: string;
  memberIntro: string;
  skillList: Array<{
    codeId: number;
    codeName: string;
  }>;
  memberJobCodeId: number;
  isMine: boolean;
  isBookmark: boolean;
}

export async function fetchSearchResults(query: string, type: 'repo' | 'member', page: number) {
  const axios = UseAxios();
  const params = {
    keyword: query,
    page: page, // 기본값 0
    size: 20, // 기본값 20
  };

  try {
    if (type === 'repo') {
      const response = await axios.get<{ isSuccess: boolean; message: string; code: number; result: RepoSearchResult[] }>('/api/search/repos', { params });
      if (!response.data.result) {
        throw new Error('검색 결과가 없습니다.');
      }
      return response.data.result.map(repo => ({
        url: repo.repoViewPath,
        memberId: repo.memberUuid,
        memberNickName: repo.memberNickname,
        memberImg: repo.memberImg,
        repoViewId: repo.repoViewId,
        repoViewTitle: repo.repoViewTitle,
        repoViewSubTitle: repo.repoViewSubtitle,
        repoMemberCnt: repo.repoMemberCnt,
        skillList: repo.skillList ? repo.skillList.map(skill => skill.codeName) : [],
        dateRange: { startDate: repo.repoStartDate, endDate: repo.repoEndDate },
        isMine: repo.isMine
      }));
    } else {
      const response = await axios.get<{ isSuccess: boolean; message: string; code: number; result: MemberSearchResult[] }>('/api/search/members', { params });
      if (!response.data.result) {
        throw new Error('검색 결과가 없습니다.');
      }
      return response.data.result.map(member => ({
        memberId: member.memberUuid,
        memberNickName: member.memberNickName,
        memberImg: member.memberImg,
        memberIntro: member.memberIntro,
        skillList: member.skillList ? member.skillList.map(skill => skill.codeName) : [],
        memberJobCodeId: member.memberJobCodeId,
        isMine: member.isMine,
        isBookmark: member.isBookmark,
      }));
    }
  } catch (error) {
    console.error('검색 중 오류가 발생했습니다. ', error);
    throw new Error('검색 중 오류가 발생했습니다.');
  }
}