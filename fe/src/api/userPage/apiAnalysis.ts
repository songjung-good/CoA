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

export interface Jobs {
  [key: string]: CommitScoreDto;
}

interface MyScore {
  [key: string]: CommitScoreDto;
}

export interface RepoAnalysisResponse {
  jobs: Jobs;
  myScoreAverage: CommitScoreDto | null;
  repos: RepoAnalysisDto[];
}

const axios = UseAxios();
export const getUserAnalysisData = async (UUID: string) => {
  const response = await axios.get(`/api/member/${UUID}/analysis`);
  console.log("getUserAnalysisData");
  console.log(response.data.result);
  const data: RepoAnalysisResponse = response.data.result;
  return data;
};

export const getUserAnalysisDummyData = (UUID: string) => {
  return dummyData;
};
const dummyData: RepoAnalysisResponse = {
  jobs: {
    "2000": {
      exception: 52,
      total: 30,
      readability: 32.4,
      performance: 44.06666666666667,
      reusability: 44.666666666666664,
      testability: 48.06666666666667,
    },
    "2001": {
      exception: 50,
      total: 30,
      readability: 16,
      performance: 20,
      reusability: 32,
      testability: 40,
    },
    "2004": {
      exception: 52.30769230769231,
      total: 30,
      readability: 34.92307692307692,
      performance: 47.76923076923077,
      reusability: 46.61538461538461,
      testability: 49.30769230769231,
    },
  },
  myScoreAverage: null,
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
