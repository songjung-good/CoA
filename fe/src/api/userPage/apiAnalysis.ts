import UseAxios from "./../common/useAxios";

export interface CommitScoreDto {
  readability: number;
  performance: number;
  reusability: number;
  testability: number;
  exception: number;
  total: number;
}

interface RepoAnalysisDto {
  repoViewId: number;
  comment: string;
  commitScore: CommitScoreDto;
}

interface Jobs {
  [key: string]: CommitScoreDto;
}

interface MyScore {
  [key: string]: CommitScoreDto;
}

export interface RepoAnalysisResponse {
  jobs: Jobs;
  myScore: MyScore;
  repos: RepoAnalysisDto[];
}

const axios = UseAxios();
export const getUserAnalysisData = async (UUID: string) => {
  const response = await axios.get(`/api/member/${UUID}/analysis`);
  console.log(response);
};

export const getUserAnalysisDummyData = (UUID: string) => {
  return dummyData;
};
const dummyData: RepoAnalysisResponse = {
  jobs: {
    ALL: {
      readability: 88,
      performance: 77,
      reusability: 99,
      testability: 66,
      exception: 55,
      total: 385,
    },
    FE: {
      readability: 66,
      performance: 88,
      reusability: 77,
      testability: 99,
      exception: 66,
      total: 396,
    },
    BE: {
      readability: 77,
      performance: 66,
      reusability: 88,
      testability: 77,
      exception: 44,
      total: 352,
    },
    IOT: {
      readability: 99,
      performance: 77,
      reusability: 66,
      testability: 88,
      exception: 55,
      total: 385,
    },
  },
  myScore: {
    user1: {
      readability: 77,
      performance: 66,
      reusability: 88,
      testability: 77,
      exception: 44,
      total: 352,
    },
  },
  repos: [
    {
      repoViewId: 1,
      comment: "This is a dummy comment for repo 1",
      commitScore: {
        readability: 77,
        performance: 88,
        reusability: 99,
        testability: 77,
        exception: 66,
        total: 407,
      },
    },
    {
      repoViewId: 2,
      comment: "This is a dummy comment for repo 2",
      commitScore: {
        readability: 66,
        performance: 77,
        reusability: 88,
        testability: 99,
        exception: 55,
        total: 385,
      },
    },
  ],
};
