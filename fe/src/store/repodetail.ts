import { create, StateCreator } from "zustand";
import { persist, createJSONStorage, PersistOptions } from 'zustand/middleware'

interface ResultState {
  isSuccess: boolean;
  message: string;
  code: number;
  result: Result;
  updateResultState: (newState: Partial<ResultState>) => void; // 전체 상태를 업데이트하는 함수
}

interface Result {
  repoCardDto: RepoCardDto;
  basicDetailDto: BasicDetailDto;
  commitScoreDto: CommitScoreDto;
}

interface RepoCardDto {
  memberUuid: number;
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

interface Skill {
  codeId: number;
  codeName: string;
}

interface BasicDetailDto {
  repoReadme: string;
  repoViewResult: string;
  commentList: Comment[];
  repoViewTotalCommitCnt: number;
  repoViewCommitCnt: number;
  repoViewMemberCnt: number;
  repoLineCntList: RepoLineCnt[];
}

interface Comment {
  commentStartIndex: number;
  commentEndIndex: number;
  commentContent: string;
}

interface RepoLineCnt {
  codeName: string;
  lineCnt: number;
}

interface CommitScoreDto {
  readability: number;
  performance: number;
  reusability: number;
  testability: number;
  exception: number;
  total: number;
  scoreComment: string;
}

type resultPersist = (
  config: StateCreator<ResultState>,
  options: PersistOptions<ResultState>
) => StateCreator<ResultState>

const useRepoDetailStore = create<ResultState>(
  (persist as resultPersist)(
    (set) => ({
      isSuccess: true,
      message: "Initial message",
      code: 0,
      result: {
        repoCardDto: {
          memberUuid: 0,
          memberNickname: "Initial name",
          memberImg: "Initial image URL",
          repoViewId: 0,
          repoViewPath: "Initial path",
          repoViewTitle: "Initial title",
          repoViewSubtitle: "Initial subtitle",
          repoMemberCnt: 0,
          skillList: [],
          repoStartDate: "2024-05-07",
          repoEndDate: "2024-05-07",
          isMine: true
        },
        basicDetailDto: {
          repoReadme: "Initial README",
          repoViewResult: "Initial result",
          commentList: [],
          repoViewTotalCommitCnt: 0,
          repoViewCommitCnt: 0,
          repoViewMemberCnt: 0,
          repoLineCntList: []
        },
        commitScoreDto: {
          readability: 0,
          performance: 0,
          reusability: 0,
          testability: 0,
          exception: 0,
          total: 0,
          scoreComment: "Initial comment"
        }
      },
      updateResultState: (newState: Partial<ResultState>) => set(newState)  // 전체 상태를 업데이트
    }),
    {
      name: 'repodetail-store',
      storage: createJSONStorage(() => localStorage)
    }
  )
);

export default useRepoDetailStore;