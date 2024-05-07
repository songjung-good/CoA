import { create, StateCreator } from "zustand";
import { persist, createJSONStorage, PersistOptions } from 'zustand/middleware'

interface ResultState {
  isSuccess: boolean;
  message: string;
  code: number;
  result: Result;
  setIsMine: () => void;  // Define the method for setting isMine to true
  setIsOther: () => void; // Define the method for setting isMine to false
}

interface Result {
  repoCardDto: RepoCardDto;
  basicDetailDto: BasicDetailDto;
  commitScoreDto: CommitScoreDto;
}

interface RepoCardDto {
  memberId: number;
  memberNickname: string;
  memberImg: string;
  repoViewId: number;
  repoViewPath: string;
  repoViewTitle: string;
  repoViewSubtitle: string;
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

const useResultStore = create<ResultState>(
  (persist as resultPersist)(
    (set) => ({
      isSuccess: true,
      message: "string",
      code: 0,
      result: {
        repoCardDto: {
          memberId: 0,
          memberNickname: "string",
          memberImg: "string",
          repoViewId: 0,
          repoViewPath: "string",
          repoViewTitle: "string",
          repoViewSubtitle: "string",
          skillList: [{
            codeId: 0,
            codeName: "string"
          }],
          repoStartDate: "2024-05-07",
          repoEndDate: "2024-05-07",
          isMine: true
        },
        basicDetailDto: {
          repoReadme: "string",
          repoViewResult: "string",
          commentList: [{
            commentStartIndex: 0,
            commentEndIndex: 0,
            commentContent: "string"
          }],
          repoViewTotalCommitCnt: 0,
          repoViewCommitCnt: 0,
          repoViewMemberCnt: 0,
          repoLineCntList: [{
            codeName: "string",
            lineCnt: 0
          }]
        },
        commitScoreDto: {
          readability: 0,
          performance: 0,
          reusability: 0,
          testability: 0,
          exception: 0,
          total: 0,
          scoreComment: "string"
        }
      },
      setIsMine: () => set(state => ({ ...state, result: { ...state.result, repoCardDto: { ...state.result.repoCardDto, isMine: true } } })),
      setIsOther: () => set(state => ({ ...state, result: { ...state.result, repoCardDto: { ...state.result.repoCardDto, isMine: false } } }))
    }),
    {
      name: 'result-store',
      storage: createJSONStorage(() => localStorage)
    }
  )
);

export default useResultStore;