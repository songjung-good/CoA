import UseAxios from "../common/useAxios";

interface Skill {
  codeId: number;
  codeName: string;
}
interface RoposData {
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
interface apiResponse {
  isSuccess: boolean;
  message: string;
  code: number;
  result: RoposData[];
}

export const getReposData = async (memberUuid: string) => {
  // console.log("깃허브");
  try {
    const response = await UseAxios().get(`/api/member/${memberUuid}/repos`);
    // console.log(response);
    return response.data.result;
  } catch (error) {
    console.error(`getReposData 요청 에러 / memberUuid :${memberUuid}`, error);
  }
};
