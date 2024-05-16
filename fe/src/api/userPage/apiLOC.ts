import UseAxios from "../common/useAxios";

interface LanguageStats {
  [language: string]: number;
}

interface Repository {
  name: string;
  createdAt: string;
  pushedAt: string;
  updatedAt: string;
  languages: LanguageStats;
  totalLinesOfCode: number;
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
    const response = await UseAxios().get(
      `/api/external/github/${memberUuid}/lines-of-code`,
    );
    console.log("getGithubLOCData");
    console.log(response);
    const data: Repository[] = response.data.result;
    return data;
  } catch (error) {
    console.error(
      `getGithubLOCData 요청 에러 / memberUuid :${memberUuid}`,
      error,
    );
  }
};
