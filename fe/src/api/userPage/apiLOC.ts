import UseAxios from "../common/useAxios";

interface LanguageStats {
  [language: string]: number;
}

interface RepoInfo {
  memberUuid: string;
  memberNickname: string;
  memberImg: string;
  repoViewId: number;
  repoViewPath: string;
  repoViewTitle: string;
  repoViewSubtitle: string | null;
  repoMemberCnt: number;
  skillList: number[] | null;
  repoStartDate: string;
  repoEndDate: string;
  isMine: boolean;
}

interface Repository {
  name: string;
  createdAt: string;
  pushedAt: string;
  updatedAt: string;
  languages: LanguageStats;
  totalLinesOfCode: number;
  repoInfo: RepoInfo;
}

interface GithubLOC {
  isSuccess: boolean;
  message: string;
  code: number;
  result: Repository[];
}
export const getGithubLOCData = async (memberUuid: string) => {
  // console.log("깃허브");
  try {
    const response = await UseAxios().get<GithubLOC>(
      `/api/member/${memberUuid}/lines`,
    );
    // console.log("getGithubLOCData");
    // console.log(response);
    const data: Repository[] = response.data.result;
    if (data.length !== 0) {
      return data;
    } else {
      return examData;
    }
  } catch (error) {
    console.error(
      `getGithubLOCData 요청 에러 / memberUuid :${memberUuid}`,
      error,
    );
    return [
      {
        name: "서버 에러",
        createdAt: "1111-11-11",
        pushedAt: "1111-11-11",
        updatedAt: "1111-11-11",
        languages: { error: 500 },
        totalLinesOfCode: 500,
        repoInfo: {
          memberUuid: "354c3fca-4e1c-4056-a322-40f4f0eb282e",
          memberNickname: "dev",
          memberImg:
            "https://lh3.googleusercontent.com/a/ACg8ocIxvVe286rJnlbKZ6ElOfLTFA9qqi138ljSb5Ojr3mecdqbxA=s96-c",
          repoViewId: 5,
          repoViewPath: "https://github.com/rlagkdud/Spring-Pay-System",
          repoViewTitle: "서버 에러",
          repoViewSubtitle: "서버 에러",
          repoMemberCnt: 8,
          skillList: null,
          repoStartDate: "1111-11-11",
          repoEndDate: "1111-11-11",
          isMine: false,
        },
      },
    ];
  }
};

const examData = [
  {
    name: "분석한 레포지토리가 없습니다.",
    createdAt: "2000-01-11",
    pushedAt: "2000-11-11",
    updatedAt: "2000-11-11",
    languages: { HTML: 300, JavaScript: 1200, CSS: 900 },
    totalLinesOfCode: 2400,
    repoInfo: {
      memberUuid: "354c3fca-4e1c-4056-a322-40f4f0eb282e",
      memberNickname: "dev",
      memberImg:
        "https://lh3.googleusercontent.com/a/ACg8ocIxvVe286rJnlbKZ6ElOfLTFA9qqi138ljSb5Ojr3mecdqbxA=s96-c",
      repoViewId: 5,
      repoViewPath: "https://github.com/rlagkdud/Spring-Pay-System",
      repoViewTitle: "분석한 레포지토리가 없습니다.",
      repoViewSubtitle: "분석을 진행해 주세요",
      repoMemberCnt: 8,
      skillList: null,
      repoStartDate: "2024-03-03",
      repoEndDate: "2024-05-01",
      isMine: false,
    },
  },
  {
    name: "분석을 진행해 주세요",
    createdAt: "2000-06-11",
    pushedAt: "2000-11-20",
    updatedAt: "2000-11-11",
    languages: { Java: 1600 },
    totalLinesOfCode: 1600,
    repoInfo: {
      memberUuid: "354c3fca-4e1c-4056-a322-40f4f0eb282e",
      memberNickname: "dev",
      memberImg:
        "https://lh3.googleusercontent.com/a/ACg8ocIxvVe286rJnlbKZ6ElOfLTFA9qqi138ljSb5Ojr3mecdqbxA=s96-c",
      repoViewId: 5,
      repoViewPath: "https://github.com/rlagkdud/Spring-Pay-System",
      repoViewTitle: "분석을 진행해 주세요",
      repoViewSubtitle: "분석한 레포지토리가 없습니다.",
      repoMemberCnt: 8,
      skillList: null,
      repoStartDate: "2024-03-03",
      repoEndDate: "2024-05-01",
      isMine: false,
    },
  },
];
